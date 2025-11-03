import { useState } from "react";
import Header from "@/components/Header";
import AdminTabs from "@/components/AdminTabs";
import UploadBasemapDialog from "@/components/UploadBasemapDialog";
import AddPOIDialog from "@/components/AddPOIDialog";
import { useLocation } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddPOIDialog, setShowAddPOIDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);

  const handleEditBasemap = (id: string) => {
    console.log('Edit basemap:', id);
    setLocation(`/admin/basemap/${id}`);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" data-testid="text-page-title">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage basemaps, points of interest, and categories</p>
        </div>

        <AdminTabs
          onUploadBasemap={() => setShowUploadDialog(true)}
          onAddPOI={() => setShowAddPOIDialog(true)}
          onAddCategory={() => setShowAddCategoryDialog(true)}
          onEditBasemap={handleEditBasemap}
        />
      </div>

      <UploadBasemapDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={(data) => console.log('Uploaded basemap:', data)}
      />

      <AddPOIDialog
        open={showAddPOIDialog}
        onOpenChange={setShowAddPOIDialog}
        onAdd={(data) => console.log('Added POI:', data)}
      />
    </>
  );
}
