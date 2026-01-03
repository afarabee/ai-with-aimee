import React, { useState, useEffect } from 'react';
import { Table, Plus, Trash2, X, ClipboardPaste } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface TableEditorProps {
  onInsert: (tableMarkdown: string) => void;
  existingTable?: string;
  mode?: 'insert' | 'edit';
}

interface CellData {
  content: string;
}

export const TableEditor: React.FC<TableEditorProps> = ({ 
  onInsert, 
  existingTable,
  mode = 'insert' 
}) => {
  const [open, setOpen] = useState(mode === 'edit');
  const [tableData, setTableData] = useState<CellData[][]>([]);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [pasteInput, setPasteInput] = useState('');

  // Detect the format and delimiter of pasted data
  const detectFormat = (text: string): { format: string; delimiter: string } => {
    const lines = text.trim().split('\n');
    const firstLine = lines[0] || '';
    
    // Check for markdown table (pipes with content)
    const pipeCount = (firstLine.match(/\|/g) || []).length;
    if (pipeCount >= 2) {
      return { format: 'Markdown', delimiter: '|' };
    }
    
    // Check for tabs (Excel/Sheets copy)
    if (firstLine.includes('\t')) {
      return { format: 'TSV (Excel/Sheets)', delimiter: '\t' };
    }
    
    // Check for commas
    if (firstLine.includes(',')) {
      return { format: 'CSV', delimiter: ',' };
    }
    
    // Fallback - try to detect based on consistent spacing
    return { format: 'Plain text', delimiter: '\t' };
  };

  // Parse pasted clipboard data with improved format handling
  const parseClipboardData = (text: string): { data: CellData[][]; format: string } | null => {
    // Normalize line endings
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    const { format, delimiter } = detectFormat(normalizedText);
    const data: CellData[][] = [];
    
    for (const line of lines) {
      // Skip markdown separator lines (e.g., |---|---|, |:---:|:---:|)
      if (line.match(/^\|?\s*[:|-]+\s*\|/) && line.match(/^[\s|:-]+$/)) continue;
      if (line.match(/^\|[\s-:|]+\|$/)) continue;
      
      let cells: string[];
      if (delimiter === '|') {
        // Handle markdown-style: | cell | cell |
        // Also handle cells without leading/trailing pipes
        let cleanLine = line.trim();
        
        // Remove leading pipe if present
        if (cleanLine.startsWith('|')) cleanLine = cleanLine.slice(1);
        // Remove trailing pipe if present  
        if (cleanLine.endsWith('|')) cleanLine = cleanLine.slice(0, -1);
        
        cells = cleanLine.split('|').map(cell => {
          // Clean up cell content - handle escaped pipes and trim
          return cell.replace(/\\\|/g, '|').trim();
        });
      } else {
        cells = line.split(delimiter).map(cell => cell.trim());
      }
      
      // Filter out completely empty rows
      if (cells.length > 0 && cells.some(c => c !== '')) {
        data.push(cells.map(content => ({ content })));
      }
    }

    // Normalize column count (fill missing cells with empty strings)
    if (data.length > 0) {
      const maxCols = Math.max(...data.map(row => row.length));
      data.forEach(row => {
        while (row.length < maxCols) {
          row.push({ content: '' });
        }
      });
    }

    return data.length > 0 ? { data, format } : null;
  };

  const handleLoadPastedData = () => {
    if (!pasteInput.trim()) {
      toast({
        title: "No data to load",
        description: "Please paste some table data first.",
        variant: "destructive",
      });
      return;
    }

    const result = parseClipboardData(pasteInput);
    if (!result) {
      toast({
        title: "Could not parse data",
        description: "Make sure your data is in a supported format: markdown table, TSV (Excel/Sheets), or CSV.",
        variant: "destructive",
      });
      return;
    }

    setTableData(result.data);
    setPasteInput('');
    toast({
      title: "Table loaded",
      description: `Detected ${result.format} format. Loaded ${result.data.length} rows × ${result.data[0]?.length || 0} columns.`,
    });
  };

  // Open dialog automatically in edit mode
  useEffect(() => {
    if (mode === 'edit' && existingTable) {
      setOpen(true);
    }
  }, [mode, existingTable]);

  // Parse existing table markdown
  const parseTableMarkdown = (markdown: string): { data: CellData[][], hasHeaders: boolean } => {
    const lines = markdown.trim().split('\n').filter(line => line.trim());
    const hasHeaders = lines.length > 1 && lines[1].includes('---');
    const data: CellData[][] = [];

    lines.forEach((line, index) => {
      // Skip separator line
      if (line.includes('---')) return;
      
      const cells = line
        .split('|')
        .filter((cell, i, arr) => i > 0 && i < arr.length - 1) // Remove empty first/last
        .map(cell => ({ content: cell.trim() }));
      
      if (cells.length > 0) {
        data.push(cells);
      }
    });

    return { data, hasHeaders };
  };

  // Initialize table data
  useEffect(() => {
    if (existingTable) {
      const { data, hasHeaders } = parseTableMarkdown(existingTable);
      setTableData(data);
      setIncludeHeaders(hasHeaders);
    } else {
      // Default 3x3 table
      setTableData([
        [{ content: 'Header 1' }, { content: 'Header 2' }, { content: 'Header 3' }],
        [{ content: 'Cell 1' }, { content: 'Cell 2' }, { content: 'Cell 3' }],
        [{ content: 'Cell 4' }, { content: 'Cell 5' }, { content: 'Cell 6' }],
      ]);
    }
  }, [existingTable, open]);

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex].content = value;
    setTableData(newData);
  };

  const addRow = () => {
    const newRow = Array(tableData[0]?.length || 3).fill(null).map(() => ({ content: 'Cell' }));
    setTableData([...tableData, newRow]);
  };

  const deleteRow = (rowIndex: number) => {
    if (tableData.length <= 1) return; // Keep at least one row
    setTableData(tableData.filter((_, i) => i !== rowIndex));
  };

  const addColumn = () => {
    const newData = tableData.map(row => [...row, { content: 'Cell' }]);
    setTableData(newData);
  };

  const deleteColumn = (colIndex: number) => {
    if (tableData[0]?.length <= 1) return; // Keep at least one column
    setTableData(tableData.map(row => row.filter((_, i) => i !== colIndex)));
  };

  const generateTableMarkdown = () => {
    if (tableData.length === 0) return '';

    let markdown = '';
    const startRow = includeHeaders ? 1 : 0;

    tableData.forEach((row, rowIndex) => {
      const cells = row.map(cell => cell.content).join(' | ');
      markdown += `| ${cells} |\n`;

      // Add separator after first row if headers are included
      if (includeHeaders && rowIndex === 0) {
        const separator = row.map(() => '---').join(' | ');
        markdown += `| ${separator} |\n`;
      }
    });

    return markdown;
  };

  const handleInsert = () => {
    const tableMarkdown = generateTableMarkdown();
    onInsert(tableMarkdown);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    if (mode === 'edit') {
      // Reset selection in parent
      setTimeout(() => onInsert(''), 0);
    }
  };

  const handleReset = () => {
    setTableData([
      [{ content: 'Header 1' }, { content: 'Header 2' }, { content: 'Header 3' }],
      [{ content: 'Cell 1' }, { content: 'Cell 2' }, { content: 'Cell 3' }],
      [{ content: 'Cell 4' }, { content: 'Cell 5' }, { content: 'Cell 6' }],
    ]);
    setIncludeHeaders(true);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) handleCancel();
    }}>
      <DialogTrigger asChild>
        {mode === 'insert' ? (
          <button
            type="button"
            className="p-2 hover:bg-accent rounded transition-colors"
            title="Insert/Edit Table"
          >
            <Table className="h-4 w-4" />
          </button>
        ) : (
          <Button variant="outline" size="sm">
            <Table className="h-4 w-4 mr-2" />
            Edit Table
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-border z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'insert' ? 'Insert Table' : 'Edit Table'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Edit cells, add/remove rows and columns to build your table.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Paste Area */}
          <div className="space-y-2">
            <Label className="text-foreground">Paste table data:</Label>
            <p className="text-xs text-muted-foreground">
              Supports: Markdown tables (with pipes), Excel/Sheets (tab-separated), or CSV
            </p>
            <div className="flex gap-2">
              <Textarea
                placeholder={`Example formats:\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n\nOr paste directly from Excel/Sheets...`}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                className="min-h-[100px] font-mono text-sm"
              />
              <Button 
                variant="outline" 
                onClick={handleLoadPastedData}
                className="shrink-0"
              >
                <ClipboardPaste className="h-4 w-4 mr-1" />
                Load
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="headers"
                checked={includeHeaders}
                onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
              />
              <Label htmlFor="headers" className="text-foreground cursor-pointer">
                First row is header
              </Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addRow}>
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
              <Button variant="outline" size="sm" onClick={addColumn}>
                <Plus className="h-4 w-4 mr-1" />
                Add Column
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>

          {/* Table Editor */}
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-12 bg-muted/50 border-r border-border"></th>
                  {tableData[0]?.map((_, colIndex) => (
                    <th key={colIndex} className="bg-muted/50 border-r border-border p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteColumn(colIndex)}
                        className="h-6 w-6 p-0"
                        title="Delete column"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-border">
                    <td className="bg-muted/50 border-r border-border p-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(rowIndex)}
                        className="h-6 w-6 p-0"
                        title="Delete row"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border-r border-border p-1">
                        <Input
                          value={cell.content}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className={`text-sm ${
                            includeHeaders && rowIndex === 0 
                              ? 'font-semibold bg-primary/5' 
                              : ''
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Markdown Preview */}
          <div className="space-y-2">
            <Label className="text-foreground">Markdown Preview:</Label>
            <div className="bg-muted/30 p-3 rounded-md overflow-x-auto">
              <pre className="text-xs font-mono text-foreground whitespace-pre">
                {generateTableMarkdown()}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            {mode === 'insert' ? 'Insert Table' : 'Update Table'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
