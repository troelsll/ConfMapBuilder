import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPOIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (data: any) => void;
}

export default function AddPOIDialog({ open, onOpenChange, onAdd }: AddPOIDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  // todo: remove mock functionality
  const categories = [
    "Carrie's Faves",
    "Entertainment",
    "Hotels",
    "Restaurants",
    "Shopping",
    "Theme Parks",
  ];

  const handleAdd = () => {
    onAdd?.({ name, category });
    setName("");
    setCategory("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-add-poi">
        <DialogHeader>
          <DialogTitle data-testid="text-dialog-title">Add New POI</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="poi-name" data-testid="label-name">Name *</Label>
            <Input
              id="poi-name"
              placeholder="Enter POI name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-name"
            />
          </div>

          <div>
            <Label htmlFor="poi-category" data-testid="label-category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="poi-category" data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} data-testid={`option-${cat}`}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            onClick={handleAdd}
            disabled={!name || !category}
            data-testid="button-create-poi"
          >
            Create POI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
