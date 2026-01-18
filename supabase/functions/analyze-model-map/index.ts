import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { category } = await req.json();

    if (!category) {
      return new Response(
        JSON.stringify({ error: 'Category is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing model map for category: ${category}`);

    // Fetch all completed tests for this category with results
    const { data: tests, error: testsError } = await supabase
      .from('tests')
      .select(`
        id,
        prompt:prompts!inner(category),
        test_results(
          model_id,
          accuracy_score,
          speed_score,
          style_score,
          practical_guidance_score,
          technical_detail_score,
          x_factor_score
        )
      `)
      .eq('status', 'complete')
      .eq('prompts.category', category);

    if (testsError) {
      console.error('Error fetching tests:', testsError);
      throw testsError;
    }

    if (!tests || tests.length === 0) {
      console.log('No completed tests found for category');
      return new Response(
        JSON.stringify({ message: 'No completed tests for this category' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all models
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('id, name, provider');

    if (modelsError) {
      console.error('Error fetching models:', modelsError);
      throw modelsError;
    }

    // Calculate average scores per model
    const modelScores: Record<string, {
      count: number;
      accuracy: number;
      speed: number;
      style: number;
      practical: number;
      technical: number;
      xFactor: number;
      model: { id: string; name: string; provider: string };
    }> = {};

    tests.forEach((test: any) => {
      test.test_results?.forEach((tr: any) => {
        const model = models?.find(m => m.id === tr.model_id);
        if (!model) return;

        if (!modelScores[tr.model_id]) {
          modelScores[tr.model_id] = {
            count: 0,
            accuracy: 0,
            speed: 0,
            style: 0,
            practical: 0,
            technical: 0,
            xFactor: 0,
            model,
          };
        }

        const ms = modelScores[tr.model_id];
        ms.count++;
        ms.accuracy += tr.accuracy_score || 0;
        ms.speed += tr.speed_score || 0;
        ms.style += tr.style_score || 0;
        ms.practical += tr.practical_guidance_score || 0;
        ms.technical += tr.technical_detail_score || 0;
        ms.xFactor += tr.x_factor_score || 0;
      });
    });

    // Calculate overall scores and sort
    const rankedModels = Object.entries(modelScores)
      .map(([modelId, data]) => ({
        modelId,
        model: data.model,
        avgAccuracy: data.count > 0 ? data.accuracy / data.count : 0,
        avgSpeed: data.count > 0 ? data.speed / data.count : 0,
        avgStyle: data.count > 0 ? data.style / data.count : 0,
        avgPractical: data.count > 0 ? data.practical / data.count : 0,
        avgTechnical: data.count > 0 ? data.technical / data.count : 0,
        avgXFactor: data.count > 0 ? data.xFactor / data.count : 0,
        overall: data.count > 0
          ? (data.accuracy + data.speed + data.style + data.practical + data.technical) / (data.count * 5)
          : 0,
      }))
      .sort((a, b) => b.overall - a.overall);

    if (rankedModels.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No model scores available' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const winner = rankedModels[0];
    const runnerUp = rankedModels.length > 1 ? rankedModels[1] : null;

    // Prepare context for LLM
    const context = `
You are analyzing AI model performance data for the "${category}" use case category.

Here are the top performing models with their average scores (1-5 scale):

${rankedModels.slice(0, 5).map((m, i) => `
${i + 1}. ${m.model.name} (${m.model.provider})
   - Accuracy: ${m.avgAccuracy.toFixed(2)}
   - Speed: ${m.avgSpeed.toFixed(2)}
   - Style: ${m.avgStyle.toFixed(2)}
   - Practical Guidance: ${m.avgPractical.toFixed(2)}
   - Technical Detail: ${m.avgTechnical.toFixed(2)}
   - X-Factor: ${m.avgXFactor.toFixed(2)}
   - Overall: ${m.overall.toFixed(2)}
`).join('\n')}

Based on this data, generate:
1. A short tagline (1 sentence) for the winner model explaining why it's best for ${category}
2. A short tagline (1 sentence) for the runner-up if there is one
3. A pro-tip (1-2 sentences) about best practices for using AI models in ${category} tasks
4. 2-3 bullet points about strengths of top models in this category
5. 2-3 bullet points about weaknesses or limitations to watch for

Respond in JSON format:
{
  "winner_tagline": "...",
  "runner_up_tagline": "...",
  "pro_tip": "...",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."]
}
`;

    // Call Lovable AI via gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'user',
            content: context,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      throw new Error('Failed to get AI analysis');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';

    // Parse AI response
    let insights = {
      winner_tagline: `Top performer for ${category} tasks`,
      runner_up_tagline: runnerUp ? `Strong alternative for ${category}` : null,
      pro_tip: `Consider your specific needs when choosing a model for ${category} tasks.`,
      strengths: ['Consistent performance across tests'],
      weaknesses: ['Individual results may vary'],
    };

    try {
      // Extract JSON from response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        insights = {
          winner_tagline: parsed.winner_tagline || insights.winner_tagline,
          runner_up_tagline: parsed.runner_up_tagline || insights.runner_up_tagline,
          pro_tip: parsed.pro_tip || insights.pro_tip,
          strengths: parsed.strengths || insights.strengths,
          weaknesses: parsed.weaknesses || insights.weaknesses,
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Use defaults
    }

    // Upsert into model_map_insights
    const { error: upsertError } = await supabase
      .from('model_map_insights')
      .upsert({
        category,
        winner_model_id: winner.modelId,
        winner_tagline: insights.winner_tagline,
        runner_up_model_id: runnerUp?.modelId || null,
        runner_up_tagline: insights.runner_up_tagline,
        pro_tip: insights.pro_tip,
        strengths: insights.strengths,
        weaknesses: insights.weaknesses,
        comparison_data: { rankedModels: rankedModels.slice(0, 10) },
        heatmap_data: {},
        last_calculated: new Date().toISOString(),
      }, {
        onConflict: 'category',
      });

    if (upsertError) {
      console.error('Error upserting insights:', upsertError);
      throw upsertError;
    }

    console.log(`Successfully updated insights for ${category}`);

    return new Response(
      JSON.stringify({ success: true, category, winner: winner.model.name }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-model-map:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
