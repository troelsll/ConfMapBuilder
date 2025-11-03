import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => void;
}

export default function CreateMapDialog({ open, onOpenChange, onSave }: CreateMapDialogProps) {
  const [eventName, setEventName] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [location, setLocation] = useState("");
  const [selectedBasemap, setSelectedBasemap] = useState<string | null>(null);
  const [sections, setSections] = useState<Array<{ id: string; title: string; pois: string[] }>>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // todo: remove mock functionality
  const mockBasemaps = [
    { id: "1", name: "Carrieworld", availablePOIs: 4 },
    { id: "2", name: "Hotel District Map", availablePOIs: 3 },
    { id: "3", name: "Convention Center Floor Plan", availablePOIs: 5 },
  ];

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      setSections([...sections, { id: Date.now().toString(), title: newSectionTitle, pois: [] }]);
      setNewSectionTitle("");
      setShowAddSection(false);
    }
  };

  const handleSave = () => {
    onSave?.({ eventName, dateRange, location, basemapId: selectedBasemap, sections });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <div>
                  <Label htmlFor="logo" data-testid="label-logo">Event Logo</Label>
                  <Button variant="outline" className="w-full" data-testid="button-choose-file">
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">No file chosen</p>
                </div>
              </div>
            </div>

            <div>
              <Label data-testid="label-basemap">Select Basemap *</Label>
              <ScrollArea className="h-48 mt-2">
                <div className="space-y-2">
                  {mockBasemaps.map((basemap) => (
                    <Card
                      key={basemap.id}
                      className={`p-3 cursor-pointer hover-elevate ${selectedBasemap === basemap.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedBasemap(basemap.id)}
                      data-testid={`card-basemap-${basemap.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-muted rounded-md"></div>
                        <div>
                          <p className="font-medium text-sm">{basemap.name}</p>
                          <p className="text-xs text-muted-foreground">{basemap.availablePOIs} available POIs</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
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
                      <div className="flex items-center justify-between mb-2">
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        data-testid={`button-add-poi-${section.id}`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add POI
                      </Button>
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
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!eventName || !dateRange || !location || !selectedBasemap}
            data-testid="button-create-map"
          >
            Create Map
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
