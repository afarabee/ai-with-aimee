import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import aimeeHeadshotOriginal from '@/assets/aimee-headshot-new.png';

const HeadshotEditor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState(
    "Remove shine and glossy highlights from the skin, especially on the forehead, nose, and cheeks. " +
    "Create a more matte, professional finish while keeping the image natural-looking. " +
    "Preserve all facial features, hair, clothing, and background exactly as they are. " +
    "Only reduce the oily/shiny appearance on the skin."
  );
  const { toast } = useToast();

  const processImage = async () => {
    setIsProcessing(true);
    setEditedImage(null);

    try {
      // Convert the imported image to a full URL
      const imageUrl = new URL(aimeeHeadshotOriginal, window.location.origin).href;
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/edit-headshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          prompt: customPrompt
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      if (data.editedImageUrl) {
        setEditedImage(data.editedImageUrl);
        toast({
          title: "Success!",
          description: data.message || "Image processed successfully",
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!editedImage) return;
    
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'aimee-headshot-edited.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded!",
      description: "The edited image has been downloaded. Replace src/assets/aimee-headshot-new.png with this file.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Headshot Editor</h1>
          <p className="text-muted-foreground mt-2">
            Use AI to remove shine and enhance your headshot photo
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Prompt</CardTitle>
            <CardDescription>
              Customize the editing instructions for the AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <Button 
              onClick={processImage} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Process Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img 
                  src={aimeeHeadshotOriginal} 
                  alt="Original headshot"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {isProcessing ? (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">AI is processing...</p>
                  </div>
                ) : editedImage ? (
                  <img 
                    src={editedImage} 
                    alt="Edited headshot"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click "Process Image" to generate
                  </p>
                )}
              </div>
              {editedImage && (
                <Button 
                  onClick={downloadImage}
                  variant="outline"
                  className="w-full mt-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Edited Image
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {editedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>1. Download the edited image using the button above</p>
              <p>2. Replace <code className="bg-muted px-1 rounded">src/assets/aimee-headshot-new.png</code> with the downloaded file</p>
              <p>3. The About page and homepage will automatically use the updated image</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default HeadshotEditor;
