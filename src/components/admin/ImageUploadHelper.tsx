import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadHelperProps {
  onBannerInsert: (url: string) => void;
  onBodyInsert: (url: string, alt: string) => void;
}

export default function ImageUploadHelper({ onBannerInsert, onBodyInsert }: ImageUploadHelperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [altText, setAltText] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setUploadedImage({ url: publicUrl, name: file.name });
      setAltText(file.name.split('.')[0]); // Auto-fill alt text
      
      toast.success('Image uploaded successfully!', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className={`upload-helper-card ${isDragging ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="font-rajdhani font-bold text-lg mb-3" style={{ color: 'hsl(var(--color-cyan))' }}>
        📸 Upload Image
      </h3>

      {!uploadedImage ? (
        <>
          <div className="text-center py-8 border-2 border-dashed rounded-lg" 
               style={{ borderColor: isDragging ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)' }}>
            <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--color-cyan))' }} />
            <p className="text-sm mb-2" style={{ color: 'hsl(var(--color-light-text))' }}>
              Drag & drop an image here, or
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
              }}
              className="hidden"
              id="image-upload-input"
              disabled={uploading}
            />
            <label htmlFor="image-upload-input">
              <Button 
                type="button"
                disabled={uploading}
                className="action-button-primary"
                asChild
              >
                <span>
                  {uploading ? 'Uploading...' : 'Choose File'}
                </span>
              </Button>
            </label>
            <p className="text-xs mt-2" style={{ color: 'hsl(var(--color-light-text) / 0.5)' }}>
              Max size: 5MB • PNG, JPG, GIF, WebP
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Success State - Show uploaded image with actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg" 
                 style={{ background: 'rgba(0, 255, 255, 0.05)', border: '1px solid hsl(var(--color-cyan) / 0.3)' }}>
              <img 
                src={uploadedImage.url} 
                alt={uploadedImage.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'hsl(var(--color-cyan))' }}>
                  ✓ {uploadedImage.name}
                </p>
                <p className="text-xs mt-1 truncate" style={{ color: 'hsl(var(--color-light-text) / 0.7)' }}>
                  {uploadedImage.url}
                </p>
              </div>
            </div>

            {/* Alt Text Input */}
            <div>
              <Label htmlFor="image-alt-text" className="text-sm" style={{ color: 'hsl(var(--color-light-text))' }}>
                Alt Text (for body insertion)
              </Label>
              <Input
                id="image-alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image"
                className="mt-1"
                style={{ background: 'rgba(26, 11, 46, 0.6)' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                onClick={() => onBannerInsert(uploadedImage.url)}
                className="action-button-primary text-xs"
              >
                Set as Banner
              </Button>
              <Button
                type="button"
                onClick={() => onBodyInsert(uploadedImage.url, altText || uploadedImage.name)}
                className="action-button-primary text-xs"
              >
                Insert into Body
              </Button>
              <Button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(uploadedImage.url);
                  toast.success('URL copied!', {
                    style: {
                      background: 'rgba(249, 249, 64, 0.1)',
                      border: '1px solid hsl(var(--color-yellow))',
                      color: 'hsl(var(--color-yellow))',
                    },
                  });
                }}
                className="action-button-secondary text-xs"
              >
                Copy URL
              </Button>
            </div>

            {/* Upload Another */}
            <Button
              type="button"
              onClick={() => {
                setUploadedImage(null);
                setAltText('');
              }}
              variant="ghost"
              className="w-full text-xs"
              style={{ color: 'hsl(var(--color-light-text) / 0.7)' }}
            >
              Upload Another Image
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
