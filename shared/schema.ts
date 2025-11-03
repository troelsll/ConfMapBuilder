import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export const basemaps = pgTable("basemaps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
});

export const pois = pgTable("pois", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  categoryId: varchar("category_id").notNull().references(() => categories.id, { onDelete: 'cascade' }),
});

export const eventMaps = pgTable("event_maps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  dateRange: text("date_range").notNull(),
  location: text("location").notNull(),
  logoUrl: text("logo_url"),
  basemapId: varchar("basemap_id").notNull().references(() => basemaps.id, { onDelete: 'cascade' }),
});

export const mapSections = pgTable("map_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventMapId: varchar("event_map_id").notNull().references(() => eventMaps.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
});

export const placedPois = pgTable("placed_pois", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventMapId: varchar("event_map_id").notNull().references(() => eventMaps.id, { onDelete: 'cascade' }),
  poiId: varchar("poi_id").notNull().references(() => pois.id, { onDelete: 'cascade' }),
  sectionId: varchar("section_id").references(() => mapSections.id, { onDelete: 'set null' }),
  x: real("x").notNull(),
  y: real("y").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertBasemapSchema = createInsertSchema(basemaps).omit({
  id: true,
});

export const insertPOISchema = createInsertSchema(pois).omit({
  id: true,
});

export const insertEventMapSchema = createInsertSchema(eventMaps).omit({
  id: true,
});

export const insertMapSectionSchema = createInsertSchema(mapSections).omit({
  id: true,
});

export const insertPlacedPOISchema = createInsertSchema(placedPois).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertBasemap = z.infer<typeof insertBasemapSchema>;
export type Basemap = typeof basemaps.$inferSelect;

export type InsertPOI = z.infer<typeof insertPOISchema>;
export type POI = typeof pois.$inferSelect;

export type InsertEventMap = z.infer<typeof insertEventMapSchema>;
export type EventMap = typeof eventMaps.$inferSelect;

export type InsertMapSection = z.infer<typeof insertMapSectionSchema>;
export type MapSection = typeof mapSections.$inferSelect;

export type InsertPlacedPOI = z.infer<typeof insertPlacedPOISchema>;
export type PlacedPOI = typeof placedPois.$inferSelect;
