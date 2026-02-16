import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
}

const SITE_NAME = "AI With Aimee";
const DEFAULT_IMAGE = "https://ai-with-aims.studio/og-image.png";

const SEOHead = ({
  title,
  description,
  image,
  url,
  type = "website",
  author,
  publishedTime,
}: SEOHeadProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const ogImage = image || DEFAULT_IMAGE;
  const canonicalUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aimeefara" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default SEOHead;
