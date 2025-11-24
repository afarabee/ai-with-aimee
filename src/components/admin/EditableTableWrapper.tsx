import React, { useEffect, useRef, useState } from 'react';
import { TableEditor } from './TableEditor';
import { toast } from 'sonner';

interface EditableTableWrapperProps {
  children: React.ReactNode;
  body: string;
  onBodyUpdate: (newBody: string) => void;
}

export const EditableTableWrapper: React.FC<EditableTableWrapperProps> = ({
  children,
  body,
  onBodyUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tables = containerRef.current.querySelectorAll('table');
    
    // Add click handlers and hover styles to tables
    tables.forEach((table) => {
      // Add visual indicator
      table.style.cursor = 'pointer';
      table.style.position = 'relative';
      
      // Add hover effect
      const handleMouseEnter = () => {
        table.style.outline = '2px dashed hsl(var(--color-cyan))';
        table.style.outlineOffset = '4px';
        
        // Add edit indicator
        const indicator = document.createElement('div');
        indicator.className = 'table-edit-indicator';
        indicator.innerHTML = '✏️ Click to edit';
        indicator.style.cssText = `
          position: absolute;
          top: -32px;
          right: 0;
          background: hsl(var(--color-cyan));
          color: hsl(var(--color-dark-bg));
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          z-index: 10;
          pointer-events: none;
        `;
        table.appendChild(indicator);
      };
      
      const handleMouseLeave = () => {
        table.style.outline = '';
        table.style.outlineOffset = '';
        const indicator = table.querySelector('.table-edit-indicator');
        if (indicator) indicator.remove();
      };
      
      const handleTableClick = (e: MouseEvent) => {
        e.stopPropagation();
        
        // Extract table markdown from body
        const tableMarkdown = extractTableMarkdown();
        if (tableMarkdown) {
          setSelectedTable(tableMarkdown);
        }
      };
      
      table.addEventListener('mouseenter', handleMouseEnter);
      table.addEventListener('mouseleave', handleMouseLeave);
      table.addEventListener('click', handleTableClick);
    });
  }, [children, body]);

  const extractTableMarkdown = (): string | null => {
    // Get all table markdown blocks from the body
    const tables = body.match(/\|[^\n]+\|[\s\S]*?(?=\n\n|\n$|$)/g);
    
    if (!tables || tables.length === 0) return null;
    
    // For now, return the first table found
    // In a more sophisticated implementation, we'd match the exact table
    return tables[0];
  };

  const handleTableUpdate = (newTableMarkdown: string) => {
    if (!selectedTable) return;
    
    // Empty string means cancel
    if (!newTableMarkdown) {
      setSelectedTable(null);
      return;
    }
    
    // Replace the old table with the new one
    const newBody = body.replace(selectedTable, newTableMarkdown);
    onBodyUpdate(newBody);
    setSelectedTable(null);
    
    toast.success('Table updated!', {
      style: {
        background: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid hsl(var(--color-cyan))',
        color: 'hsl(var(--color-cyan))',
      },
    });
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        {children}
      </div>
      
      {selectedTable && (
        <TableEditor
          existingTable={selectedTable}
          mode="edit"
          onInsert={handleTableUpdate}
        />
      )}
    </>
  );
};
