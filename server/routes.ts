import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { 
  insertCategorySchema, 
  insertBasemapSchema, 
  insertPOISchema, 
  insertEventMapSchema,
  insertMapSectionSchema,
  insertPlacedPOISchema
} from "@shared/schema";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
const upload = multer({ 
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error as Error, uploadDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', (await import('express')).static(uploadDir));

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: 'Invalid category data' });
    }
  });

  app.patch('/api/categories/:id', async (req, res) => {
    try {
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, data);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: 'Invalid category data' });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // Basemaps
  app.get('/api/basemaps', async (req, res) => {
    try {
      const basemaps = await storage.getAllBasemaps();
      res.json(basemaps);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch basemaps' });
    }
  });

  app.get('/api/basemaps/:id', async (req, res) => {
    try {
      const basemap = await storage.getBasemap(req.params.id);
      if (!basemap) {
        return res.status(404).json({ error: 'Basemap not found' });
      }
      res.json(basemap);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch basemap' });
    }
  });

  app.post('/api/basemaps', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const data = insertBasemapSchema.parse({
        name: req.body.name,
        description: req.body.description || null,
        imageUrl,
        width: parseInt(req.body.width) || 800,
        height: parseInt(req.body.height) || 600,
      });

      const basemap = await storage.createBasemap(data);
      res.status(201).json(basemap);
    } catch (error) {
      res.status(400).json({ error: 'Invalid basemap data' });
    }
  });

  app.patch('/api/basemaps/:id', async (req, res) => {
    try {
      const data = insertBasemapSchema.partial().parse(req.body);
      const basemap = await storage.updateBasemap(req.params.id, data);
      if (!basemap) {
        return res.status(404).json({ error: 'Basemap not found' });
      }
      res.json(basemap);
    } catch (error) {
      res.status(400).json({ error: 'Invalid basemap data' });
    }
  });

  app.delete('/api/basemaps/:id', async (req, res) => {
    try {
      const success = await storage.deleteBasemap(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Basemap not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete basemap' });
    }
  });

  // POIs
  app.get('/api/pois', async (req, res) => {
    try {
      const pois = await storage.getAllPOIs();
      res.json(pois);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch POIs' });
    }
  });

  app.get('/api/pois/:id', async (req, res) => {
    try {
      const poi = await storage.getPOI(req.params.id);
      if (!poi) {
        return res.status(404).json({ error: 'POI not found' });
      }
      res.json(poi);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch POI' });
    }
  });

  app.post('/api/pois', async (req, res) => {
    try {
      const data = insertPOISchema.parse(req.body);
      const poi = await storage.createPOI(data);
      res.status(201).json(poi);
    } catch (error) {
      res.status(400).json({ error: 'Invalid POI data' });
    }
  });

  app.patch('/api/pois/:id', async (req, res) => {
    try {
      const data = insertPOISchema.partial().parse(req.body);
      const poi = await storage.updatePOI(req.params.id, data);
      if (!poi) {
        return res.status(404).json({ error: 'POI not found' });
      }
      res.json(poi);
    } catch (error) {
      res.status(400).json({ error: 'Invalid POI data' });
    }
  });

  app.delete('/api/pois/:id', async (req, res) => {
    try {
      const success = await storage.deletePOI(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'POI not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete POI' });
    }
  });

  // Event Maps
  app.get('/api/event-maps', async (req, res) => {
    try {
      const eventMaps = await storage.getAllEventMaps();
      res.json(eventMaps);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event maps' });
    }
  });

  app.get('/api/event-maps/:id', async (req, res) => {
    try {
      const eventMap = await storage.getEventMap(req.params.id);
      if (!eventMap) {
        return res.status(404).json({ error: 'Event map not found' });
      }
      res.json(eventMap);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event map' });
    }
  });

  app.post('/api/event-maps', upload.single('logo'), async (req, res) => {
    try {
      const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const data = insertEventMapSchema.parse({
        name: req.body.name,
        dateRange: req.body.dateRange,
        location: req.body.location,
        logoUrl,
        basemapId: req.body.basemapId,
      });

      const eventMap = await storage.createEventMap(data);
      res.status(201).json(eventMap);
    } catch (error) {
      res.status(400).json({ error: 'Invalid event map data' });
    }
  });

  app.patch('/api/event-maps/:id', async (req, res) => {
    try {
      const data = insertEventMapSchema.partial().parse(req.body);
      const eventMap = await storage.updateEventMap(req.params.id, data);
      if (!eventMap) {
        return res.status(404).json({ error: 'Event map not found' });
      }
      res.json(eventMap);
    } catch (error) {
      res.status(400).json({ error: 'Invalid event map data' });
    }
  });

  app.delete('/api/event-maps/:id', async (req, res) => {
    try {
      const success = await storage.deleteEventMap(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Event map not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event map' });
    }
  });

  // Map Sections
  app.get('/api/event-maps/:eventMapId/sections', async (req, res) => {
    try {
      const sections = await storage.getSectionsByEventMap(req.params.eventMapId);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sections' });
    }
  });

  app.post('/api/sections', async (req, res) => {
    try {
      const data = insertMapSectionSchema.parse(req.body);
      const section = await storage.createMapSection(data);
      res.status(201).json(section);
    } catch (error) {
      res.status(400).json({ error: 'Invalid section data' });
    }
  });

  app.patch('/api/sections/:id', async (req, res) => {
    try {
      const data = insertMapSectionSchema.partial().parse(req.body);
      const section = await storage.updateMapSection(req.params.id, data);
      if (!section) {
        return res.status(404).json({ error: 'Section not found' });
      }
      res.json(section);
    } catch (error) {
      res.status(400).json({ error: 'Invalid section data' });
    }
  });

  app.delete('/api/sections/:id', async (req, res) => {
    try {
      const success = await storage.deleteMapSection(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Section not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete section' });
    }
  });

  // Placed POIs
  app.get('/api/event-maps/:eventMapId/placed-pois', async (req, res) => {
    try {
      const placedPOIs = await storage.getPlacedPOIsByEventMap(req.params.eventMapId);
      res.json(placedPOIs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch placed POIs' });
    }
  });

  app.post('/api/placed-pois', async (req, res) => {
    try {
      const data = insertPlacedPOISchema.parse(req.body);
      const placedPOI = await storage.createPlacedPOI(data);
      res.status(201).json(placedPOI);
    } catch (error) {
      res.status(400).json({ error: 'Invalid placed POI data' });
    }
  });

  app.patch('/api/placed-pois/:id', async (req, res) => {
    try {
      const data = insertPlacedPOISchema.partial().parse(req.body);
      const placedPOI = await storage.updatePlacedPOI(req.params.id, data);
      if (!placedPOI) {
        return res.status(404).json({ error: 'Placed POI not found' });
      }
      res.json(placedPOI);
    } catch (error) {
      res.status(400).json({ error: 'Invalid placed POI data' });
    }
  });

  app.delete('/api/placed-pois/:id', async (req, res) => {
    try {
      const success = await storage.deletePlacedPOI(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Placed POI not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete placed POI' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
