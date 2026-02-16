const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = "https://ai-with-aims.studio";
const SITE_NAME = "AI With Aimee";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TITLE = "Aimee Farabee - Product Leader & AI Strategist";
const DEFAULT_DESCRIPTION = "Enterprise AI enablement leader who builds, ships, and scales AI products. I train teams, design systems, and code my own solutions. Hands-on always.";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHTML(title: string, description: string, image: string, url: string, extra = "") {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const img = escapeHtml(image);
  const u = escapeHtml(url);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${t}</title>
${extra}
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${u}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@aimeefara" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${img}" />
<link rel="canonical" href="${u}" />
</head>
<body><p>${t}</p></body>
</html>`;
}

function respond(html: string) {
  return new Response(html, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
}

async function queryTable(table: string, select: string, filters: Record<string, string>): Promise<Record<string, string> | null> {
  const baseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  let url = `${baseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
  for (const [key, value] of Object.entries(filters)) {
    url += `&${key}=${encodeURIComponent(value)}`;
  }

  const res = await fetch(url, {
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
    },
  });

  if (!res.ok) return null;
  const rows = await res.json();
  return rows.length > 0 ? rows[0] : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqUrl = new URL(req.url);
    const path = reqUrl.searchParams.get("path") || "/";

    // Blog post
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      const post = await queryTable("blogs", "title,excerpt,banner_image,author,date_published,slug", {
        "slug": `eq.${blogMatch[1]}`,
        "deleted_at": "is.null",
      });

      if (post) {
        let extra = `<meta name="author" content="${escapeHtml(post.author || "Aimee Farabee")}" />\n`;
        if (post.date_published) extra += `<meta property="article:published_time" content="${escapeHtml(post.date_published)}" />\n`;
        return respond(buildHTML(post.title, post.excerpt, post.banner_image || DEFAULT_IMAGE, `${SITE_URL}/blog/${post.slug}`, extra));
      }
    }

    // Project detail
    const projectMatch = path.match(/^\/projects\/([^/]+)$/);
    if (projectMatch) {
      const project = await queryTable("projects", "project_title,subtitle,thumbnail,slug", {
        "slug": `eq.${projectMatch[1]}`,
      });

      if (project) {
        return respond(buildHTML(project.project_title, project.subtitle, project.thumbnail || DEFAULT_IMAGE, `${SITE_URL}/projects/${project.slug}`));
      }
    }

    // Why Aimee
    const whyMatch = path.match(/^\/why-aimee\/([^/]+)$/);
    if (whyMatch) {
      const page = await queryTable("why_aimee", "company,role,hero_subtext,slug", {
        "slug": `eq.${whyMatch[1]}`,
      });

      if (page) {
        return respond(buildHTML(`Why Aimee for ${page.company}`, page.hero_subtext || `${page.role} at ${page.company}`, DEFAULT_IMAGE, `${SITE_URL}/why-aimee/${page.slug}`));
      }
    }

    // Static pages
    const staticPages: Record<string, [string, string]> = {
      "/": [DEFAULT_TITLE, DEFAULT_DESCRIPTION],
      "/about": ["About Aimee Farabee", "Senior Director-level Healthcare Product Leader & AI Strategist with 15+ years of experience."],
      "/blog": ["Blog", "Insights on AI strategy, product leadership, and building AI-fluent teams."],
      "/projects": ["Projects", "AI and product leadership projects showcasing real-world impact."],
      "/resume": ["Resume", "Aimee Farabee's professional experience in healthcare product leadership and AI strategy."],
      "/model-map": ["AI Model Map", "Interactive benchmarks and comparisons of leading AI models."],
      "/my-ai-journey": ["My AI Journey", "A timeline of milestones in Aimee Farabee's AI journey."],
    };

    const sp = staticPages[path];
    if (sp) {
      return respond(buildHTML(sp[0], sp[1], DEFAULT_IMAGE, `${SITE_URL}${path === "/" ? "" : path}`));
    }

    return respond(buildHTML(DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_URL));
  } catch (error) {
    console.error("og-metadata error:", error);
    return respond(buildHTML(DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_URL));
  }
});
