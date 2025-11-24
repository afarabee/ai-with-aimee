import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Copy, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useState } from 'react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 px-2 hover:bg-primary/20"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </Button>
  );
};

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
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1"># Heading 1</code>
                  <span className="text-muted-foreground text-xs">→ Largest heading</span>
                  <CopyButton text="# Heading 1" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">## Heading 2</code>
                  <span className="text-muted-foreground text-xs">→ Second largest</span>
                  <CopyButton text="## Heading 2" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">### Heading 3</code>
                  <span className="text-muted-foreground text-xs">→ Third level</span>
                  <CopyButton text="### Heading 3" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">#### Heading 4</code>
                  <CopyButton text="#### Heading 4" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">##### Heading 5</code>
                  <CopyButton text="##### Heading 5" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">###### Heading 6</code>
                  <CopyButton text="###### Heading 6" />
                </div>
              </div>
            </div>

            {/* Text Formatting */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Text Formatting</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">**bold text**</code>
                  <span className="text-muted-foreground text-xs">→ <strong>bold text</strong></span>
                  <CopyButton text="**bold text**" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">*italic text*</code>
                  <span className="text-muted-foreground text-xs">→ <em>italic text</em></span>
                  <CopyButton text="*italic text*" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">&lt;u&gt;underlined&lt;/u&gt;</code>
                  <span className="text-muted-foreground text-xs">→ <u>underlined</u></span>
                  <CopyButton text="<u>underlined</u>" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">~~strikethrough~~</code>
                  <span className="text-muted-foreground text-xs">→ <s>strikethrough</s></span>
                  <CopyButton text="~~strikethrough~~" />
                </div>
              </div>
            </div>

            {/* Font Sizes */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Font Sizes (Use Toolbar)</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;span style="font-size: 14px;"&gt;Small&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-xs">→ 14px</span>
                  <CopyButton text='<span style="font-size: 14px;">Small</span>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;span style="font-size: 16px;"&gt;Normal&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-xs">→ 16px</span>
                  <CopyButton text='<span style="font-size: 16px;">Normal</span>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;span style="font-size: 20px;"&gt;Large&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-xs">→ 20px</span>
                  <CopyButton text='<span style="font-size: 20px;">Large</span>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;span style="font-size: 24px;"&gt;XL&lt;/span&gt;</code>
                  <span className="text-muted-foreground text-xs">→ 24px</span>
                  <CopyButton text='<span style="font-size: 24px;">XL</span>' />
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Text Colors (Use Toolbar)</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;span style="color: #00D4FF;"&gt;Cyan text&lt;/span&gt;</code>
                  <CopyButton text='<span style="color: #00D4FF;">Cyan text</span>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;span style="color: #FF0080;"&gt;Pink text&lt;/span&gt;</code>
                  <CopyButton text='<span style="color: #FF0080;">Pink text</span>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;span style="color: #f9f940;"&gt;Yellow text&lt;/span&gt;</code>
                  <CopyButton text='<span style="color: #f9f940;">Yellow text</span>' />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Use the color palette button in the toolbar for all color options.</p>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Text Alignment (Use Toolbar)</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;div style="text-align: left;"&gt;Left aligned&lt;/div&gt;</code>
                  <CopyButton text='<div style="text-align: left;">Left aligned</div>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;div style="text-align: center;"&gt;Centered&lt;/div&gt;</code>
                  <CopyButton text='<div style="text-align: center;">Centered</div>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;div style="text-align: right;"&gt;Right aligned&lt;/div&gt;</code>
                  <CopyButton text='<div style="text-align: right;">Right aligned</div>' />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1 text-xs">&lt;div style="text-align: justify;"&gt;Justified&lt;/div&gt;</code>
                  <CopyButton text='<div style="text-align: justify;">Justified</div>' />
                </div>
              </div>
            </div>

            {/* Lists */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Lists</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Unordered list:</span>
                    <CopyButton text="- Item 1&#10;- Item 2&#10;- Item 3" />
                  </div>
                  <code className="block mt-1">- Item 1</code>
                  <code className="block">- Item 2</code>
                  <code className="block">- Item 3</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Ordered list:</span>
                    <CopyButton text="1. First item&#10;2. Second item&#10;3. Third item" />
                  </div>
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
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">[Link text](https://example.com)</code>
                  <CopyButton text="[Link text](https://example.com)" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Images</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">![Alt text](image-url.jpg)</code>
                  <CopyButton text="![Alt text](image-url.jpg)" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Use the "Insert Image" button for easier image uploads.</p>
              </div>
            </div>

            {/* Code */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Code</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Inline code:</span>
                    <CopyButton text="`code here`" />
                  </div>
                  <code className="block mt-1">`code here`</code>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Code block:</span>
                    <CopyButton text="```&#10;function example() {&#10;  return true;&#10;}&#10;```" />
                  </div>
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
                <div className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                  <code className="flex-1">&gt; This is a quote</code>
                  <CopyButton text="> This is a quote" />
                </div>
              </div>
            </div>

            {/* Tables */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Tables</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Table example:</span>
                    <CopyButton text="| Header 1 | Header 2 |&#10;|----------|----------|&#10;| Cell 1   | Cell 2   |&#10;| Cell 3   | Cell 4   |" />
                  </div>
                  <code className="block text-xs">| Header 1 | Header 2 |</code>
                  <code className="block text-xs">|----------|----------|</code>
                  <code className="block text-xs">| Cell 1   | Cell 2   |</code>
                  <code className="block text-xs">| Cell 3   | Cell 4   |</code>
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
