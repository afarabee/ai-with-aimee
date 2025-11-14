import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  created_at: string;
  size: number;
  publicUrl: string;
  type: 'image' | 'document' | 'video' | 'other';
}

interface AssetPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, filename: string) => void;
}

export default function AssetPicker({ open, onClose, onSelect }: AssetPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const detectFileType = (filename: string): Asset['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (['pdf'].includes(ext || '')) return 'document';
    if (['mp4', 'webm', 'mov'].includes(ext || '')) return 'video';
    return 'other';
  };

  const { data: assets, isLoading } = useQuery({
    queryKey: ['asset-picker'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .list('blog', { 
          limit: 500, 
          sortBy: { column: 'created_at', order: 'desc' } 
        });
      
      if (error) throw error;
      
      return data.map(file => {
        const { data: publicData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(`blog/${file.name}`);
        
        const type = detectFileType(file.name);
        
        return {
          id: `blog/${file.name}`,
          name: file.name,
          created_at: file.created_at,
          size: file.metadata?.size || 0,
          publicUrl: publicData.publicUrl,
          type,
        } as Asset;
      });
    },
    enabled: open,
  });

  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    
    return assets
      .filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
        const isImage = asset.type === 'image';
        return matchesSearch && isImage;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [assets, searchTerm]);

  const handleSelect = () => {
    if (!selectedAsset) {
      toast.error('Please select an asset');
      return;
    }
    onSelect(selectedAsset.publicUrl, selectedAsset.name);
    setSelectedAsset(null);
    setSearchTerm('');
    onClose();
  };

  const handleClose = () => {
    setSelectedAsset(null);
    setSearchTerm('');
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[800px] max-h-[80vh] flex flex-col"
        style={{
          background: 'rgba(26, 11, 46, 0.95)',
          border: '2px solid hsl(var(--color-cyan) / 0.4)',
          boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.3)',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-montserrat"
            style={{ color: 'hsl(var(--color-cyan))' }}
          >
            Choose from Asset Library
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Asset Grid */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No images found matching your search' : 'No images in library. Upload images first.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`relative cursor-pointer group rounded-lg overflow-hidden transition-all ${
                      selectedAsset?.id === asset.id
                        ? 'ring-2 ring-primary'
                        : 'hover:ring-2 hover:ring-primary/50'
                    }`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={asset.publicUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                      {selectedAsset?.id === asset.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="h-8 w-8 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs truncate" title={asset.name}>
                        {asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(asset.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedAsset}>
              Select
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
