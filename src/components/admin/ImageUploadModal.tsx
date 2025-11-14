import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import AssetPicker from './AssetPicker';

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
}

export default function ImageUploadModal({ open, onClose, onInsert }: ImageUploadModalProps) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [assetAlt, setAssetAlt] = useState('');

  const handleUrlInsert = () => {
    if (!url) {
      toast.error('Please enter an image URL');
      return;
    }
    onInsert(url, alt || 'Image');
    setUrl('');
    setAlt('');
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-blog-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { url } = await response.json();
      onInsert(url, alt || file.name);
      toast.success('Image uploaded successfully');
      setAlt('');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAssetSelect = (url: string, filename: string) => {
    onInsert(url, assetAlt || filename);
    setAssetAlt('');
    setIsAssetPickerOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
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
            Insert Image
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url">
              <LinkIcon className="w-4 h-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="library">
              <ImageIcon className="w-4 h-4 mr-2" />
              Library
            </TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="alt-text">Alt Text (optional)</Label>
              <Input
                id="alt-text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image"
                className="mt-2"
              />
            </div>
            <Button onClick={handleUrlInsert} className="w-full">
              Insert Image
            </Button>
          </TabsContent>
          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label htmlFor="alt-text-upload">Alt Text (optional)</Label>
              <Input
                id="alt-text-upload"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="file-upload">Select Image</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="mt-2"
              />
            </div>
            {uploading && (
              <p className="text-sm text-center" style={{ color: 'hsl(var(--color-cyan))' }}>
                Uploading...
              </p>
            )}
          </TabsContent>
          <TabsContent value="library" className="space-y-4">
            <div>
              <Label htmlFor="asset-alt-text">Alt Text (optional)</Label>
              <Input
                id="asset-alt-text"
                value={assetAlt}
                onChange={(e) => setAssetAlt(e.target.value)}
                placeholder="Describe the image"
                className="mt-2"
              />
            </div>
            <Button 
              onClick={() => setIsAssetPickerOpen(true)} 
              className="w-full"
            >
              Choose from Library
            </Button>
          </TabsContent>
        </Tabs>

        <AssetPicker
          open={isAssetPickerOpen}
          onClose={() => setIsAssetPickerOpen(false)}
          onSelect={handleAssetSelect}
        />
      </DialogContent>
    </Dialog>
  );
}
