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

  // Quote-aware parser for TSV/CSV that preserves newlines inside quoted fields
  const parseDelimitedWithQuotes = (text: string, delimiter: string): CellData[][] => {
    const data: CellData[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;
    let i = 0;

    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            // Escaped quote
            currentCell += '"';
            i += 2;
            continue;
          } else {
            // End of quoted field
            inQuotes = false;
            i++;
            continue;
          }
        } else {
          // Regular character inside quotes (including newlines)
          currentCell += char;
          i++;
          continue;
        }
      } else {
        if (char === '"') {
          // Start of quoted field
          inQuotes = true;
          i++;
          continue;
        } else if (char === delimiter) {
          // Cell boundary
          currentRow.push(currentCell.trim());
          currentCell = '';
          i++;
          continue;
        } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
          // Row boundary
          currentRow.push(currentCell.trim());
          if (currentRow.some(c => c !== '')) {
            data.push(currentRow.map(content => ({ content })));
          }
          currentRow = [];
          currentCell = '';
          i += char === '\r' ? 2 : 1;
          continue;
        } else if (char === '\r') {
          // Row boundary (old Mac style)
          currentRow.push(currentCell.trim());
          if (currentRow.some(c => c !== '')) {
            data.push(currentRow.map(content => ({ content })));
          }
          currentRow = [];
          currentCell = '';
          i++;
          continue;
        } else {
          currentCell += char;
          i++;
          continue;
        }
      }
    }

    // Handle last cell/row
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c !== '')) {
      data.push(currentRow.map(content => ({ content })));
    }

    return data;
  };

  // Detect the format and delimiter of pasted data
  const detectFormat = (text: string): { format: string; delimiter: string; isMarkdown: boolean } => {
    const lines = text.trim().split('\n');
    const firstLine = lines[0] || '';
    
    // Check for markdown table (pipes with content)
    const pipeCount = (firstLine.match(/\|/g) || []).length;
    if (pipeCount >= 2) {
      return { format: 'Markdown', delimiter: '|', isMarkdown: true };
    }
    
    // Check for tabs (Excel/Sheets copy)
    if (firstLine.includes('\t')) {
      return { format: 'TSV (Excel/Sheets)', delimiter: '\t', isMarkdown: false };
    }
    
    // Check for commas
    if (firstLine.includes(',')) {
      return { format: 'CSV', delimiter: ',', isMarkdown: false };
    }
    
    // Fallback - try to detect based on consistent spacing
    return { format: 'Plain text', delimiter: '\t', isMarkdown: false };
  };

  // Parse markdown pipe format (line = row, <br> -> \n)
  const parseMarkdownTable = (text: string): CellData[][] => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const data: CellData[][] = [];

    for (const line of lines) {
      // Skip markdown separator lines (e.g., |---|---|, |:---:|:---:|)
      if (line.match(/^\|?\s*[:|-]+\s*\|/) && line.match(/^[\s|:-]+$/)) continue;
      if (line.match(/^\|[\s-:|]+\|$/)) continue;

      let cleanLine = line.trim();
      
      // Remove leading pipe if present
      if (cleanLine.startsWith('|')) cleanLine = cleanLine.slice(1);
      // Remove trailing pipe if present  
      if (cleanLine.endsWith('|')) cleanLine = cleanLine.slice(0, -1);
      
      const cells = cleanLine.split('|').map(cell => {
        // Clean up cell content - handle escaped pipes, convert <br> to newlines
        return cell
          .replace(/\\\|/g, '|')
          .replace(/<br\s*\/?>/gi, '\n')
          .trim();
      });

      if (cells.length > 0 && cells.some(c => c !== '')) {
        data.push(cells.map(content => ({ content })));
      }
    }

    return data;
  };

  // Parse pasted clipboard data with improved format handling
  const parseClipboardData = (text: string): { data: CellData[][]; format: string } | null => {
    // Normalize line endings for initial detection
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    if (!normalizedText.trim()) return null;

    const { format, delimiter, isMarkdown } = detectFormat(normalizedText);
    let data: CellData[][];

    if (isMarkdown) {
      // Use line-based parsing for markdown (it doesn't support multiline cells natively)
      data = parseMarkdownTable(normalizedText);
    } else {
      // Use quote-aware parsing for TSV/CSV
      data = parseDelimitedWithQuotes(normalizedText, delimiter);
    }

    if (data.length === 0) return null;

    // Normalize column count (fill missing cells with empty strings)
    const maxCols = Math.max(...data.map(row => row.length));
    data.forEach(row => {
      while (row.length < maxCols) {
        row.push({ content: '' });
      }
    });

    return { data, format };
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

    lines.forEach((line) => {
      // Skip separator line
      if (line.includes('---')) return;
      
      const cells = line
        .split('|')
        .filter((cell, i, arr) => i > 0 && i < arr.length - 1) // Remove empty first/last
        .map(cell => ({ 
          content: cell
            .replace(/<br\s*\/?>/gi, '\n') // Convert <br> back to newlines for editing
            .trim() 
        }));
      
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
    const newRow = Array(tableData[0]?.length || 3).fill(null).map(() => ({ content: '' }));
    setTableData([...tableData, newRow]);
  };

  const deleteRow = (rowIndex: number) => {
    if (tableData.length <= 1) return; // Keep at least one row
    setTableData(tableData.filter((_, i) => i !== rowIndex));
  };

  const addColumn = () => {
    const newData = tableData.map(row => [...row, { content: '' }]);
    setTableData(newData);
  };

  const deleteColumn = (colIndex: number) => {
    if (tableData[0]?.length <= 1) return; // Keep at least one column
    setTableData(tableData.map(row => row.filter((_, i) => i !== colIndex)));
  };

  const generateTableMarkdown = () => {
    if (tableData.length === 0) return '';

    let markdown = '';

    tableData.forEach((row, rowIndex) => {
      // Encode newlines as <br /> for valid markdown table (one row per line)
      const cells = row.map(cell => 
        cell.content.replace(/\n/g, '<br />')
      ).join(' | ');
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'insert' ? 'Insert Table' : 'Edit Table'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Edit cells, add/remove rows and columns to build your table. Cells support multiple lines.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Paste Area */}
          <div className="space-y-2">
            <Label className="text-foreground">Paste table data:</Label>
            <p className="text-xs text-muted-foreground">
              Supports: Markdown tables, Excel/Sheets (tab-separated), or CSV. Multiline cells are preserved.
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

          {/* Table Editor - constrained width */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full table-fixed" style={{ minWidth: '400px' }}>
                <colgroup>
                  <col className="w-12" />
                  {tableData[0]?.map((_, colIndex) => (
                    <col key={colIndex} style={{ minWidth: '120px', maxWidth: '250px' }} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    <th className="w-12 bg-muted/50 border-r border-b border-border"></th>
                    {tableData[0]?.map((_, colIndex) => (
                      <th key={colIndex} className="bg-muted/50 border-r border-b border-border p-2">
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
                    <tr key={rowIndex} className="border-b border-border last:border-b-0">
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
                        <td key={colIndex} className="border-r border-border p-1 last:border-r-0 align-top">
                          <Textarea
                            value={cell.content}
                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                            rows={2}
                            className={`text-sm resize-none min-h-[48px] max-h-[120px] ${
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
          </div>

          {/* Markdown Preview */}
          <div className="space-y-2">
            <Label className="text-foreground">Markdown Preview:</Label>
            <div className="bg-muted/30 p-3 rounded-md overflow-x-auto max-w-full">
              <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-all">
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
