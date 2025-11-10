import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Upload, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "";
import { useToast } from "@/hooks/use-toast";

interface Basemap {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  width: number;
  height: number;
}

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

interface Category {
  id: string;
  name: string;
  color: string;
}

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
  const { toast } = useToast();

  const { data: basemaps = [], isLoading: loadingBasemaps } = useQuery<Basemap[]>({
    queryKey: ['/api/basemaps'],
  });

  const { data: pois = [], isLoading: loadingPOIs } = useQuery<POI[]>({
    queryKey: ['/api/pois'],
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const deleteBasemapMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/basemaps/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/basemaps'] });
      toast({ title: 'Success', description: 'Basemap deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete basemap', variant: 'destructive' });
    },
  });

  const deletePOIMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/pois/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pois'] });
      toast({ title: 'Success', description: 'POI deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete POI', variant: 'destructive' });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/categories/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: 'Success', description: 'Category deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    },
  });

  const categoryColors: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
  };

  const filteredBasemaps = basemaps.filter(basemap =>
    basemap.name.toLowerCase().includes(searchBasemaps.toLowerCase())
  );

  const filteredPOIs = pois.filter(poi => {
    const matchesSearch = poi.name.toLowerCase().includes(searchPOIs.toLowerCase());
    const matchesCategory = categoryFilter === "all" || poi.category.name === categoryFilter;
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
          {loadingBasemaps ? (
            <p className="text-center py-12 text-muted-foreground">Loading basemaps...</p>
          ) : filteredBasemaps.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              {basemaps.length === 0 ? 'No basemaps yet. Upload one to get started!' : 'No basemaps found.'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredBasemaps.map((basemap) => (
                <Card key={basemap.id} className="p-4" data-testid={`card-basemap-${basemap.id}`}>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                      <img src={`${API_BASE_URL}${basemap.imageUrl}`} alt={basemap.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{basemap.name}</h3>
                      {basemap.description && (
                        <p className="text-sm text-muted-foreground mb-2">{basemap.description}</p>
                      )}
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{basemap.width}x{basemap.height}px</span>
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
                        onClick={() => deleteBasemapMutation.mutate(basemap.id)}
                        data-testid={`button-delete-${basemap.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
              {categories.map((cat) => (
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
          {loadingPOIs ? (
            <p className="text-center py-12 text-muted-foreground">Loading POIs...</p>
          ) : filteredPOIs.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              {pois.length === 0 ? 'No POIs yet. Add one to get started!' : 'No POIs found.'}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredPOIs.map((poi) => (
                <Card key={poi.id} className="p-4 flex items-center gap-3" data-testid={`card-poi-${poi.id}`}>
                  <div className={`w-8 h-8 ${categoryColors[poi.category.color] || 'bg-blue-500'} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{poi.name}</p>
                    <p className="text-sm text-muted-foreground">{poi.category.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deletePOIMutation.mutate(poi.id)}
                      data-testid={`button-delete-${poi.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
          {loadingCategories ? (
            <p className="text-center py-12 text-muted-foreground">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No categories yet. Add one to get started!</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Card key={category.id} className="p-4" data-testid={`card-category-${category.id}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${categoryColors[category.color] || 'bg-gray-500'} rounded-md flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{category.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                        data-testid={`button-delete-${category.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
