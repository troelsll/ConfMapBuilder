import MapEditor from '../MapEditor';

export default function MapEditorExample() {
  // todo: remove mock functionality
  const mockAvailablePOIs = [
    { id: "1", name: "Magnus Ice Cream Shop", category: "Restaurants" },
    { id: "2", name: "Castle Hotel", category: "Hotels" },
    { id: "3", name: "Convention Center", category: "Convention Center" },
    { id: "4", name: "Universal Studios", category: "Theme Parks" },
  ];

  const mockPlacedPOIs = [
    { id: "5", name: "Doubletree Hotel", category: "Hotels", x: 30, y: 40 },
    { id: "6", name: "Hyatt Regency", category: "Hotels", x: 60, y: 50 },
  ];

  return (
    <MapEditor
      availablePOIs={mockAvailablePOIs}
      placedPOIs={mockPlacedPOIs}
      onSave={(pois) => console.log('Saved:', pois)}
    />
  );
}
