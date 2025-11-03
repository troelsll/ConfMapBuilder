import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Basemap {
  id: string;
  name: string;
  imageUrl: string;
}

interface CreateMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateMapDialog({ open, onOpenChange }: CreateMapDialogProps) {
  const [eventName, setEventName] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [location, setLocation] = useState("");
  const [selectedBasemap, setSelectedBasemap] = useState<string | null>(null);
  const [sections, setSections] = useState<Array<{ id: string; title: string }>>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const { toast } = useToast();

  const { data: basemaps = [] } = useQuery<Basemap[]>({
    queryKey: ['/api/basemaps'],
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/event-maps', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: async (eventMap) => {
      try {
        if (sections.length > 0) {
          const responses = await Promise.all(
            sections.map((section, index) =>
              apiRequest('/api/sections', {
                method: 'POST',
                body: JSON.stringify({
                  eventMapId: eventMap.id,
                  title: section.title,
                  order: index,
                }),
                headers: { 'Content-Type': 'application/json' },
              })
            )
          );
          
          for (const response of responses) {
            if (!response.ok) {
              throw new Error('Failed to create section');
            }
          }
        }
        
        queryClient.invalidateQueries({ queryKey: ['/api/event-maps'] });
        toast({
          title: 'Success',
          description: 'Event map created successfully',
        });
        handleClose();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Event map created but some sections failed',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create event map',
        variant: 'destructive',
      });
    },
  });

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      setSections([...sections, { id: Date.now().toString(), title: newSectionTitle }]);
      setNewSectionTitle("");
      setShowAddSection(false);
    }
  };

  const handleSave = () => {
    createMutation.mutate({ 
      name: eventName, 
      dateRange, 
      location, 
      basemapId: selectedBasemap 
    });
  };

  const handleClose = () => {
    setEventName("");
    setDateRange("");
    setLocation("");
    setSelectedBasemap(null);
    setSections([]);
    setShowAddSection(false);
    setNewSectionTitle("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]" data-testid="dialog-create-map">
        <DialogHeader>
          <DialogTitle data-testid="text-dialog-title">Create Convention Map</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">Event Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-name" data-testid="label-event-name">Event Name *</Label>
                  <Input
                    id="event-name"
                    placeholder="Annual Sales Conference 2024"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    data-testid="input-event-name"
                  />
                </div>
                <div>
                  <Label htmlFor="date-range" data-testid="label-date-range">Date(s) *</Label>
                  <Input
                    id="date-range"
                    placeholder="March 15-17, 2024"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    data-testid="input-date-range"
                  />
                </div>
                <div>
                  <Label htmlFor="location" data-testid="label-location">City/Location *</Label>
                  <Input
                    id="location"
                    placeholder="Orlando, FL"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    data-testid="input-location"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label data-testid="label-basemap">Select Basemap *</Label>
              <ScrollArea className="h-48 mt-2">
                {basemaps.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No basemaps available. Upload one in the Admin panel first.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {basemaps.map((basemap) => (
                      <Card
                        key={basemap.id}
                        className={`p-3 cursor-pointer hover-elevate ${selectedBasemap === basemap.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedBasemap(basemap.id)}
                        data-testid={`card-basemap-${basemap.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                            <img src={basemap.imageUrl} alt={basemap.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{basemap.name}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Sections</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddSection(!showAddSection)}
                data-testid="button-add-section"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>

            {showAddSection && (
              <div className="mb-4 p-3 border rounded-md space-y-2">
                <Input
                  placeholder="Section title (e.g., Connected to Convention Center)"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  data-testid="input-section-title"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddSection} data-testid="button-save-section">
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowAddSection(false);
                      setNewSectionTitle("");
                    }}
                    data-testid="button-cancel-section"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-96">
              {sections.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-no-sections">
                  No sections created yet
                </div>
              ) : (
                <div className="space-y-3">
                  {sections.map((section) => (
                    <Card key={section.id} className="p-4" data-testid={`card-section-${section.id}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{section.title}</h4>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSections(sections.filter(s => s.id !== section.id))}
                          data-testid={`button-remove-section-${section.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
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
            onClick={handleSave}
            disabled={!eventName || !dateRange || !location || !selectedBasemap || createMutation.isPending}
            data-testid="button-create-map"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Map'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
