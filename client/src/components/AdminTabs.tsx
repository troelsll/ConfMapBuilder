import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Upload, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminTabsProps {
  onUploadBasemap?: () => void;
  onAddPOI?: () => void;
  onAddCategory?: () => void;
  onEditBasemap?: (id: string) => void;
}

export default function AdminTabs({
  onUploadBasemap,
  onAddPOI,
  onAddCategory,
  onEditBasemap,
}: AdminTabsProps) {
  const [searchBasemaps, setSearchBasemaps] = useState("");
  const [searchPOIs, setSearchPOIs] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // todo: remove mock functionality
  const mockBasemaps = [
    { id: "1", name: "Carrieworld", size: "2000x1500px", date: "6/12/2025" },
    { id: "2", name: "Hotel District Map", description: "International Drive hotel and dining district overview", size: "900x600px", date: "6/12/2025" },
    { id: "3", name: "Convention Center Floor Plan", size: "900x700px", date: "6/12/2025" },
  ];

  const mockPOIs = [
    { id: "1", name: "Castle Hotel, Autograph Collection", category: "Hotels" },
    { id: "2", name: "Convention Center", category: "Entertainment" },
    { id: "3", name: "Courtyard by Marriot I-Drive / Convention Center", category: "Hotels" },
    { id: "4", name: "Days Inn by Wyndham Orlando Convention Center", category: "Hotels" },
    { id: "5", name: "Doubletree by Hilton Orlando at Seaworld", category: "Hotels" },
  ];

  const mockCategories = [
    { id: "1", name: "Hotels", color: "blue" },
    { id: "2", name: "Restaurants", color: "red" },
    { id: "3", name: "Entertainment", color: "purple" },
    { id: "4", name: "Shopping", color: "green" },
    { id: "5", name: "Theme Parks", color: "orange" },
    { id: "6", name: "Convention Center", color: "pink" },
  ];

  const categoryColors: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
  };

  const filteredPOIs = mockPOIs.filter(poi => {
    const matchesSearch = poi.name.toLowerCase().includes(searchPOIs.toLowerCase());
    const matchesCategory = categoryFilter === "all" || poi.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Tabs defaultValue="basemaps" className="w-full" data-testid="tabs-admin">
      <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="basemaps"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          data-testid="tab-basemaps"
        >
          Basemaps
        </TabsTrigger>
        <TabsTrigger
          value="pois"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          data-testid="tab-pois"
        >
          POIs
        </TabsTrigger>
        <TabsTrigger
          value="categories"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          data-testid="tab-categories"
        >
          Categories
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basemaps" className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search basemaps..."
              value={searchBasemaps}
              onChange={(e) => setSearchBasemaps(e.target.value)}
              className="pl-9"
              data-testid="input-search-basemaps"
            />
          </div>
          <Button onClick={onUploadBasemap} data-testid="button-upload-new">
            <Upload className="w-4 h-4 mr-2" />
            Upload New
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-3">
            {mockBasemaps.map((basemap) => (
              <Card key={basemap.id} className="p-4" data-testid={`card-basemap-${basemap.id}`}>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-md flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{basemap.name}</h3>
                    {basemap.description && (
                      <p className="text-sm text-muted-foreground mb-2">{basemap.description}</p>
                    )}
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{basemap.size}</span>
                      <span>•</span>
                      <span>{basemap.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEditBasemap?.(basemap.id)}
                      data-testid={`button-edit-${basemap.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-delete-${basemap.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="pois" className="mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search POIs..."
              value={searchPOIs}
              onChange={(e) => setSearchPOIs(e.target.value)}
              className="pl-9"
              data-testid="input-search-pois"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48" data-testid="select-category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onAddPOI} data-testid="button-add-poi">
            <Plus className="w-4 h-4 mr-2" />
            Add POI
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-2">
            {filteredPOIs.map((poi) => (
              <Card key={poi.id} className="p-4 flex items-center gap-3" data-testid={`card-poi-${poi.id}`}>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{poi.name}</p>
                  <p className="text-sm text-muted-foreground">{poi.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid={`button-edit-${poi.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid={`button-delete-${poi.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="categories" className="mt-6 space-y-4">
        <div className="flex justify-end">
          <Button onClick={onAddCategory} data-testid="button-add-category">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-2 gap-3">
            {mockCategories.map((category) => (
              <Card key={category.id} className="p-4" data-testid={`card-category-${category.id}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${categoryColors[category.color]} rounded-md flex-shrink-0`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-edit-${category.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-delete-${category.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
