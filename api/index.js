// Vercel Serverless API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;

  try {
    // Health check
    if (url === '/api' || url === '/api/') {
      return res.json({ status: 'OK', message: 'AI Marketing Platform API is running' });
    }

    // Dashboard stats
    if (url === '/api/dashboard/stats' && method === 'GET') {
      const stats = {
        activeCampaigns: 1,
        totalImpressions: "245.2K",
        clickRate: "3.24%",
        adSpend: "$4,892"
      };
      return res.json(stats);
    }

    // Social accounts
    if (url === '/api/social-accounts' && method === 'GET') {
      const accounts = [
        { id: 1, platform: "facebook", username: "@yourcompany", is_connected: true },
        { id: 2, platform: "instagram", username: "@yourcompany_official", is_connected: true },
        { id: 3, platform: "linkedin", username: "Your Company", is_connected: true },
        { id: 4, platform: "twitter", username: "@yourcompany", is_connected: false }
      ];
      return res.json(accounts);
    }

    // Campaigns
    if (url === '/api/campaigns' && method === 'GET') {
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
      return res.json(campaigns);
    }

    // AI Generation
    if (url === '/api/generate-ad' && method === 'POST') {
      const { product, audience, goal, platform } = req.body;
      
      const generatedAd = {
        headline: `Transform Your ${product} Experience`,
        primaryText: `Discover our innovative ${product} designed specifically for ${audience}. Perfect for achieving ${goal} with proven results.`,
        callToAction: "Learn More"
      };
      
      return res.json(generatedAd);
    }

    // Default response
    res.status(404).json({ message: 'API endpoint not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}