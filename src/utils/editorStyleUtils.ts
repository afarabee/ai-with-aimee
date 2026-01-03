/**
 * Utility functions for merging inline styles in markdown editor commands.
 * Instead of nesting multiple spans, these functions detect existing styled spans
 * and merge new style properties into them.
 */

// Regex to match a span with inline styles wrapping content
const STYLED_SPAN_REGEX = /^<span\s+style="([^"]*)">([\s\S]*)<\/span>$/;

// Regex to match a div with inline styles wrapping content
const STYLED_DIV_REGEX = /^<div\s+style="([^"]*)">([\s\S]*)<\/div>$/;

/**
 * Parse inline style string into an object
 */
function parseStyleString(styleString: string): Record<string, string> {
  const styles: Record<string, string> = {};
  styleString.split(';').forEach(declaration => {
    const [property, value] = declaration.split(':').map(s => s.trim());
    if (property && value) {
      styles[property] = value;
    }
  });
  return styles;
}

/**
 * Convert style object back to inline style string
 */
function styleObjectToString(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(([prop, val]) => `${prop}: ${val}`)
    .join('; ');
}

/**
 * Apply a span style to selected text, merging with existing styles if present.
 * @param selectedText - The currently selected text
 * @param newStyle - The new style property to add (e.g., "color: #FF0080")
 * @returns The text wrapped in a span with merged styles
 */
export function applySpanStyle(selectedText: string, newStyle: string): string {
  const text = selectedText || 'text';
  
  // Parse the new style
  const newStyles = parseStyleString(newStyle);
  
  // Check if the text is already wrapped in a styled span
  const match = text.match(STYLED_SPAN_REGEX);
  
  if (match) {
    // Extract existing styles and inner content
    const existingStyleString = match[1];
    const innerContent = match[2];
    
    // Merge styles (new styles override existing ones for the same property)
    const existingStyles = parseStyleString(existingStyleString);
    const mergedStyles = { ...existingStyles, ...newStyles };
    
    return `<span style="${styleObjectToString(mergedStyles)}">${innerContent}</span>`;
  }
  
  // No existing span, create a new one
  return `<span style="${styleObjectToString(newStyles)}">${text}</span>`;
}

/**
 * Apply a div style to selected text, merging with existing styles if present.
 * Used for alignment and other block-level styles.
 * @param selectedText - The currently selected text
 * @param newStyle - The new style property to add (e.g., "text-align: center")
 * @returns The text wrapped in a div with merged styles
 */
export function applyDivStyle(selectedText: string, newStyle: string): string {
  const text = selectedText || 'text';
  
  // Parse the new style
  const newStyles = parseStyleString(newStyle);
  
  // Check if the text is already wrapped in a styled div
  const match = text.match(STYLED_DIV_REGEX);
  
  if (match) {
    // Extract existing styles and inner content
    const existingStyleString = match[1];
    const innerContent = match[2];
    
    // Merge styles (new styles override existing ones for the same property)
    const existingStyles = parseStyleString(existingStyleString);
    const mergedStyles = { ...existingStyles, ...newStyles };
    
    return `<div style="${styleObjectToString(mergedStyles)}">${innerContent}</div>`;
  }
  
  // No existing div, create a new one
  return `<div style="${styleObjectToString(newStyles)}">${text}</div>`;
}

/**
 * Remove a specific style property from a styled span/div.
 * If no styles remain, returns just the inner content.
 */
export function removeStyleProperty(text: string, property: string): string {
  const spanMatch = text.match(STYLED_SPAN_REGEX);
  if (spanMatch) {
    const styles = parseStyleString(spanMatch[1]);
    delete styles[property];
    const innerContent = spanMatch[2];
    
    if (Object.keys(styles).length === 0) {
      return innerContent;
    }
    return `<span style="${styleObjectToString(styles)}">${innerContent}</span>`;
  }
  
  const divMatch = text.match(STYLED_DIV_REGEX);
  if (divMatch) {
    const styles = parseStyleString(divMatch[1]);
    delete styles[property];
    const innerContent = divMatch[2];
    
    if (Object.keys(styles).length === 0) {
      return innerContent;
    }
    return `<div style="${styleObjectToString(styles)}">${innerContent}</div>`;
  }
  
  return text;
}
