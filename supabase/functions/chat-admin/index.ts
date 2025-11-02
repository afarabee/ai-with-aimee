import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AdminPayload = {
  message: string;
  session_id?: string;
  pending_intent?: string | null;
};

function intentFrom(text: string): string | null {
  const t = text.toLowerCase().trim();

  // simple follow-up "yes/no"
  if (["yes", "yeah", "yep", "sure", "please do", "ok"].includes(t)) return "yes";
  if (["no", "nope", "nah", "not now"].includes(t)) return "no";

  // specific intents
  if (t.match(/\bhow many\b.*\bblogs?\b/)) return "countBlogs";
  if (t.match(/\blist\b.*\btitles?\b/) || t.match(/\bwhat\b.*\btitles?\b/)) return "listBlogTitles";
  if (t.match(/\bdrafts?\b/) || t.match(/\bwhich\b.*\bare\b.*\bdraft/)) return "listDrafts";

  // search by word/phrase: "find posts about agents"
  if (t.startsWith("find ") || t.includes("search") || t.includes("look for")) return "searchBlogs";

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { message, session_id, pending_intent }: AdminPayload = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase service credentials not configured");
    }
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // helper queries
    const getAllBlogs = async () =>
      (await sb.from("blogs").select("id,title,slug,status,date_published").order("date_published", { ascending: false })).data ?? [];

    const getDrafts = async () =>
      (await sb.from("blogs").select("id,title,slug,status,date_published").eq("status","draft").order("date_published",{ascending:false})).data ?? [];

    const searchBlogs = async (q: string) =>
      (await sb.from("blogs").select("id,title,slug,status,date_published,excerpt").ilike("title", `%${q}%`)).data ?? [];

    const all = await getAllBlogs();
    const counts = {
      total: all.length,
      drafts: all.filter(b => b.status === "draft").length,
      published: all.filter(b => b.status === "published").length,
    };

    // intent routing
    const intent = intentFrom(message);

    // 1) follow-up flow: user said "yes" to a prior offer
    if (intent === "yes" && pending_intent === "listBlogTitles") {
      const titles = all.map(b => `• ${b.title}`).join("\n");
      return new Response(JSON.stringify({
        reply: titles || "I didn't find any blog titles.",
        new_pending_intent: null
      }), { headers: { ...cors, "Content-Type": "application/json" }});
    }
    if (intent === "no" && pending_intent) {
      return new Response(JSON.stringify({
        reply: "Got it — I won't proceed.",
        new_pending_intent: null
      }), { headers: { ...cors, "Content-Type": "application/json" }});
    }

    // 2) factual intents (always grounded by Supabase)
    if (intent === "countBlogs") {
      const reply =
        `You have ${counts.total} blog post${counts.total===1?"":"s"} total — ` +
        `${counts.drafts} draft${counts.drafts===1?"":"s"} and ` +
        `${counts.published} published. ` +
        (counts.published === 0 ? `None are published yet. ` : "") +
        `Would you like me to list their titles?`;
      return new Response(JSON.stringify({
        reply,
        new_pending_intent: "listBlogTitles"
      }), { headers: { ...cors, "Content-Type": "application/json" }});
    }

    if (intent === "listBlogTitles") {
      const titles = all.map(b => `• ${b.title}${b.status==="draft"?" (draft)":""}`).join("\n");
      return new Response(JSON.stringify({
        reply: titles || "I didn't find any blog titles.",
        new_pending_intent: null
      }), { headers: { ...cors, "Content-Type": "application/json" }});
    }

    if (intent === "listDrafts") {
      const drafts = await getDrafts();
      const txt = drafts.length
        ? drafts.map(b => `• ${b.title} — ${b.date_published ?? "no date"} (draft)`).join("\n")
        : "You have 0 drafts.";
      return new Response(JSON.stringify({ reply: txt, new_pending_intent: null }), {
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    if (intent === "searchBlogs") {
      // naive keyword extraction: everything after 'find' or 'search'
      const q = message.replace(/.*?(find|search)/i, "").trim().replace(/^for\b/i, "").trim();
      const results = await searchBlogs(q);
      const txt = results.length
        ? `Found ${results.length} post(s):\n` + results.map(b => `• ${b.title}${b.status==="draft"?" (draft)":""}`).join("\n")
        : `No posts found for "${q}".`;
      return new Response(JSON.stringify({ reply: txt, new_pending_intent: null }), {
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // 3) For everything else, call Lovable AI — but give it facts to prevent guessing
    const grounding = [
      `BLOG FACTS: total=${counts.total}, drafts=${counts.drafts}, published=${counts.published}`,
      `RECENT:`,
      ...all.slice(0,5).map(b => `- ${b.title} [${b.status}]`),
    ].join("\n");

    const aiReq = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
`You are the Admin Copilot for "AI with Aimee".
CRITICAL RULES:
- Never invent numbers or titles. If facts are provided in the system or tool context, use them.
- If the user asks for counts or titles and no facts are provided, say you must query Supabase first (but this function already queried).
- Keep responses short, scannable, and friendly. Max 4 short paragraphs. No markdown formatting.
- Prefer direct answers over questions. If offering an action, ask a single yes/no follow-up.

You will receive a "GROUNDING" section with real facts. Use it.`
          },
          { role: "system", content: `GROUNDING:\n${grounding}` },
          { role: "user", content: message }
        ],
        stream: false,
      }),
    });

    if (!aiReq.ok) {
      const errTxt = await aiReq.text();
      console.error("AI gateway error:", aiReq.status, errTxt);
      return new Response(JSON.stringify({ reply: `AI error: ${errTxt}`, new_pending_intent: null }), {
        status: 500, headers: { ...cors, "Content-Type": "application/json" }
      });
    }
    const aiData = await aiReq.json();
    const reply = aiData.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    return new Response(JSON.stringify({ reply, new_pending_intent: null }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("chat-admin error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
