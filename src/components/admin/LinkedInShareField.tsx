import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LinkedInShareFieldProps {
  slug: string;
  type: 'blog' | 'projects';
}

export default function LinkedInShareField({ slug, type }: LinkedInShareFieldProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://ai-with-aims.studio/${type}/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2 mt-2">
      <Input value={shareUrl} readOnly className="text-xs opacity-80" />
      <Button type="button" variant="outline" size="icon" onClick={handleCopy} title="Copy to clipboard">
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}
