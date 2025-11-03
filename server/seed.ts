import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Create categories
  const categories = [
    { name: "Hotels", color: "blue" },
    { name: "Restaurants", color: "red" },
    { name: "Entertainment", color: "purple" },
    { name: "Shopping", color: "green" },
    { name: "Theme Parks", color: "orange" },
    { name: "Convention Center", color: "pink" },
  ];

  const createdCategories = await Promise.all(
    categories.map(cat => storage.createCategory(cat))
  );
  console.log(`Created ${createdCategories.length} categories`);

  // Create some POIs
  const hotelsCategory = createdCategories.find(c => c.name === "Hotels")!;
  const restaurantsCategory = createdCategories.find(c => c.name === "Restaurants")!;
  const themeparksCategory = createdCategories.find(c => c.name === "Theme Parks")!;
  const conventionCategory = createdCategories.find(c => c.name === "Convention Center")!;

  const pois = [
    { name: "Castle Hotel, Autograph Collection", categoryId: hotelsCategory.id },
    { name: "Doubletree by Hilton Orlando at Seaworld", categoryId: hotelsCategory.id },
    { name: "Hyatt Regency Orlando", categoryId: hotelsCategory.id },
    { name: "Courtyard by Marriot I-Drive", categoryId: hotelsCategory.id },
    { name: "Days Inn by Wyndham", categoryId: hotelsCategory.id },
    { name: "Magnus Ice Cream Shop", categoryId: restaurantsCategory.id },
    { name: "Universal Studios", categoryId: themeparksCategory.id },
    { name: "SeaWorld", categoryId: themeparksCategory.id },
    { name: "Orange County Convention Center", categoryId: conventionCategory.id },
  ];

  const createdPOIs = await Promise.all(
    pois.map(poi => storage.createPOI(poi))
  );
  console.log(`Created ${createdPOIs.length} POIs`);

  console.log("Seeding complete!");
}

seed().catch(console.error);
