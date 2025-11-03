import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import MapCard from "@/components/MapCard";
import CreateMapDialog from "@/components/CreateMapDialog";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface EventMap {
  id: string;
  name: string;
  dateRange: string;
  location: string;
  logoUrl: string | null;
  basemapId: string;
  basemap: {
    id: string;
    name: string;
    imageUrl: string;
  };
  poiCount: number;
  sectionCount: number;
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: eventMaps = [], isLoading } = useQuery<EventMap[]>({
    queryKey: ['/api/event-maps'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/event-maps/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/event-maps'] });
      toast({
        title: 'Success',
        description: 'Map deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete map',
        variant: 'destructive',
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (map: EventMap) => {
      const response = await apiRequest('/api/event-maps', {
        method: 'POST',
        body: JSON.stringify({
          name: `${map.name} (Copy)`,
          dateRange: map.dateRange,
          location: map.location,
          basemapId: map.basemapId,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/event-maps'] });
      toast({
        title: 'Success',
        description: 'Map duplicated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to duplicate map',
        variant: 'destructive',
      });
    },
  });

  const filteredMaps = eventMaps.filter(map =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by event name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-new-map">
            <Plus className="w-4 h-4 mr-2" />
            Create New Map
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading maps...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaps.map((map) => (
                <MapCard
                  key={map.id}
                  id={map.id}
                  name={map.name}
                  dateRange={map.dateRange}
                  location={map.location}
                  logo={map.logoUrl || undefined}
                  poiCount={map.poiCount}
                  sectionCount={map.sectionCount}
                  basemapPreview={map.basemap?.imageUrl}
                  onEdit={() => setLocation(`/admin/basemap/${map.basemapId}`)}
                  onDuplicate={() => duplicateMutation.mutate(map)}
                  onShare={() => {
                    toast({
                      title: 'Share Map',
                      description: 'Share functionality coming soon!',
                    });
                  }}
                  onDelete={() => deleteMutation.mutate(map.id)}
                />
              ))}
            </div>

            {filteredMaps.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-results">
                  {eventMaps.length === 0 
                    ? "No maps yet. Create your first map to get started!"
                    : "No maps found matching your search."
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <CreateMapDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}
