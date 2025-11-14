import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Copy, Trash2, Image as ImageIcon, FileText, Video, File, Edit2, Expand, Check, X, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Asset {
  id: string;
  name: string;
  created_at: string;
  size: number;
  publicUrl: string;
  type: 'image' | 'document' | 'video' | 'other';
}

export default function AssetGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'document' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'>('newest');
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [renaming, setRenaming] = useState(false);

  const detectFileType = (filename: string): Asset['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (['pdf'].includes(ext || '')) return 'document';
    if (['mp4', 'webm', 'mov'].includes(ext || '')) return 'video';
    return 'other';
  };

  const { data: assets, isLoading, refetch } = useQuery({
    queryKey: ['admin-assets'],
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
  });

  const filteredAndSortedAssets = useMemo(() => {
    if (!assets) return [];
    
    let filtered = assets.filter(asset => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = asset.name.toLowerCase().includes(searchLower);
      const matchesType = typeFilter === 'all' || asset.type === typeFilter;
      return matchesSearch && matchesType;
    });
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-asc':
          return a.size - b.size;
        case 'size-desc':
          return b.size - a.size;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [assets, searchTerm, typeFilter, sortBy]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload an image file (PNG, JPG, GIF, WebP, SVG)', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB', {
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
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-blog-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      toast.success('Asset uploaded successfully!', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });
      
      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload', {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const { error } = await supabase.storage
        .from('blog-images')
        .remove([deleteTarget.id]);
      
      if (error) throw error;
      
      toast.success('Asset deleted successfully', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      
      refetch();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete asset', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleCopyUrl = (url: string, filename: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`URL copied: ${filename}`, {
      style: {
        background: 'rgba(249, 249, 64, 0.1)',
        border: '1px solid hsl(var(--color-yellow))',
        color: 'hsl(var(--color-yellow))',
      },
    });
  };

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
    if (file) await handleUpload(file);
  };

  const handleRename = async (asset: Asset, newName: string) => {
    if (!newName.trim()) {
      toast.error('Filename cannot be empty');
      return;
    }

    // Extract file extension from original name
    const ext = asset.name.split('.').pop();
    const finalName = newName.includes('.') ? newName : `${newName}.${ext}`;

    // Check if name is unchanged
    if (finalName === asset.name) {
      setEditingAsset(null);
      return;
    }

    setRenaming(true);
    try {
      // Use move to rename the file
      const { error } = await supabase.storage
        .from('blog-images')
        .move(`blog/${asset.name}`, `blog/${finalName}`);

      if (error) throw error;

      toast.success('File renamed successfully', {
        style: {
          background: 'rgba(0, 255, 255, 0.2)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });

      setEditingAsset(null);
      setNewFileName('');
      refetch();
    } catch (error: any) {
      console.error('Error renaming file:', error);
      toast.error(error.message || 'Failed to rename file', {
        style: {
          background: 'rgba(245, 12, 160, 0.2)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
    } finally {
      setRenaming(false);
    }
  };

  const FileTypeIcon = ({ type, size = 20 }: { type: Asset['type']; size?: number }) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={size} style={{ color: 'hsl(var(--color-cyan))' }} />;
      case 'document':
        return <FileText size={size} style={{ color: 'hsl(var(--color-yellow))' }} />;
      case 'video':
        return <Video size={size} style={{ color: 'hsl(var(--color-pink))' }} />;
      default:
        return <File size={size} style={{ color: 'hsl(var(--color-light-text))' }} />;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-[1800px]">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 
              className="text-4xl font-rajdhani font-bold"
              style={{ color: 'hsl(var(--color-cyan))' }}
            >
              🖼️ Asset Library
            </h1>
            <p 
              className="text-sm font-ibm-plex mt-2"
              style={{ color: 'hsl(var(--color-light-text) / 0.7)' }}
            >
              Manage, search, and upload media for AI with Aimee
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div 
          className={`p-6 rounded-xl backdrop-blur-md mb-8 transition-all upload-zone ${isDragging ? 'dragging' : ''}`}
          style={{
            background: isDragging ? 'rgba(245, 12, 160, 0.05)' : 'rgba(26, 11, 46, 0.6)',
            border: `2px solid ${isDragging ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)'}`,
            boxShadow: isDragging 
              ? '0 0 30px hsl(var(--color-pink) / 0.3)' 
              : '0 0 30px hsl(var(--color-cyan) / 0.2)',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload 
              className="w-12 h-12 mx-auto mb-4" 
              style={{ color: isDragging ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan))' }} 
            />
            <p 
              className="text-sm mb-2 font-ibm-plex" 
              style={{ color: 'hsl(var(--color-light-text))' }}
            >
              Drag & drop an image here, or
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
              className="hidden"
              id="asset-upload-input"
              disabled={uploading}
            />
            <label htmlFor="asset-upload-input">
              <Button 
                type="button"
                disabled={uploading}
                className="font-rajdhani transition-all"
                style={{
                  background: 'rgba(0, 255, 255, 0.2)',
                  border: '2px solid hsl(var(--color-cyan))',
                  color: 'hsl(var(--color-cyan))',
                  boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.4)',
                }}
                asChild
              >
                <span>
                  {uploading ? 'Uploading...' : 'Choose File'}
                </span>
              </Button>
            </label>
            <p 
              className="text-xs mt-2 font-ibm-plex" 
              style={{ color: 'hsl(var(--color-light-text) / 0.5)' }}
            >
              Max size: 10MB • PNG, JPG, GIF, WebP, SVG
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div 
          className="p-6 rounded-xl backdrop-blur-md mb-8"
          style={{
            background: 'rgba(26, 11, 46, 0.6)',
            border: '2px solid hsl(var(--color-cyan) / 0.3)',
            boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.2)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label 
                className="font-rajdhani mb-2 block"
                style={{ color: 'hsl(var(--color-cyan))' }}
              >
                Search by Filename
              </Label>
              <Input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-ibm-plex"
                style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  borderColor: 'hsl(var(--color-cyan) / 0.3)',
                  color: 'hsl(var(--color-light-text))',
                }}
              />
            </div>
            
            <div>
              <Label 
                className="font-rajdhani mb-2 block"
                style={{ color: 'hsl(var(--color-cyan))' }}
              >
                Filter by Type
              </Label>
              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger 
                  className="font-ibm-plex"
                  style={{ 
                    background: 'rgba(26, 11, 46, 0.6)',
                    borderColor: 'hsl(var(--color-cyan) / 0.3)',
                    color: 'hsl(var(--color-light-text))',
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label 
                className="font-rajdhani mb-2 block"
                style={{ color: 'hsl(var(--color-cyan))' }}
              >
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger 
                  className="font-ibm-plex"
                  style={{ 
                    background: 'rgba(26, 11, 46, 0.6)',
                    borderColor: 'hsl(var(--color-cyan) / 0.3)',
                    color: 'hsl(var(--color-light-text))',
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="size-desc">Largest First</SelectItem>
                  <SelectItem value="size-asc">Smallest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <p 
            className="mt-4 text-sm font-rajdhani" 
            style={{ color: 'hsl(var(--color-cyan))' }}
          >
            Showing {filteredAndSortedAssets?.length || 0} of {assets?.length || 0} assets
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-xl font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
              Loading assets...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAndSortedAssets?.length === 0 && (
          <div 
            className="text-center py-20 rounded-xl"
            style={{
              background: 'rgba(26, 11, 46, 0.6)',
              border: '2px solid hsl(var(--color-cyan) / 0.3)',
            }}
          >
            <ImageIcon 
              className="w-20 h-20 mx-auto mb-4" 
              style={{ color: 'hsl(var(--color-cyan))' }} 
            />
            <p className="text-xl font-rajdhani mb-2" style={{ color: 'hsl(var(--color-cyan))' }}>
              No assets found
            </p>
            <p className="text-sm font-ibm-plex mb-4" style={{ color: 'hsl(var(--color-light-text))' }}>
              {searchTerm || typeFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Upload your first asset to get started'}
            </p>
          </div>
        )}

        {/* Asset Grid */}
        {!isLoading && filteredAndSortedAssets && filteredAndSortedAssets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAndSortedAssets.map((asset) => (
              <div
                key={asset.id}
                className="asset-card p-4 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(26, 11, 46, 0.65)',
                  border: '2px solid hsl(var(--color-cyan) / 0.3)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                }}
              >
                {/* Thumbnail */}
                <div 
                  className="asset-card-thumbnail mb-3 rounded-lg overflow-hidden cursor-pointer group relative transition-all duration-300 hover:scale-105"
                  style={{ 
                    height: '160px',
                    background: 'rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={() => {
                    setPreviewAsset(asset);
                    setPreviewDialogOpen(true);
                  }}
                >
                  {asset.type === 'image' ? (
                    <>
                      <img 
                        src={asset.publicUrl} 
                        alt={asset.name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Expand size={32} style={{ color: 'hsl(var(--color-cyan))' }} />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileTypeIcon type={asset.type} size={48} />
                    </div>
                  )}
                </div>

                {/* Filename */}
                {editingAsset?.id === asset.id ? (
                  <div className="flex items-center gap-1 mb-2">
                    <Input
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(asset, newFileName);
                        if (e.key === 'Escape') {
                          setEditingAsset(null);
                          setNewFileName('');
                        }
                      }}
                      className="h-7 text-xs font-rajdhani"
                      style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid hsl(var(--color-cyan))',
                        color: 'hsl(var(--color-cyan))',
                      }}
                      disabled={renaming}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleRename(asset, newFileName)}
                      disabled={renaming}
                      className="h-7 w-7 p-0"
                      style={{
                        background: 'rgba(0, 255, 255, 0.15)',
                        border: '1px solid hsl(var(--color-cyan))',
                      }}
                    >
                      <Check size={14} style={{ color: 'hsl(var(--color-cyan))' }} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingAsset(null);
                        setNewFileName('');
                      }}
                      disabled={renaming}
                      className="h-7 w-7 p-0"
                      style={{
                        background: 'rgba(245, 12, 160, 0.15)',
                        border: '1px solid hsl(var(--color-pink))',
                      }}
                    >
                      <X size={14} style={{ color: 'hsl(var(--color-pink))' }} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h3 
                      className="font-rajdhani font-semibold text-sm truncate flex-1"
                      style={{ color: 'hsl(var(--color-cyan))' }}
                      title={asset.name}
                      onDoubleClick={() => {
                        setEditingAsset(asset);
                        setNewFileName(asset.name.replace(/\.[^/.]+$/, ''));
                      }}
                    >
                      {asset.name}
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingAsset(asset);
                        setNewFileName(asset.name.replace(/\.[^/.]+$/, ''));
                      }}
                      className="h-6 w-6 p-0"
                      style={{
                        background: 'rgba(255, 221, 0, 0.15)',
                        border: '1px solid hsl(var(--color-yellow))',
                      }}
                    >
                      <Edit2 size={12} style={{ color: 'hsl(var(--color-yellow))' }} />
                    </Button>
                  </div>
                )}

                {/* Metadata */}
                <div className="text-xs font-ibm-plex mb-3 space-y-1">
                  <p style={{ color: 'hsl(var(--color-yellow))' }}>
                    {format(new Date(asset.created_at), 'MMM dd, yyyy')}
                  </p>
                  <p style={{ color: 'hsl(var(--color-light-text) / 0.7)' }}>
                    {formatFileSize(asset.size)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCopyUrl(asset.publicUrl, asset.name)}
                    className="flex-1 text-xs"
                    style={{
                      background: 'rgba(0, 255, 255, 0.15)',
                      border: '2px solid #00ffff',
                      color: '#00ffff',
                    }}
                  >
                    <Copy size={14} className="mr-1" /> Copy
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      setDeleteTarget(asset);
                      setDeleteDialogOpen(true);
                    }}
                    className="flex-1 text-xs"
                    style={{
                      background: 'rgba(245, 12, 160, 0.15)',
                      border: '2px solid hsl(var(--color-pink))',
                      color: 'hsl(var(--color-pink))',
                    }}
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-pink) / 0.5)',
            boxShadow: '0 0 40px hsl(var(--color-pink) / 0.3)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle 
              className="font-rajdhani text-2xl"
              style={{ color: 'hsl(var(--color-pink))' }}
            >
              Delete Asset?
            </AlertDialogTitle>
            <AlertDialogDescription 
              className="font-ibm-plex"
              style={{ color: 'hsl(var(--color-light-text))' }}
            >
              Are you sure you want to permanently delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-rajdhani"
              style={{
                background: 'transparent',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="font-rajdhani"
              style={{
                background: 'rgba(245, 12, 160, 0.2)',
                border: '2px solid hsl(var(--color-pink))',
                color: 'hsl(var(--color-pink))',
                boxShadow: '0 0 20px hsl(var(--color-pink) / 0.4)',
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-auto"
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-cyan) / 0.5)',
            boxShadow: '0 0 40px hsl(var(--color-cyan) / 0.3)',
          }}
        >
          <DialogHeader>
            {editingAsset?.id === previewAsset?.id ? (
              <div className="flex items-center gap-2 mb-4">
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && previewAsset) handleRename(previewAsset, newFileName);
                    if (e.key === 'Escape') {
                      setEditingAsset(null);
                      setNewFileName('');
                    }
                  }}
                  className="flex-1 font-rajdhani text-xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid hsl(var(--color-cyan))',
                    color: 'hsl(var(--color-cyan))',
                  }}
                  disabled={renaming}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => previewAsset && handleRename(previewAsset, newFileName)}
                  disabled={renaming}
                  style={{
                    background: 'rgba(0, 255, 255, 0.15)',
                    border: '1px solid hsl(var(--color-cyan))',
                  }}
                >
                  <Check size={16} style={{ color: 'hsl(var(--color-cyan))' }} />
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingAsset(null);
                    setNewFileName('');
                  }}
                  disabled={renaming}
                  style={{
                    background: 'rgba(245, 12, 160, 0.15)',
                    border: '1px solid hsl(var(--color-pink))',
                  }}
                >
                  <X size={16} style={{ color: 'hsl(var(--color-pink))' }} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <DialogTitle 
                  className="font-rajdhani text-2xl flex-1 cursor-pointer"
                  style={{ color: 'hsl(var(--color-cyan))' }}
                  onDoubleClick={() => {
                    if (previewAsset) {
                      setEditingAsset(previewAsset);
                      setNewFileName(previewAsset.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                >
                  {previewAsset?.name}
                </DialogTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    if (previewAsset) {
                      setEditingAsset(previewAsset);
                      setNewFileName(previewAsset.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="h-8 w-8 p-0"
                  style={{
                    background: 'rgba(255, 221, 0, 0.15)',
                    border: '1px solid hsl(var(--color-yellow))',
                  }}
                >
                  <Edit2 size={16} style={{ color: 'hsl(var(--color-yellow))' }} />
                </Button>
              </div>
            )}
            
            <DialogDescription 
              className="font-ibm-plex space-y-1"
              style={{ color: 'hsl(var(--color-light-text))' }}
            >
              <div className="flex items-center gap-2">
                <FileTypeIcon type={previewAsset?.type || 'other'} size={16} />
                <span style={{ color: 'hsl(var(--color-yellow))' }}>
                  {previewAsset && formatFileSize(previewAsset.size)}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {previewAsset && format(new Date(previewAsset.created_at), 'MMM dd, yyyy • h:mm a')}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {previewAsset?.type === 'image' ? (
              <img 
                src={previewAsset.publicUrl} 
                alt={previewAsset.name}
                className="w-full h-auto rounded-lg"
                style={{
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
              />
            ) : (
              <div 
                className="flex flex-col items-center justify-center py-20 rounded-lg"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <FileTypeIcon type={previewAsset?.type || 'other'} size={80} />
                <p 
                  className="mt-4 font-ibm-plex"
                  style={{ color: 'hsl(var(--color-light-text))' }}
                >
                  Preview not available for this file type
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => previewAsset && handleCopyUrl(previewAsset.publicUrl, previewAsset.name)}
              className="flex-1 font-rajdhani"
              style={{
                background: 'rgba(0, 255, 255, 0.15)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
            >
              <Copy size={16} className="mr-2" /> Copy URL
            </Button>
            <Button
              onClick={() => {
                if (previewAsset) {
                  const link = document.createElement('a');
                  link.href = previewAsset.publicUrl;
                  link.download = previewAsset.name;
                  link.click();
                }
              }}
              className="flex-1 font-rajdhani"
              style={{
                background: 'rgba(255, 221, 0, 0.15)',
                border: '2px solid hsl(var(--color-yellow))',
                color: 'hsl(var(--color-yellow))',
              }}
            >
              <Download size={16} className="mr-2" /> Download
            </Button>
            <Button
              onClick={() => {
                if (previewAsset) {
                  setDeleteTarget(previewAsset);
                  setPreviewDialogOpen(false);
                  setDeleteDialogOpen(true);
                }
              }}
              className="flex-1 font-rajdhani"
              style={{
                background: 'rgba(245, 12, 160, 0.15)',
                border: '2px solid hsl(var(--color-pink))',
                color: 'hsl(var(--color-pink))',
              }}
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
