import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadBasemapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadBasemapDialog({ open, onOpenChange }: UploadBasemapDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', name);
      if (description) formData.append('description', description);
      formData.append('width', dimensions.width.toString());
      formData.append('height', dimensions.height.toString());

      const response = await fetch('/api/basemaps', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        // Try to surface server error message
        let message = `${response.status}: ${response.statusText}`;
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {
          try {
            const text = await response.text();
            if (text) message = text;
          } catch {}
        }
        throw new Error(message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/basemaps'] });
      toast({
        title: 'Success',
        description: 'Basemap uploaded successfully',
      });
      handleClose();
    },
    onError: (error: unknown) => {
      const description = error instanceof Error ? error.message : 'Failed to upload basemap';
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleUpload = () => {
    uploadMutation.mutate();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setFile(null);
    setDimensions({ width: 0, height: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-testid="dialog-upload-basemap">
        <DialogHeader>
          <DialogTitle data-testid="text-dialog-title">Upload New Basemap</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="basemap-name" data-testid="label-name">Name *</Label>
            <Input
              id="basemap-name"
              placeholder="Enter basemap name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-name"
            />
          </div>

          <div>
            <Label htmlFor="basemap-description" data-testid="label-description">Description</Label>
            <Textarea
              id="basemap-description"
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="textarea-description"
            />
          </div>

          <div>
            <Label htmlFor="basemap-file" data-testid="label-file">Image File *</Label>
            <div 
              className="mt-2 flex items-center justify-center border-2 border-dashed rounded-md p-6 hover-elevate cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "Choose file or drag and drop"}
                </p>
                {file && dimensions.width > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dimensions.width} × {dimensions.height}px
                  </p>
                )}
                {!file && (
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="basemap-file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              data-testid="input-file"
            />
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => fileInputRef.current?.click()}
              data-testid="button-choose-file"
            >
              Choose File
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!name || !file || uploadMutation.isPending}
            data-testid="button-upload"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
