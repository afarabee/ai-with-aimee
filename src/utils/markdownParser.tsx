import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

export const parseMarkdownContent = (markdown: string): React.ReactNode => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        // Heading 2
        h2: ({ children }) => (
          <h2 className="blog-h2">{children}</h2>
        ),
        // Heading 3
        h3: ({ children }) => (
          <h3 className="blog-h3">{children}</h3>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="mb-6 leading-relaxed">{children}</p>
        ),
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="blog-blockquote">{children}</blockquote>
        ),
        // Unordered Lists
        ul: ({ children }) => (
          <ul className="mb-6 ml-6 space-y-2 list-disc marker:text-[hsl(var(--color-cyan))]">
            {children}
          </ul>
        ),
        // Ordered Lists
        ol: ({ children }) => (
          <ol className="mb-6 ml-6 space-y-2 list-decimal marker:text-[hsl(var(--color-cyan))]">
            {children}
          </ol>
        ),
        // List Items
        li: ({ children }) => (
          <li className="leading-relaxed" style={{ color: 'hsl(var(--color-light-text))' }}>
            {children}
          </li>
        ),
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 font-semibold underline decoration-1 underline-offset-2"
            style={{
              color: 'hsl(var(--color-pink))',
              textShadow: '0 0 10px hsl(var(--color-pink) / 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'hsl(var(--color-cyan))';
              e.currentTarget.style.textShadow = '0 0 15px hsl(var(--color-cyan) / 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'hsl(var(--color-pink))';
              e.currentTarget.style.textShadow = '0 0 10px hsl(var(--color-pink) / 0.5)';
            }}
          >
            {children}
          </a>
        ),
        // Bold text
        strong: ({ children }) => (
          <strong
            className="font-bold"
            style={{
              color: 'hsl(var(--color-cyan))',
              textShadow: '0 0 8px hsl(var(--color-cyan) / 0.4)',
            }}
          >
            {children}
          </strong>
        ),
        // Italic text
        em: ({ children }) => (
          <em
            className="italic font-josefin"
            style={{
              color: 'hsl(var(--color-cyan) / 0.9)',
            }}
          >
            {children}
          </em>
        ),
        // Inline code
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-');
          
          if (isBlock) {
            // Code block
            return (
              <code
                className={`block p-4 rounded-lg mb-6 overflow-x-auto font-mono text-sm ${className || ''}`}
                style={{
                  backgroundColor: 'hsl(var(--color-violet) / 0.8)',
                  border: '1px solid hsl(var(--color-cyan) / 0.3)',
                  boxShadow: '0 0 15px hsl(var(--color-cyan) / 0.2)',
                  color: 'hsl(var(--color-cyan) / 0.9)',
                }}
              >
                {children}
              </code>
            );
          }
          
          // Inline code
          return (
            <code
              className="px-2 py-1 rounded font-mono text-sm"
              style={{
                backgroundColor: 'hsl(var(--color-violet) / 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.3)',
                color: 'hsl(var(--color-cyan))',
                textShadow: '0 0 8px hsl(var(--color-cyan) / 0.4)',
              }}
            >
              {children}
            </code>
          );
        },
        // Pre (for code blocks)
        pre: ({ children }) => (
          <pre className="mb-6">{children}</pre>
        ),
        // Horizontal Rule (becomes divider)
        hr: () => <div className="blog-divider" />,
        // Images
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt || ''}
            loading="lazy"
            className="w-full rounded-lg mb-6"
            style={{
              border: '2px solid hsl(var(--color-cyan) / 0.4)',
              boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.3), 0 4px 15px hsl(var(--color-shadow) / 0.5)',
            }}
          />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};
