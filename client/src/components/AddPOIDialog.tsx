import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface AddPOIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPOIDialog({ open, onOpenChange }: AddPOIDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; categoryId: string }) => {
      const response = await apiRequest('/api/pois', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pois'] });
      toast({
        title: 'Success',
        description: 'POI created successfully',
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create POI',
        variant: 'destructive',
      });
    },
  });

  const handleAdd = () => {
    createMutation.mutate({ name, categoryId: category });
  };

  const handleClose = () => {
    setName("");
    setCategory("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
                  <SelectItem key={cat.id} value={cat.id} data-testid={`option-${cat.name}`}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            onClick={handleAdd}
            disabled={!name || !category || createMutation.isPending}
            data-testid="button-create-poi"
          >
            {createMutation.isPending ? 'Creating...' : 'Create POI'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
