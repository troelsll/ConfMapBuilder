import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Undo, Redo, ZoomIn, ZoomOut, MapPin } from "lucide-react";
import { Link } from "wouter";

interface POI {
  id: string;
  name: string;
  category: string;
  x?: number;
  y?: number;
}

interface MapEditorProps {
  basemapName?: string;
  basemapImage?: string;
  availablePOIs?: POI[];
  placedPOIs?: POI[];
  onSave?: (pois: POI[]) => void;
}

export default function MapEditor({
  basemapName = "Orlando I-Drive Sample Map",
  basemapImage,
  availablePOIs = [],
  placedPOIs = [],
  onSave,
}: MapEditorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [pois, setPois] = useState<POI[]>(placedPOIs);
  const [draggedPOI, setDraggedPOI] = useState<POI | null>(null);

  const filteredPOIs = availablePOIs.filter(poi =>
    poi.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (poi: POI) => {
    setDraggedPOI(poi);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPOI) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setPois([...pois, { ...draggedPOI, x, y }]);
      setDraggedPOI(null);
      console.log('POI placed:', draggedPOI.name, 'at', x, y);
    }
  };

  const handleSave = () => {
    onSave?.(pois);
    console.log('Saved POI placements:', pois);
  };

  // todo: remove mock functionality
  const categoryColors: Record<string, string> = {
    "Hotels": "bg-blue-500",
    "Restaurants": "bg-red-500",
    "Entertainment": "bg-purple-500",
    "Shopping": "bg-green-500",
    "Theme Parks": "bg-orange-500",
    "Convention Center": "bg-pink-500",
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <Link href="/admin" data-testid="link-back">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Basemaps
            </Button>
          </Link>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="font-semibold mb-2" data-testid="text-basemap-name">{basemapName}</h2>
            <p className="text-sm text-muted-foreground">Editing POI placements • {pois.length} placed POIs</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Available POIs</h3>
            <p className="text-xs text-muted-foreground mb-2">Drag POIs onto the map to place them</p>
            <Input
              placeholder="Search POIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-pois"
              className="mb-3"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-24rem)]">
            <div className="space-y-2">
              {filteredPOIs.map((poi) => (
                <Card
                  key={poi.id}
                  className="p-3 cursor-grab hover-elevate active-elevate-2"
                  draggable
                  onDragStart={() => handleDragStart(poi)}
                  data-testid={`card-poi-${poi.id}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${categoryColors[poi.category] || 'bg-gray-500'} flex items-center justify-center`}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{poi.name}</p>
                      <p className="text-xs text-muted-foreground">{poi.category}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-muted/30">
        <div className="flex items-center justify-between p-3 border-b bg-background">
          <div className="flex gap-2">
            <Button size="icon" variant="outline" data-testid="button-undo">
              <Undo className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" data-testid="button-redo">
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={() => setZoom(Math.max(50, zoom - 10))} data-testid="button-zoom-out">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center" data-testid="text-zoom">{zoom}%</span>
            <Button size="icon" variant="outline" onClick={() => setZoom(Math.min(200, zoom + 10))} data-testid="button-zoom-in">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={handleSave} data-testid="button-save-changes">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
          <div
            className="relative bg-background border shadow-lg"
            style={{ width: `${zoom}%`, paddingBottom: `${(zoom * 0.75)}%` }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            data-testid="canvas-map"
          >
            {basemapImage ? (
              <img src={basemapImage} alt="Basemap" className="absolute inset-0 w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <p className="text-muted-foreground">Basemap Preview</p>
              </div>
            )}

            {pois.map((poi) => (
              <div
                key={poi.id}
                className="absolute cursor-move"
                style={{
                  left: `${poi.x}%`,
                  top: `${poi.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                data-testid={`marker-${poi.id}`}
              >
                <div className={`w-8 h-8 rounded-full ${categoryColors[poi.category] || 'bg-gray-500'} flex items-center justify-center shadow-lg border-2 border-white`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <Badge className="text-xs">{poi.name}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
