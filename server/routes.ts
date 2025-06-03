import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAdCopy, generateCampaignName, type AdGenerationRequest } from "./openai";
import { insertCampaignSchema, insertAdSchema, insertSocialAccountSchema, insertPostSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.updateCampaign(id, req.body);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCampaign(id);
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Ads
  app.get("/api/ads", async (req, res) => {
    try {
      const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : undefined;
      const ads = campaignId 
        ? await storage.getAdsByCampaign(campaignId)
        : await storage.getAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  });

  app.post("/api/ads", async (req, res) => {
    try {
      const validatedData = insertAdSchema.parse(req.body);
      const ad = await storage.createAd(validatedData);
      res.status(201).json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ad data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ad" });
    }
  });

  // AI Ad Generation
  app.post("/api/ai/generate-ad", async (req, res) => {
    try {
      const { product, audience, goal, platform } = req.body as AdGenerationRequest;
      
      if (!product || !audience || !goal) {
        return res.status(400).json({ 
          message: "Missing required fields: product, audience, and goal are required" 
        });
      }

      const generatedAd = await generateAdCopy({ product, audience, goal, platform });
      res.json(generatedAd);
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate ad copy. Please check your OpenAI API key and try again.",
        error: (error as Error).message 
      });
    }
  });

  app.post("/api/ai/generate-campaign-name", async (req, res) => {
    try {
      const { product, goal } = req.body;
      
      if (!product || !goal) {
        return res.status(400).json({ 
          message: "Missing required fields: product and goal are required" 
        });
      }

      const campaignName = await generateCampaignName(product, goal);
      res.json({ name: campaignName });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to generate campaign name",
        error: (error as Error).message 
      });
    }
  });

  // Social Media Accounts
  app.get("/api/social-accounts", async (req, res) => {
    try {
      const accounts = await storage.getSocialAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social accounts" });
    }
  });

  app.post("/api/social-accounts", async (req, res) => {
    try {
      const validatedData = insertSocialAccountSchema.parse(req.body);
      const account = await storage.createSocialAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid social account data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create social account" });
    }
  });

  app.patch("/api/social-accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.updateSocialAccount(id, req.body);
      if (!account) {
        return res.status(404).json({ message: "Social account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to update social account" });
    }
  });

  // Posts
  app.get("/api/posts", async (req, res) => {
    try {
      const adId = req.query.adId ? parseInt(req.query.adId as string) : undefined;
      const posts = adId 
        ? await storage.getPostsByAd(adId)
        : await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
