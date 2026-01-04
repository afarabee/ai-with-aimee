/**
 * Handles keyboard events for multi-level list support in MDEditor
 * - Tab: Indent list item (add 2 spaces)
 * - Shift+Tab: Outdent list item (remove 2 spaces)
 * - Enter: Continue list at same indentation
 * - Backspace at bullet start: Outdent if indented
 */
export function handleListKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (val: string) => void
) {
  const textarea = e.target as HTMLTextAreaElement;
  const { selectionStart, selectionEnd } = textarea;

  // Find current line boundaries
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const lineEnd = value.indexOf('\n', selectionStart);
  const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);

  // Match list patterns: "  - ", "  * ", "  1. ", etc.
  const listMatch = currentLine.match(/^(\s*)([-*]|\d+\.)\s/);

  if (!listMatch) return;

  const [fullMatch, indent, bullet] = listMatch;
  const bulletWithSpace = `${bullet} `;
  const cursorInLine = selectionStart - lineStart;

  // Tab: Indent by 2 spaces
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    const newLine = '  ' + currentLine;
    const newValue = value.substring(0, lineStart) + newLine + value.substring(lineEnd === -1 ? value.length : lineEnd);
    onChange(newValue);
    // Move cursor position
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
    });
    return;
  }

  // Shift+Tab: Outdent by 2 spaces
  if (e.key === 'Tab' && e.shiftKey) {
    e.preventDefault();
    if (indent.length >= 2) {
      const newLine = currentLine.substring(2);
      const newValue = value.substring(0, lineStart) + newLine + value.substring(lineEnd === -1 ? value.length : lineEnd);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, selectionStart - 2);
      });
    }
    return;
  }

  // Enter: Continue list at same indentation
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    
    // Check if line is empty (just whitespace + bullet)
    const afterBullet = currentLine.substring(fullMatch.length).trim();
    if (afterBullet === '') {
      // Empty list item - remove bullet and add plain newline (or outdent if indented)
      if (indent.length >= 2) {
        // Outdent
        const newIndent = indent.substring(2);
        const newLine = `${newIndent}${bulletWithSpace}`;
        const newValue = value.substring(0, lineStart) + newLine + value.substring(lineEnd === -1 ? value.length : lineEnd);
        onChange(newValue);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = lineStart + newLine.length;
        });
      } else {
        // Remove bullet completely, just newline
        const newValue = value.substring(0, lineStart) + value.substring(lineEnd === -1 ? value.length : lineEnd + 1);
        onChange(newValue);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = lineStart;
        });
      }
      return;
    }
    
    // Normal case: insert newline with same indentation + bullet
    let newBullet = bulletWithSpace;
    // For numbered lists, increment the number
    const numMatch = bullet.match(/^(\d+)\.$/);
    if (numMatch) {
      newBullet = `${parseInt(numMatch[1]) + 1}. `;
    }
    
    const insertion = `\n${indent}${newBullet}`;
    const newValue = value.substring(0, selectionStart) + insertion + value.substring(selectionEnd);
    onChange(newValue);
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = selectionStart + insertion.length;
    });
    return;
  }

  // Backspace at bullet start: Outdent if indented
  if (e.key === 'Backspace' && selectionStart === selectionEnd) {
    // Check if cursor is right after the bullet marker (at the start of text)
    if (cursorInLine === fullMatch.length && indent.length >= 2) {
      e.preventDefault();
      const newLine = currentLine.substring(2);
      const newValue = value.substring(0, lineStart) + newLine + value.substring(lineEnd === -1 ? value.length : lineEnd);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart - 2;
      });
      return;
    }
  }
}
