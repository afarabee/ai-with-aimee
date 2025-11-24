import React from 'react';
import { TableEditor } from './TableEditor';

interface TableBuilderProps {
  onInsert: (tableMarkdown: string) => void;
}

export const TableBuilder: React.FC<TableBuilderProps> = ({ onInsert }) => {
  return <TableEditor onInsert={onInsert} mode="insert" />;
};
