import Header from "@/components/Header";
import MapEditor from "@/components/MapEditor";

export default function MapEditorPage() {
  // todo: remove mock functionality
  const mockAvailablePOIs = [
    { id: "1", name: "Magnus Ice Cream Shop", category: "Restaurants" },
    { id: "2", name: "Castle Hotel, Autograph Collection", category: "Hotels" },
    { id: "3", name: "Convention Center", category: "Convention Center" },
    { id: "4", name: "Courtyard by Marriot I-Drive", category: "Hotels" },
    { id: "5", name: "Days Inn by Wyndham", category: "Hotels" },
    { id: "6", name: "Doubletree by Hilton", category: "Hotels" },
    { id: "7", name: "Universal Studios", category: "Theme Parks" },
    { id: "8", name: "SeaWorld", category: "Theme Parks" },
  ];

  const mockPlacedPOIs = [
    { id: "9", name: "Hyatt Regency Orlando", category: "Hotels", x: 45, y: 35 },
    { id: "10", name: "Orange County Convention Center", category: "Convention Center", x: 60, y: 60 },
  ];

  return (
    <>
      <Header />
      <MapEditor
        basemapName="Orlando I-Drive Sample Map"
        availablePOIs={mockAvailablePOIs}
        placedPOIs={mockPlacedPOIs}
        onSave={(pois) => console.log('Saved POIs:', pois)}
      />
    </>
  );
}
