import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface UploadBasemapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload?: (data: any) => void;
}

export default function UploadBasemapDialog({ open, onOpenChange, onUpload }: UploadBasemapDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    onUpload?.({ name, description, file });
    setName("");
    setDescription("");
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <div className="mt-2 flex items-center justify-center border-2 border-dashed rounded-md p-6 hover-elevate cursor-pointer">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "Choose file or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
              <input
                type="file"
                id="basemap-file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                data-testid="input-file"
              />
            </div>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => document.getElementById('basemap-file')?.click()}
              data-testid="button-choose-file"
            >
              Choose File
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!name || !file}
            data-testid="button-upload"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
