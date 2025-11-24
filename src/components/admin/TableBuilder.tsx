import React, { useState } from 'react';
import { Table } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TableBuilderProps {
  onInsert: (tableMarkdown: string) => void;
}

export const TableBuilder: React.FC<TableBuilderProps> = ({ onInsert }) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [open, setOpen] = useState(false);

  const generateTableMarkdown = () => {
    let markdown = '';
    const totalRows = includeHeaders ? rows + 1 : rows;

    // Generate table
    for (let i = 0; i < totalRows; i++) {
      const isHeader = includeHeaders && i === 0;
      const cells = Array(columns)
        .fill(isHeader ? 'Header' : 'Cell')
        .map((text, idx) => `${text} ${idx + 1}`)
        .join(' | ');
      
      markdown += `| ${cells} |\n`;

      // Add separator row after header
      if (isHeader) {
        const separator = Array(columns).fill('---').join(' | ');
        markdown += `| ${separator} |\n`;
      }
    }

    return markdown;
  };

  const handleInsert = () => {
    const tableMarkdown = generateTableMarkdown();
    onInsert(tableMarkdown);
    setOpen(false);
    // Reset to defaults
    setRows(3);
    setColumns(3);
    setIncludeHeaders(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded transition-colors"
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-border z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Insert Table</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your table dimensions and click insert to add it to your content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rows" className="text-foreground">Number of Rows</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              className="text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="columns" className="text-foreground">Number of Columns</Label>
            <Input
              id="columns"
              type="number"
              min="1"
              max="10"
              value={columns}
              onChange={(e) => setColumns(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="text-foreground"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="headers"
              checked={includeHeaders}
              onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
            />
            <Label htmlFor="headers" className="text-foreground cursor-pointer">
              Include header row
            </Label>
          </div>
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-2">Preview:</div>
            <div className="bg-muted/30 p-3 rounded-md overflow-x-auto text-xs font-mono text-foreground">
              <pre className="whitespace-pre">{generateTableMarkdown()}</pre>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            Insert Table
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
