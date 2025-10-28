export type BlockType = 'blog' | 'project' | 'prompt' | 'note';

export interface NewsletterBlock {
  id: string;
  type: BlockType;
  source_id?: string; // Original blog/project/prompt ID
  title: string;
  summary?: string;
  context?: string; // Personal commentary added by user
}

export interface Newsletter {
  id?: string;
  title: string;
  subject: string;
  body: string;
  blocks: NewsletterBlock[];
  status: 'draft' | 'queued' | 'sent';
  send_type: 'adhoc' | 'scheduled';
  scheduled_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SelectedItemFromDashboard {
  type: BlockType;
  id: string;
  title: string;
  data?: any;
}
