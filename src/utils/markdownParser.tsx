import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// Custom schema that allows safe inline styles on span and div elements
const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'span', 'div', 'u'],
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span || []), 'style'],
    div: [...(defaultSchema.attributes?.div || []), 'style'],
  },
};

// Safe CSS properties allowed for inline styling
const safeProperties = ['color', 'fontSize', 'textAlign', 'backgroundColor'];
const safeCssProperties = ['color', 'font-size', 'text-align', 'background-color'];

// Helper to parse CSS string and apply only safe CSS properties
const parseSafeStyles = (styleString: string): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
  styleString.split(';').forEach(declaration => {
    const [property, value] = declaration.split(':').map(s => s.trim());
    if (property && value && safeCssProperties.includes(property.toLowerCase())) {
      // Convert CSS property to camelCase for React
      const camelProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
      (styles as Record<string, string>)[camelProperty] = value;
    }
  });
  
  return styles;
};

// Helper to filter object styles to only safe properties
const filterSafeStyles = (styleObj: Record<string, string>): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
  for (const [key, value] of Object.entries(styleObj)) {
    if (safeProperties.includes(key) && value) {
      (styles as Record<string, string>)[key] = value;
    }
  }
  
  return styles;
};

export const parseMarkdownContent = (markdown: string): React.ReactNode => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, customSchema]]} components={{
    // Heading 1
    h1: ({ children }) => <h1 className="blog-h1">{children}</h1>,
    // Heading 2
    h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
    // Heading 3
    h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
    // Heading 4
    h4: ({ children }) => <h4 className="blog-h4">{children}</h4>,
    // Paragraphs
    p: ({ children }) => <p className="mb-4 leading-relaxed" style={{
      color: 'hsl(var(--color-light-text))'
    }}>
            {children}
          </p>,
    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote 
        className="my-6 pl-4 py-2 border-l-4 italic"
        style={{
          borderColor: 'hsl(var(--color-cyan))',
          backgroundColor: 'hsl(262 35% 28%)',
          borderRadius: '0 8px 8px 0',
          boxShadow: '0 0 25px hsl(var(--color-pink) / 0.2)',
        }}
      >
        <div style={{ color: 'hsl(var(--color-light-text) / 0.9)' }}>
          {children}
        </div>
      </blockquote>
    ),
    // Unordered Lists
    ul: ({
      children
    }) => <ul className="mb-6 ml-6 space-y-2 list-disc marker:text-[hsl(var(--color-cyan))]">
            {children}
          </ul>,
    // Ordered Lists
    ol: ({
      children
    }) => <ol className="mb-6 ml-6 space-y-2 list-decimal marker:text-[hsl(var(--color-cyan))]">
            {children}
          </ol>,
    // List Items
    li: ({
      children
    }) => <li className="leading-relaxed" style={{
      color: 'hsl(var(--color-light-text))'
    }}>
            {children}
          </li>,
    // Links
    a: ({
      href,
      children
    }) => <a href={href} target="_blank" rel="noopener noreferrer" className="transition-all duration-300 font-semibold underline decoration-1 underline-offset-2" style={{
      color: 'hsl(var(--color-pink))',
      textShadow: '0 0 10px hsl(var(--color-pink) / 0.5)'
    }} onMouseEnter={e => {
      e.currentTarget.style.color = 'hsl(var(--color-cyan))';
      e.currentTarget.style.textShadow = '0 0 15px hsl(var(--color-cyan) / 0.6)';
    }} onMouseLeave={e => {
      e.currentTarget.style.color = 'hsl(var(--color-pink))';
      e.currentTarget.style.textShadow = '0 0 10px hsl(var(--color-pink) / 0.5)';
    }}>
            {children}
          </a>,
    // Bold text
    strong: ({
      children
    }) => <strong className="font-bold" style={{
      color: 'hsl(var(--color-cyan) / 0.85)'
    }}>
            {children}
          </strong>,
    // Italic text
    em: ({
      children
    }) => <em className="italic font-josefin" style={{
      color: 'hsl(var(--color-yellow))'
    }}>
            {children}
          </em>,
    // Underline text
    u: ({
      children
    }) => <u className="underline" style={{
      textDecorationColor: 'hsl(var(--color-cyan) / 0.7)',
      textDecorationThickness: '1px',
      textUnderlineOffset: '2px'
    }}>
            {children}
          </u>,
    // Inline code
    code: ({
      children,
      className
    }) => {
      const isBlock = className?.includes('language-');
      if (isBlock) {
        // Code block
        return <code className={`block p-4 rounded-lg mb-6 overflow-x-auto font-mono text-sm ${className || ''}`} style={{
          backgroundColor: 'hsl(262 35% 32%)',
          border: '1px solid hsl(var(--color-pink) / 0.3)',
          boxShadow: '0 0 25px hsl(var(--color-pink) / 0.2)',
          color: 'hsl(var(--color-cyan) / 0.9)'
        }}>
                {children}
              </code>;
      }

      // Inline code
      return <code className="px-2 py-1 rounded font-mono text-sm" style={{
        backgroundColor: 'hsl(262 35% 28%)',
        border: '1px solid hsl(var(--color-pink) / 0.25)',
        boxShadow: '0 0 10px hsl(var(--color-pink) / 0.15)',
        color: 'hsl(var(--color-cyan))',
        textShadow: '0 0 8px hsl(var(--color-cyan) / 0.4)'
      }}>
              {children}
            </code>;
    },
    // Pre (for code blocks)
    pre: ({
      children
    }) => <pre className="mb-6">{children}</pre>,
    // Horizontal Rule (becomes neon divider)
    hr: () => <div className="blog-divider my-6" />,
    // Images
    img: ({
      src,
      alt
    }) => <img src={src} alt={alt || ''} loading="lazy" className="w-full rounded-lg mb-6" style={{
      border: '2px solid hsl(var(--color-cyan) / 0.4)',
      boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.3), 0 4px 15px hsl(var(--color-shadow) / 0.5)'
    }} />,
    // Tables
    table: ({
      children
    }) => <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse rounded-lg overflow-hidden" style={{
              border: '1px solid hsl(var(--color-cyan) / 0.3)',
              boxShadow: '0 0 15px hsl(var(--color-cyan) / 0.2)'
            }}>
              {children}
            </table>
          </div>,
    thead: ({
      children
    }) => <thead style={{
      backgroundColor: 'hsl(var(--color-violet) / 0.6)',
      borderBottom: '2px solid hsl(var(--color-cyan) / 0.5)'
    }}>
            {children}
          </thead>,
    tbody: ({
      children
    }) => <tbody>{children}</tbody>,
    tr: ({
      children
    }) => <tr className="transition-all duration-300" style={{
      borderBottom: '1px solid hsl(var(--color-cyan) / 0.2)'
    }} onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = 'hsl(var(--color-cyan) / 0.05)';
    }} onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}>
            {children}
          </tr>,
    th: ({
      children
    }) => <th className="px-4 py-3 text-left font-semibold" style={{
      color: 'hsl(var(--color-cyan))',
      textShadow: '0 0 10px hsl(var(--color-cyan) / 0.4)'
    }}>
            {children}
          </th>,
    td: ({
      children
    }) => <td className="px-4 py-3" style={{
      color: 'hsl(var(--color-light-text))',
      borderRight: '1px solid hsl(var(--color-cyan) / 0.1)'
    }}>
            {children}
          </td>,
    // Styled spans (for text colors, font sizes, etc.)
    span: ({ style, children, ...props }) => {
      let safeStyles: React.CSSProperties = {};
      if (typeof style === 'string') {
        safeStyles = parseSafeStyles(style);
      } else if (style && typeof style === 'object') {
        safeStyles = filterSafeStyles(style as Record<string, string>);
      }
      return <span style={safeStyles} {...props}>{children}</span>;
    },
    // Styled divs (for text alignment)
    div: ({ style, children, ...props }) => {
      let safeStyles: React.CSSProperties = {};
      if (typeof style === 'string') {
        safeStyles = parseSafeStyles(style);
      } else if (style && typeof style === 'object') {
        safeStyles = filterSafeStyles(style as Record<string, string>);
      }
      return <div style={safeStyles} {...props}>{children}</div>;
    }
  }}>
      {markdown}
    </ReactMarkdown>;
};