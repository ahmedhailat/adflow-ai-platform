import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// Create Express app
const app = express();

app.use(cors());
app.use(express.json());

// Basic API routes for Netlify
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Marketing Platform API is running' });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // For demo purposes - in production, query real data
    const stats = {
      activeCampaigns: 1,
      totalImpressions: "245.2K",
      clickRate: "3.24%",
      adSpend: "$4,892"
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

// Social accounts endpoint
app.get('/api/social-accounts', async (req, res) => {
  try {
    const accounts = [
      { id: 1, platform: "facebook", username: "@yourcompany", is_connected: true },
      { id: 2, platform: "instagram", username: "@yourcompany_official", is_connected: true },
      { id: 3, platform: "linkedin", username: "Your Company", is_connected: true },
      { id: 4, platform: "twitter", username: "@yourcompany", is_connected: false }
    ];
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch social accounts" });
  }
});

// Campaigns endpoint
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = [
      {
        id: 1,
        name: "Summer Product Launch",
        product: "Fitness Equipment",
        audience: "Young professionals aged 25-35",
        goal: "Brand Awareness",
        status: "active",
        platforms: ["facebook", "instagram"],
        budget: 5000,
        impressions: 12500,
        clicks: 405,
        click_rate: "3.24%",
        spend: 1250
      }
    ];
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
});

// AI Generation endpoint
app.post('/api/generate-ad', async (req, res) => {
  try {
    const { product, audience, goal, platform } = req.body;
    
    // Mock AI response for demo
    const generatedAd = {
      headline: `Transform Your ${product} Experience`,
      primaryText: `Discover our innovative ${product} designed specifically for ${audience}. Perfect for achieving ${goal} with proven results.`,
      callToAction: "Learn More"
    };
    
    res.json(generatedAd);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate ad copy" });
  }
});

// Export handler for Netlify
export const handler = serverless(app);