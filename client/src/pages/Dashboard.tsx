import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import MapCard from "@/components/MapCard";
import CreateMapDialog from "@/components/CreateMapDialog";
import Header from "@/components/Header";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // todo: remove mock functionality
  const mockMaps = [
    {
      id: "1",
      name: "Ellucian Live 2025",
      dateRange: "April 6-9, 2025",
      location: "Orlando, FL",
      logo: "ellucian",
      poiCount: 20,
      sectionCount: 4,
    },
    {
      id: "2",
      name: "Karleigh's Map",
      dateRange: "Jan 1 - Jan 4, 2026",
      location: "Orlando",
      poiCount: 0,
      sectionCount: 0,
    },
    {
      id: "3",
      name: "Becca's Conference",
      dateRange: "January 1, 2026 - January 4, 2026",
      location: "Lake Nona",
      logo: "razorfish",
      poiCount: 5,
      sectionCount: 3,
    },
    {
      id: "4",
      name: "Becca's Conference (Copy)",
      dateRange: "January 1, 2026 - January 4, 2026",
      location: "Lake Nona",
      poiCount: 5,
      sectionCount: 3,
    },
    {
      id: "5",
      name: "Cornhole Happy Hour Tournament",
      dateRange: "June 13",
      location: "Bay Hill, FL",
      logo: "SHFVBF'z",
      poiCount: 4,
      sectionCount: 4,
    },
    {
      id: "6",
      name: "FCCLA",
      dateRange: "July 3 - July 9, 2026",
      location: "Orlando, FL",
      poiCount: 4,
      sectionCount: 2,
    },
    {
      id: "7",
      name: "Test-Con",
      dateRange: "June 13",
      location: "Bay Hill, FL",
      poiCount: 0,
      sectionCount: 0,
    },
    {
      id: "8",
      name: "Gabe's Test Conference",
      dateRange: "Jan 1 - Jan 4, 2026",
      location: "Orlando, FL",
      poiCount: 0,
      sectionCount: 0,
    },
    {
      id: "9",
      name: "Business Summit 2024",
      dateRange: "August 22-24, 2024",
      location: "Convention Center District",
      poiCount: 0,
      sectionCount: 0,
    },
  ];

  const filteredMaps = mockMaps.filter(map =>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaps.map((map) => (
            <MapCard
              key={map.id}
              {...map}
              onEdit={() => console.log('Edit map:', map.id)}
              onDuplicate={() => console.log('Duplicate map:', map.id)}
              onShare={() => console.log('Share map:', map.id)}
              onDelete={() => console.log('Delete map:', map.id)}
            />
          ))}
        </div>

        {filteredMaps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-results">No maps found matching your search.</p>
          </div>
        )}
      </div>

      <CreateMapDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={(data) => console.log('Created map:', data)}
      />
    </>
  );
}
