import {
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Basemap,
  type InsertBasemap,
  type POI,
  type InsertPOI,
  type EventMap,
  type InsertEventMap,
  type MapSection,
  type InsertMapSection,
  type PlacedPOI,
  type InsertPlacedPOI,
  users,
  categories,
  basemaps,
  pois,
  eventMaps,
  mapSections,
  placedPois,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Basemap methods
  getAllBasemaps(): Promise<Basemap[]>;
  getBasemap(id: string): Promise<Basemap | undefined>;
  createBasemap(basemap: InsertBasemap): Promise<Basemap>;
  updateBasemap(id: string, basemap: Partial<InsertBasemap>): Promise<Basemap | undefined>;
  deleteBasemap(id: string): Promise<boolean>;

  // POI methods
  getAllPOIs(): Promise<Array<POI & { category: Category }>>;
  getPOI(id: string): Promise<(POI & { category: Category }) | undefined>;
  getPOIsByCategory(categoryId: string): Promise<POI[]>;
  createPOI(poi: InsertPOI): Promise<POI>;
  updatePOI(id: string, poi: Partial<InsertPOI>): Promise<POI | undefined>;
  deletePOI(id: string): Promise<boolean>;

  // Event Map methods
  getAllEventMaps(): Promise<Array<EventMap & { basemap: Basemap; poiCount: number; sectionCount: number }>>;
  getEventMap(id: string): Promise<(EventMap & { basemap: Basemap }) | undefined>;
  createEventMap(eventMap: InsertEventMap): Promise<EventMap>;
  updateEventMap(id: string, eventMap: Partial<InsertEventMap>): Promise<EventMap | undefined>;
  deleteEventMap(id: string): Promise<boolean>;

  // Map Section methods
  getSectionsByEventMap(eventMapId: string): Promise<MapSection[]>;
  createMapSection(section: InsertMapSection): Promise<MapSection>;
  updateMapSection(id: string, section: Partial<InsertMapSection>): Promise<MapSection | undefined>;
  deleteMapSection(id: string): Promise<boolean>;

  // Placed POI methods
  getPlacedPOIsByEventMap(eventMapId: string): Promise<Array<PlacedPOI & { poi: POI & { category: Category }; section?: MapSection }>>;
  createPlacedPOI(placedPOI: InsertPlacedPOI): Promise<PlacedPOI>;
  updatePlacedPOI(id: string, placedPOI: Partial<InsertPlacedPOI>): Promise<PlacedPOI | undefined>;
  deletePlacedPOI(id: string): Promise<boolean>;
  deletePlacedPOIsByEventMap(eventMapId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Basemap methods
  async getAllBasemaps(): Promise<Basemap[]> {
    return await db.select().from(basemaps).orderBy(desc(basemaps.name));
  }

  async getBasemap(id: string): Promise<Basemap | undefined> {
    const [basemap] = await db.select().from(basemaps).where(eq(basemaps.id, id));
    return basemap;
  }

  async createBasemap(basemap: InsertBasemap): Promise<Basemap> {
    const [newBasemap] = await db.insert(basemaps).values(basemap).returning();
    return newBasemap;
  }

  async updateBasemap(id: string, basemap: Partial<InsertBasemap>): Promise<Basemap | undefined> {
    const [updated] = await db.update(basemaps).set(basemap).where(eq(basemaps.id, id)).returning();
    return updated;
  }

  async deleteBasemap(id: string): Promise<boolean> {
    const result = await db.delete(basemaps).where(eq(basemaps.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // POI methods
  async getAllPOIs(): Promise<Array<POI & { category: Category }>> {
    const results = await db
      .select()
      .from(pois)
      .leftJoin(categories, eq(pois.categoryId, categories.id));
    
    return results.map((r: any) => ({
      ...r.pois,
      category: r.categories!,
    }));
  }

  async getPOI(id: string): Promise<(POI & { category: Category }) | undefined> {
    const [result] = await db
      .select()
      .from(pois)
      .leftJoin(categories, eq(pois.categoryId, categories.id))
      .where(eq(pois.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.pois,
      category: result.categories!,
    };
  }

  async getPOIsByCategory(categoryId: string): Promise<POI[]> {
    return await db.select().from(pois).where(eq(pois.categoryId, categoryId));
  }

  async createPOI(poi: InsertPOI): Promise<POI> {
    const [newPOI] = await db.insert(pois).values(poi).returning();
    return newPOI;
  }

  async updatePOI(id: string, poi: Partial<InsertPOI>): Promise<POI | undefined> {
    const [updated] = await db.update(pois).set(poi).where(eq(pois.id, id)).returning();
    return updated;
  }

  async deletePOI(id: string): Promise<boolean> {
    const result = await db.delete(pois).where(eq(pois.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Map methods
  async getAllEventMaps(): Promise<Array<EventMap & { basemap: Basemap; poiCount: number; sectionCount: number }>> {
    const maps = await db
      .select()
      .from(eventMaps)
      .leftJoin(basemaps, eq(eventMaps.basemapId, basemaps.id))
      .orderBy(desc(eventMaps.name));

    const results = await Promise.all(
      maps.map(async (m: any) => {
        const poiCount = await db.select().from(placedPois).where(eq(placedPois.eventMapId, m.event_maps.id));
        const sectionCount = await db.select().from(mapSections).where(eq(mapSections.eventMapId, m.event_maps.id));
        
        return {
          ...m.event_maps,
          basemap: m.basemaps!,
          poiCount: poiCount.length,
          sectionCount: sectionCount.length,
        };
      })
    );

    return results;
  }

  async getEventMap(id: string): Promise<(EventMap & { basemap: Basemap }) | undefined> {
    const [result] = await db
      .select()
      .from(eventMaps)
      .leftJoin(basemaps, eq(eventMaps.basemapId, basemaps.id))
      .where(eq(eventMaps.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.event_maps,
      basemap: result.basemaps!,
    };
  }

  async createEventMap(eventMap: InsertEventMap): Promise<EventMap> {
    const [newEventMap] = await db.insert(eventMaps).values(eventMap).returning();
    return newEventMap;
  }

  async updateEventMap(id: string, eventMap: Partial<InsertEventMap>): Promise<EventMap | undefined> {
    const [updated] = await db.update(eventMaps).set(eventMap).where(eq(eventMaps.id, id)).returning();
    return updated;
  }

  async deleteEventMap(id: string): Promise<boolean> {
    await db.delete(mapSections).where(eq(mapSections.eventMapId, id));
    await db.delete(placedPois).where(eq(placedPois.eventMapId, id));
    const result = await db.delete(eventMaps).where(eq(eventMaps.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Map Section methods
  async getSectionsByEventMap(eventMapId: string): Promise<MapSection[]> {
    return await db.select().from(mapSections).where(eq(mapSections.eventMapId, eventMapId));
  }

  async createMapSection(section: InsertMapSection): Promise<MapSection> {
    const [newSection] = await db.insert(mapSections).values(section).returning();
    return newSection;
  }

  async updateMapSection(id: string, section: Partial<InsertMapSection>): Promise<MapSection | undefined> {
    const [updated] = await db.update(mapSections).set(section).where(eq(mapSections.id, id)).returning();
    return updated;
  }

  async deleteMapSection(id: string): Promise<boolean> {
    const result = await db.delete(mapSections).where(eq(mapSections.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Placed POI methods
  async getPlacedPOIsByEventMap(eventMapId: string): Promise<Array<PlacedPOI & { poi: POI & { category: Category }; section?: MapSection }>> {
    const results = await db
      .select()
      .from(placedPois)
      .leftJoin(pois, eq(placedPois.poiId, pois.id))
      .leftJoin(categories, eq(pois.categoryId, categories.id))
      .leftJoin(mapSections, eq(placedPois.sectionId, mapSections.id))
      .where(eq(placedPois.eventMapId, eventMapId));
    
    return results.map((r: any) => ({
      ...r.placed_pois,
      poi: {
        ...r.pois!,
        category: r.categories!,
      },
      section: r.map_sections || undefined,
    }));
  }

  async createPlacedPOI(placedPOI: InsertPlacedPOI): Promise<PlacedPOI> {
    const [newPlacedPOI] = await db.insert(placedPois).values(placedPOI).returning();
    return newPlacedPOI;
  }

  async updatePlacedPOI(id: string, placedPOI: Partial<InsertPlacedPOI>): Promise<PlacedPOI | undefined> {
    const [updated] = await db.update(placedPois).set(placedPOI).where(eq(placedPois.id, id)).returning();
    return updated;
  }

  async deletePlacedPOI(id: string): Promise<boolean> {
    const result = await db.delete(placedPois).where(eq(placedPois.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async deletePlacedPOIsByEventMap(eventMapId: string): Promise<boolean> {
    const result = await db.delete(placedPois).where(eq(placedPois.eventMapId, eventMapId));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
