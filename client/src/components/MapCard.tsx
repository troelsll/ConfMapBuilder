import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Copy, Share2, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MapCardProps {
  id: string;
  name: string;
  dateRange: string;
  location: string;
  logo?: string;
  poiCount: number;
  sectionCount: number;
  basemapPreview?: string;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onViewPDF?: () => void;
}

export default function MapCard({
  id,
  name,
  dateRange,
  location,
  logo,
  poiCount,
  sectionCount,
  basemapPreview,
  onEdit,
  onDuplicate,
  onShare,
  onDelete,
  onViewPDF,
}: MapCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-map-${id}`}>
      <CardContent className="p-0">
        <div className="aspect-video bg-muted relative overflow-hidden" data-testid={`img-preview-${id}`}>
          {basemapPreview ? (
            <img src={basemapPreview} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          {logo && (
            <div className="absolute top-4 left-4 w-16 h-16 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">{logo}</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg mb-1" data-testid={`text-name-${id}`}>{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span data-testid={`text-date-${id}`}>{dateRange}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span data-testid={`text-location-${id}`}>{location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" data-testid={`badge-pois-${id}`}>
              <MapPin className="w-3 h-3 mr-1" />
              {poiCount} POIs
            </Badge>
            <Badge variant="secondary" data-testid={`badge-sections-${id}`}>
              <FileText className="w-3 h-3 mr-1" />
              {sectionCount} Sections
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          data-testid={`button-edit-${id}`}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDuplicate}
          data-testid={`button-duplicate-${id}`}
        >
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onShare}
          data-testid={`button-share-${id}`}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          data-testid={`button-delete-${id}`}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
