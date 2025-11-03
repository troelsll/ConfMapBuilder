import MapCard from '../MapCard';

export default function MapCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <MapCard
        id="1"
        name="Gabe's Conference Map"
        dateRange="Jan 1 - Jan 10, 2026"
        location="Orlando, FL"
        logo="GABE'S"
        poiCount={8}
        sectionCount={3}
        onEdit={() => console.log('Edit clicked')}
        onDuplicate={() => console.log('Duplicate clicked')}
        onShare={() => console.log('Share clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}
