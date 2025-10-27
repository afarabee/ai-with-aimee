import React from 'react';

export const parseMarkdownContent = (markdown: string): React.ReactNode[] => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={`p-${key++}`} className="mb-6">
          {currentParagraph.join(' ')}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    // H2 Heading
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h2 key={`h2-${key++}`} className="blog-h2">
          {trimmed.slice(3)}
        </h2>
      );
      return;
    }
    
    // H3 Heading
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      elements.push(
        <h3 key={`h3-${key++}`} className="blog-h3">
          {trimmed.slice(4)}
        </h3>
      );
      return;
    }
    
    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      elements.push(
        <blockquote key={`bq-${key++}`} className="blog-blockquote">
          <p>{trimmed.slice(2)}</p>
        </blockquote>
      );
      return;
    }
    
    // Divider
    if (trimmed === '---' || trimmed === '***') {
      flushParagraph();
      elements.push(<div key={`div-${key++}`} className="blog-divider" />);
      return;
    }
    
    // Empty line - paragraph break
    if (!trimmed) {
      flushParagraph();
      return;
    }
    
    // Regular text - accumulate into paragraph
    currentParagraph.push(line);
  });
  
  // Flush any remaining paragraph
  flushParagraph();
  
  return elements;
};
