import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// Helper to parse inline styles safely
const parseInlineStyles = (styleString: string): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  const declarations = styleString.split(';').filter(d => d.trim());
  
  declarations.forEach(decl => {
    const [property, value] = decl.split(':').map(s => s.trim());
    if (!property || !value) return;
    
    // Only allow specific safe properties
    if (property === 'font-size') {
      styles.fontSize = value;
    } else if (property === 'color') {
      styles.color = value;
    } else if (property === 'text-align') {
      styles.textAlign = value as any;
    }
  });
  
  return styles;
};

// Configure sanitize to allow safe inline styles
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [
      ...(defaultSchema.attributes?.span || []),
      ['style'], // Allow style attribute on span
    ],
    div: [
      ...(defaultSchema.attributes?.div || []),
      ['style'], // Allow style attribute on div
    ],
  },
};

export const parseMarkdownContent = (markdown: string): React.ReactNode => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, sanitizeSchema]]} components={{
    // Heading 1
    h1: ({ children }) => (
      <h1 className="blog-h2" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
        {children}
      </h1>
    ),
    // Heading 2
    h2: ({
      children
    }) => <h2 className="blog-h2">{children}</h2>,
    // Heading 3
    h3: ({
      children
    }) => <h3 className="blog-h3">{children}</h3>,
    // Paragraphs
    p: ({
      children
    }) => <p className="mb-4 leading-relaxed" style={{
      color: 'hsl(var(--color-light-text))'
    }}>
            {children}
          </p>,
    // Blockquotes
    blockquote: () => null,
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
      color: 'hsl(var(--color-cyan) / 0.85)',
      textShadow: '0 0 8px hsl(var(--color-cyan) / 0.25)'
    }}>
            {children}
          </strong>,
    // Italic text
    em: ({
      children
    }) => <em className="italic font-josefin" style={{
      color: 'hsl(var(--color-cyan) / 0.9)'
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
    // Span (for inline styles like font-size and color)
    span: ({ node, children, ...props }) => {
      const style = (node as any)?.properties?.style as string;
      if (style) {
        return <span style={parseInlineStyles(style)}>{children}</span>;
      }
      return <span {...props}>{children}</span>;
    },
    // Div (for text alignment)
    div: ({ node, children, ...props }) => {
      const style = (node as any)?.properties?.style as string;
      if (style) {
        return <div style={parseInlineStyles(style)}>{children}</div>;
      }
      return <div {...props}>{children}</div>;
    },
    // Inline code
    code: ({
      children,
      className
    }) => {
      const isBlock = className?.includes('language-');
      if (isBlock) {
        // Code block
        return <code className={`block p-4 rounded-lg mb-6 overflow-x-auto font-mono text-sm ${className || ''}`} style={{
          backgroundColor: 'hsl(var(--color-violet) / 0.8)',
          border: '1px solid hsl(var(--color-cyan) / 0.3)',
          boxShadow: '0 0 15px hsl(var(--color-cyan) / 0.2)',
          color: 'hsl(var(--color-cyan) / 0.9)'
        }}>
                {children}
              </code>;
      }

      // Inline code
      return <code className="px-2 py-1 rounded font-mono text-sm" style={{
        backgroundColor: 'hsl(var(--color-violet) / 0.6)',
        border: '1px solid hsl(var(--color-cyan) / 0.3)',
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
    // Horizontal Rule (becomes divider)
    hr: () => null,
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
          </td>
  }}>
      {markdown}
    </ReactMarkdown>;
};