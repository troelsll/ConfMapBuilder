import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MapEditor from "@/components/MapEditor";

interface POI {
  id: string;
  name: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface PlacedPOI {
  id: string;
  eventMapId: string;
  poiId: string;
  sectionId?: string;
  x: number;
  y: number;
  poi: POI;
}

interface Basemap {
  id: string;
  name: string;
  imageUrl: string;
}

export default function MapEditorPage() {
  const { id } = useParams();

  const { data: basemap } = useQuery<Basemap>({
    queryKey: ['/api/basemaps', id],
    queryFn: async () => {
      const response = await fetch(`/api/basemaps/${id}`);
      if (!response.ok) throw new Error('Failed to fetch basemap');
      return response.json();
    },
    enabled: !!id,
  });

  const { data: allPOIs = [] } = useQuery<POI[]>({
    queryKey: ['/api/pois'],
  });

  const { data: placedPOIs = [] } = useQuery<PlacedPOI[]>({
    queryKey: ['/api/event-maps', id, 'placed-pois'],
    queryFn: async () => {
      return [];
    },
    enabled: !!id,
  });

  const availablePOIs = allPOIs.map(poi => ({
    id: poi.id,
    name: poi.name,
    category: poi.category.name,
  }));

  const placedPOIsFormatted = placedPOIs.map(pp => ({
    id: pp.poi.id,
    name: pp.poi.name,
    category: pp.poi.category.name,
    x: pp.x,
    y: pp.y,
  }));

  if (!basemap) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <MapEditor
        basemapName={basemap.name}
        basemapImage={basemap.imageUrl}
        availablePOIs={availablePOIs}
        placedPOIs={placedPOIsFormatted}
      />
    </>
  );
}
