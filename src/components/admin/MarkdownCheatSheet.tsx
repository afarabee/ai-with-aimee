import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const MarkdownCheatSheet = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <HelpCircle className="w-4 h-4 mr-2" />
          Formatting Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Markdown & Formatting Guide</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Headings */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Headings</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code># Heading 1</code>
                  <span className="text-muted-foreground">→ Largest heading</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>## Heading 2</code>
                  <span className="text-muted-foreground">→ Second largest</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>### Heading 3</code>
                  <span className="text-muted-foreground">→ Third level</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>#### Heading 4, ##### Heading 5, ###### Heading 6</code>
                </div>
              </div>
            </div>

            {/* Text Formatting */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Text Formatting</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>**bold text**</code>
                  <span className="text-muted-foreground">→ <strong>bold text</strong></span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>*italic text*</code>
                  <span className="text-muted-foreground">→ <em>italic text</em></span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>&lt;u&gt;underlined&lt;/u&gt;</code>
                  <span className="text-muted-foreground">→ <u>underlined</u></span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>~~strikethrough~~</code>
                  <span className="text-muted-foreground">→ <s>strikethrough</s></span>
                </div>
              </div>
            </div>

            {/* Font Sizes */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Font Sizes (Use Toolbar)</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>&lt;span style="font-size: 14px;"&gt;Small&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-xs">→ 14px</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>&lt;span style="font-size: 16px;"&gt;Normal&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-sm">→ 16px</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>&lt;span style="font-size: 20px;"&gt;Large&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-base">→ 20px</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <code>&lt;span style="font-size: 24px;"&gt;XL&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-lg">→ 24px</span>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Text Colors (Use Toolbar)</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>&lt;span style="color: #00D4FF;"&gt;Cyan text&lt;/span&gt;</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>&lt;span style="color: #FF0080;"&gt;Pink text&lt;/span&gt;</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>&lt;span style="color: #f9f940;"&gt;Yellow text&lt;/span&gt;</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Use the color palette button in the toolbar for all color options.</p>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Text Alignment (Use Toolbar)</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>&lt;div style="text-align: left;"&gt;Left aligned&lt;/div&gt;</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>&lt;div style="text-align: center;"&gt;Centered&lt;/div&gt;</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>&lt;div style="text-align: right;"&gt;Right aligned&lt;/div&gt;</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>&lt;div style="text-align: justify;"&gt;Justified&lt;/div&gt;</code>
                </div>
              </div>
            </div>

            {/* Lists */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Lists</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <div>Unordered list:</div>
                  <code className="block mt-1">- Item 1</code>
                  <code className="block">- Item 2</code>
                  <code className="block">- Item 3</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div>Ordered list:</div>
                  <code className="block mt-1">1. First item</code>
                  <code className="block">2. Second item</code>
                  <code className="block">3. Third item</code>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Links</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>[Link text](https://example.com)</code>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Images</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>![Alt text](image-url.jpg)</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Use the "Insert Image" button for easier image uploads.</p>
              </div>
            </div>

            {/* Code */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Code</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <div>Inline code:</div>
                  <code className="block mt-1">`code here`</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div>Code block:</div>
                  <code className="block mt-1">```</code>
                  <code className="block">function example() {'{'}</code>
                  <code className="block">  return true;</code>
                  <code className="block">{'}'}</code>
                  <code className="block">```</code>
                </div>
              </div>
            </div>

            {/* Quotes */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Quotes</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>&gt; This is a quote</code>
                </div>
              </div>
            </div>

            {/* Tables */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Tables</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <code className="block">| Header 1 | Header 2 |</code>
                  <code className="block">|----------|----------|</code>
                  <code className="block">| Cell 1   | Cell 2   |</code>
                  <code className="block">| Cell 3   | Cell 4   |</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Use the table button in the toolbar for visual table creation.</p>
              </div>
            </div>

            {/* Tips */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3 text-primary">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Use the toolbar buttons for easier formatting</li>
                <li>Press Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for links</li>
                <li>Click the emoji button (😀) to insert emojis</li>
                <li>Click existing tables in the preview to edit them visually</li>
                <li>Leave blank lines between paragraphs for proper spacing</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
