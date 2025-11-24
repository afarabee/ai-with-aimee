import React, { useState, useEffect } from 'react';
import { Table, Plus, Trash2, X } from 'lucide-react';
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
