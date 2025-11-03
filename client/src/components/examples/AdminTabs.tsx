import AdminTabs from '../AdminTabs';

export default function AdminTabsExample() {
  return (
    <div className="p-6">
      <AdminTabs
        onUploadBasemap={() => console.log('Upload basemap')}
        onAddPOI={() => console.log('Add POI')}
        onAddCategory={() => console.log('Add category')}
        onEditBasemap={(id) => console.log('Edit basemap:', id)}
      />
    </div>
  );
}
