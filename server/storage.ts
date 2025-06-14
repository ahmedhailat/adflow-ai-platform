import { 
  campaigns, 
  ads, 
  socialAccounts, 
  posts,
  type Campaign, 
  type InsertCampaign,
  type Ad,
  type InsertAd,
  type SocialAccount,
  type InsertSocialAccount,
  type Post,
  type InsertPost
} from "@shared/schema";
import { db } from "./db";
import { eq, count } from "drizzle-orm";

export interface IStorage {
  // Campaigns
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;

  // Ads
  getAds(): Promise<Ad[]>;
  getAdsByCampaign(campaignId: number): Promise<Ad[]>;
  getAd(id: number): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, updates: Partial<Ad>): Promise<Ad | undefined>;
  deleteAd(id: number): Promise<boolean>;

  // Social Accounts
  getSocialAccounts(): Promise<SocialAccount[]>;
  getSocialAccount(id: number): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, updates: Partial<SocialAccount>): Promise<SocialAccount | undefined>;
  deleteSocialAccount(id: number): Promise<boolean>;

  // Posts
  getPosts(): Promise<Post[]>;
  getPostsByAd(adId: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;

  // Analytics
  getDashboardStats(): Promise<{
    activeCampaigns: number;
    totalImpressions: string;
    clickRate: string;
    adSpend: string;
  }>;
}

export class MemStorage implements IStorage {
  private campaigns: Map<number, Campaign>;
  private ads: Map<number, Ad>;
  private socialAccounts: Map<number, SocialAccount>;
  private posts: Map<number, Post>;
  private currentCampaignId: number;
  private currentAdId: number;
  private currentSocialAccountId: number;
  private currentPostId: number;

  constructor() {
    this.campaigns = new Map();
    this.ads = new Map();
    this.socialAccounts = new Map();
    this.posts = new Map();
    this.currentCampaignId = 1;
    this.currentAdId = 1;
    this.currentSocialAccountId = 1;
    this.currentPostId = 1;

    // Initialize with default social accounts
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add default social accounts
    const defaultAccounts: InsertSocialAccount[] = [
      { platform: "facebook", username: "@yourcompany", isConnected: true },
      { platform: "instagram", username: "@yourcompany", isConnected: true },
      { platform: "linkedin", username: "Your Company", isConnected: true },
      { platform: "twitter", username: "Not connected", isConnected: false },
    ];

    defaultAccounts.forEach(account => {
      this.createSocialAccount(account);
    });
  }

  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      status: insertCampaign.status || "draft",
      platforms: insertCampaign.platforms || [],
      budget: insertCampaign.budget || null,
      impressions: 0,
      clicks: 0,
      clickRate: "0.0",
      spend: 0,
      createdAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (campaign) {
      const updated = { ...campaign, ...updates };
      this.campaigns.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  // Ad methods
  async getAds(): Promise<Ad[]> {
    return Array.from(this.ads.values());
  }

  async getAdsByCampaign(campaignId: number): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(ad => ad.campaignId === campaignId);
  }

  async getAd(id: number): Promise<Ad | undefined> {
    return this.ads.get(id);
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const id = this.currentAdId++;
    const ad: Ad = {
      ...insertAd,
      id,
      status: insertAd.status || "draft",
      campaignId: insertAd.campaignId || null,
      performance: {},
      createdAt: new Date(),
    };
    this.ads.set(id, ad);
    return ad;
  }

  async updateAd(id: number, updates: Partial<Ad>): Promise<Ad | undefined> {
    const ad = this.ads.get(id);
    if (ad) {
      const updated = { ...ad, ...updates };
      this.ads.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteAd(id: number): Promise<boolean> {
    return this.ads.delete(id);
  }

  // Social Account methods
  async getSocialAccounts(): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values());
  }

  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    return this.socialAccounts.get(id);
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.currentSocialAccountId++;
    const account: SocialAccount = {
      ...insertAccount,
      id,
      isConnected: insertAccount.isConnected || false,
      accessToken: null,
      refreshToken: null,
      createdAt: new Date(),
    };
    this.socialAccounts.set(id, account);
    return account;
  }

  async updateSocialAccount(id: number, updates: Partial<SocialAccount>): Promise<SocialAccount | undefined> {
    const account = this.socialAccounts.get(id);
    if (account) {
      const updated = { ...account, ...updates };
      this.socialAccounts.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteSocialAccount(id: number): Promise<boolean> {
    return this.socialAccounts.delete(id);
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPostsByAd(adId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.adId === adId);
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
      ...insertPost,
      id,
      status: insertPost.status || "draft",
      adId: insertPost.adId || null,
      socialAccountId: insertPost.socialAccountId || null,
      scheduledAt: insertPost.scheduledAt || null,
      publishedAt: null,
      engagement: {},
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (post) {
      const updated = { ...post, ...updates };
      this.posts.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Analytics
  async getDashboardStats(): Promise<{
    activeCampaigns: number;
    totalImpressions: string;
    clickRate: string;
    adSpend: string;
  }> {
    const activeCampaigns = Array.from(this.campaigns.values()).filter(c => c.status === 'active').length;
    const totalImpressions = Array.from(this.campaigns.values()).reduce((sum, c) => sum + (c.impressions || 0), 0);
    const totalClicks = Array.from(this.campaigns.values()).reduce((sum, c) => sum + (c.clicks || 0), 0);
    const totalSpend = Array.from(this.campaigns.values()).reduce((sum, c) => sum + (c.spend || 0), 0);
    
    const clickRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";
    const impressionsFormatted = totalImpressions > 1000000 
      ? (totalImpressions / 1000000).toFixed(1) + "M"
      : totalImpressions > 1000 
      ? (totalImpressions / 1000).toFixed(1) + "K"
      : totalImpressions.toString();

    return {
      activeCampaigns,
      totalImpressions: impressionsFormatted,
      clickRate: clickRate + "%",
      adSpend: "$" + (totalSpend / 100).toLocaleString(),
    };
  }
}

export class DatabaseStorage implements IStorage {
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values(insertCampaign)
      .returning();
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    return campaign || undefined;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await db.delete(campaigns).where(eq(campaigns.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAds(): Promise<Ad[]> {
    return await db.select().from(ads);
  }

  async getAdsByCampaign(campaignId: number): Promise<Ad[]> {
    return await db.select().from(ads).where(eq(ads.campaignId, campaignId));
  }

  async getAd(id: number): Promise<Ad | undefined> {
    const [ad] = await db.select().from(ads).where(eq(ads.id, id));
    return ad || undefined;
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const [ad] = await db
      .insert(ads)
      .values(insertAd)
      .returning();
    return ad;
  }

  async updateAd(id: number, updates: Partial<Ad>): Promise<Ad | undefined> {
    const [ad] = await db
      .update(ads)
      .set(updates)
      .where(eq(ads.id, id))
      .returning();
    return ad || undefined;
  }

  async deleteAd(id: number): Promise<boolean> {
    const result = await db.delete(ads).where(eq(ads.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getSocialAccounts(): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts);
  }

  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    const [account] = await db.select().from(socialAccounts).where(eq(socialAccounts.id, id));
    return account || undefined;
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const [account] = await db
      .insert(socialAccounts)
      .values(insertAccount)
      .returning();
    return account;
  }

  async updateSocialAccount(id: number, updates: Partial<SocialAccount>): Promise<SocialAccount | undefined> {
    const [account] = await db
      .update(socialAccounts)
      .set(updates)
      .where(eq(socialAccounts.id, id))
      .returning();
    return account || undefined;
  }

  async deleteSocialAccount(id: number): Promise<boolean> {
    const result = await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts);
  }

  async getPostsByAd(adId: number): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.adId, adId));
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();
    return post || undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  async getDashboardStats(): Promise<{
    activeCampaigns: number;
    totalImpressions: string;
    clickRate: string;
    adSpend: string;
  }> {
    const [campaignCount] = await db
      .select({ count: count() })
      .from(campaigns)
      .where(eq(campaigns.status, 'active'));

    // For demo purposes, returning static values since we don't have real metrics yet
    return {
      activeCampaigns: campaignCount?.count || 0,
      totalImpressions: "245.2K",
      clickRate: "3.24%",
      adSpend: "$4,892",
    };
  }
}

export const storage = new DatabaseStorage();
