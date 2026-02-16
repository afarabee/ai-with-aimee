import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://ai-with-aims.studio";
const SITE_NAME = "AI With Aimee";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TITLE = "Aimee Farabee - Product Leader & AI Strategist";
const DEFAULT_DESCRIPTION =
  "Enterprise AI enablement leader who builds, ships, and scales AI products. I train teams, design systems, and code my own solutions. Hands-on always.";

function buildHTML({
  title,
  description,
  image,
  url,
  type = "website",
  author,
  publishedTime,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  author?: string;
  publishedTime?: string;
}) {
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedImage = escapeHtml(image);
  const escapedUrl = escapeHtml(url);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapedTitle} | ${SITE_NAME}</title>
  <meta name="description" content="${escapedDesc}" />
  ${author ? `<meta name="author" content="${escapeHtml(author)}" />` : ""}

  <!-- Open Graph -->
  <meta property="og:title" content="${escapedTitle}" />
  <meta property="og:description" content="${escapedDesc}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:image" content="${escapedImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapedUrl}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  ${publishedTime ? `<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />` : ""}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@aimeefara" />
  <meta name="twitter:title" content="${escapedTitle}" />
  <meta name="twitter:description" content="${escapedDesc}" />
  <meta name="twitter:image" content="${escapedImage}" />

  <link rel="canonical" href="${escapedUrl}" />

  <!-- Redirect real users to the SPA -->
  <meta http-equiv="refresh" content="0;url=${escapedUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${escapedUrl}">${escapedTitle}</a>...</p>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Blog post: /blog/:slug
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const { data: post } = await supabase
        .from("blogs")
        .select("title, excerpt, banner_image, author, date_published, slug")
        .eq("slug", slug)
        .is("deleted_at", null)
        .maybeSingle();

      if (post) {
        return new Response(
          buildHTML({
            title: post.title,
            description: post.excerpt,
            image: post.banner_image || DEFAULT_IMAGE,
            url: `${SITE_URL}/blog/${post.slug}`,
            type: "article",
            author: post.author || "Aimee Farabee",
            publishedTime: post.date_published,
          }),
          { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
        );
      }
    }

    // Project detail: /projects/:slug
    const projectMatch = path.match(/^\/projects\/([^/]+)$/);
    if (projectMatch) {
      const slug = projectMatch[1];
      const { data: project } = await supabase
        .from("projects")
        .select("project_title, subtitle, thumbnail, slug")
        .eq("slug", slug)
        .maybeSingle();

      if (project) {
        return new Response(
          buildHTML({
            title: project.project_title,
            description: project.subtitle,
            image: project.thumbnail || DEFAULT_IMAGE,
            url: `${SITE_URL}/projects/${project.slug}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
        );
      }
    }

    // Why Aimee: /why-aimee/:slug
    const whyMatch = path.match(/^\/why-aimee\/([^/]+)$/);
    if (whyMatch) {
      const slug = whyMatch[1];
      const { data: page } = await supabase
        .from("why_aimee")
        .select("company, role, hero_tagline, hero_subtext, slug")
        .eq("slug", slug)
        .maybeSingle();

      if (page) {
        return new Response(
          buildHTML({
            title: `Why Aimee for ${page.company}`,
            description: page.hero_subtext || `${page.role} at ${page.company}`,
            image: DEFAULT_IMAGE,
            url: `${SITE_URL}/why-aimee/${page.slug}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
        );
      }
    }

    // Static pages
    const staticPages: Record<string, { title: string; description: string }> = {
      "/": {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
      },
      "/about": {
        title: "About Aimee Farabee",
        description: "Senior Director-level Healthcare Product Leader & AI Strategist with 15+ years of experience building human-centered solutions.",
      },
      "/blog": {
        title: "Blog",
        description: "Insights on AI strategy, product leadership, and building AI-fluent teams.",
      },
      "/projects": {
        title: "Projects",
        description: "AI and product leadership projects showcasing real-world impact.",
      },
      "/resume": {
        title: "Resume",
        description: "Aimee Farabee's professional experience in healthcare product leadership and AI strategy.",
      },
      "/model-map": {
        title: "AI Model Map",
        description: "Interactive benchmarks and comparisons of leading AI models.",
      },
      "/my-ai-journey": {
        title: "My AI Journey",
        description: "A timeline of milestones in Aimee Farabee's AI journey.",
      },
    };

    const staticPage = staticPages[path];
    if (staticPage) {
      return new Response(
        buildHTML({
          title: staticPage.title,
          description: staticPage.description,
          image: DEFAULT_IMAGE,
          url: `${SITE_URL}${path === "/" ? "" : path}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // Fallback
    return new Response(
      buildHTML({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: SITE_URL,
      }),
      { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error) {
    console.error("og-meta error:", error);
    return new Response(
      buildHTML({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: SITE_URL,
      }),
      { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
    );
  }
});
