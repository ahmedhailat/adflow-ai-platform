import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Settings, BarChart3, Users, Eye, MessageCircle, Heart, Share } from "lucide-react";
import type { SocialAccount, Post } from "@shared/schema";

export default function SocialMedia() {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts } = useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts"],
  });

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const connectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/social-accounts/${id}`, {
        isConnected: true,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Connected",
        description: "Social media account connected successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return "fab fa-facebook-f";
      case "instagram": return "fab fa-instagram";
      case "linkedin": return "fab fa-linkedin-in";
      case "twitter": return "fab fa-twitter";
      default: return "fas fa-share-alt";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "facebook": return "platform-facebook";
      case "instagram": return "platform-instagram";
      case "linkedin": return "platform-linkedin";
      case "twitter": return "platform-twitter";
      default: return "bg-slate-500";
    }
  };

  const connectedAccounts = accounts?.filter(acc => acc.isConnected) || [];
  const disconnectedAccounts = accounts?.filter(acc => !acc.isConnected) || [];

  const recentPosts = posts?.slice(0, 6) || [];

  const platformMetrics = [
    {
      platform: "Facebook",
      followers: "12.5K",
      engagement: "4.2%",
      reach: "45.2K",
      posts: posts?.filter(p => {
        const account = accounts?.find(a => a.id === p.socialAccountId);
        return account?.platform === "facebook";
      }).length || 0,
    },
    {
      platform: "Instagram", 
      followers: "8.7K",
      engagement: "6.1%",
      reach: "32.8K",
      posts: posts?.filter(p => {
        const account = accounts?.find(a => a.id === p.socialAccountId);
        return account?.platform === "instagram";
      }).length || 0,
    },
    {
      platform: "LinkedIn",
      followers: "3.2K", 
      engagement: "2.8%",
      reach: "18.6K",
      posts: posts?.filter(p => {
        const account = accounts?.find(a => a.id === p.socialAccountId);
        return account?.platform === "linkedin";
      }).length || 0,
    },
    {
      platform: "Twitter",
      followers: "5.1K",
      engagement: "3.4%", 
      reach: "12.4K",
      posts: posts?.filter(p => {
        const account = accounts?.find(a => a.id === p.socialAccountId);
        return account?.platform === "twitter";
      }).length || 0,
    },
  ];

  return (
    <>
      <TopBar 
        title="Social Media" 
        subtitle="Manage your social media accounts and track performance"
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect Social Media Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <select 
                        id="platform"
                        className="w-full mt-1 p-2 border rounded-lg"
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                      >
                        <option value="">Select platform</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="username">Username/Handle</Label>
                      <Input id="username" placeholder="@username" />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddAccountOpen(false)}>
                        Connect Account
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="overview" className="space-y-6">
              {/* Platform Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platformMetrics.map((metric) => (
                  <Card key={metric.platform}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">{metric.platform}</h3>
                        <div className={`w-8 h-8 ${getPlatformColor(metric.platform.toLowerCase())} rounded-lg flex items-center justify-center`}>
                          <i className={`${getPlatformIcon(metric.platform.toLowerCase())} text-white text-sm`}></i>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Followers</span>
                          <span className="font-medium">{metric.followers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Engagement</span>
                          <span className="font-medium text-green-600">{metric.engagement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Reach</span>
                          <span className="font-medium">{metric.reach}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Posts</span>
                          <span className="font-medium">{metric.posts}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentPosts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                      <p className="mb-4">Schedule your first post to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentPosts.map((post) => {
                        const account = accounts?.find(acc => acc.id === post.socialAccountId);
                        return (
                          <div key={post.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className={`w-6 h-6 ${getPlatformColor(account?.platform || '')} rounded flex items-center justify-center`}>
                                  <i className={`${getPlatformIcon(account?.platform || '')} text-white text-xs`}></i>
                                </div>
                                <span className="text-sm font-medium">{account?.platform}</span>
                              </div>
                              <Badge className={
                                post.status === "published" ? "bg-green-100 text-green-800" :
                                post.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                                "bg-gray-100 text-gray-800"
                              }>
                                {post.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700 line-clamp-3 mb-3">{post.content}</p>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>
                                {post.publishedAt 
                                  ? new Date(post.publishedAt).toLocaleDateString()
                                  : post.scheduledAt 
                                  ? `Scheduled: ${new Date(post.scheduledAt).toLocaleDateString()}`
                                  : "Draft"
                                }
                              </span>
                              <div className="flex space-x-3">
                                <span className="flex items-center"><Eye className="h-3 w-3 mr-1" />234</span>
                                <span className="flex items-center"><Heart className="h-3 w-3 mr-1" />12</span>
                                <span className="flex items-center"><Share className="h-3 w-3 mr-1" />5</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6">
              {/* Connected Accounts */}
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <p className="text-slate-600">Manage your connected social media accounts</p>
                </CardHeader>
                <CardContent>
                  {connectedAccounts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No accounts connected</h3>
                      <p className="mb-4">Connect your social media accounts to get started</p>
                      <Button onClick={() => setIsAddAccountOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {connectedAccounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${getPlatformColor(account.platform)} rounded-lg flex items-center justify-center`}>
                              <i className={`${getPlatformIcon(account.platform)} text-white`}></i>
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900 capitalize">{account.platform}</h3>
                              <p className="text-slate-600">{account.username}</p>
                              <p className="text-sm text-green-600">Connected</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Platforms */}
              {disconnectedAccounts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Platforms</CardTitle>
                    <p className="text-slate-600">Connect additional social media accounts</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {disconnectedAccounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${getPlatformColor(account.platform)} rounded-lg flex items-center justify-center`}>
                              <i className={`${getPlatformIcon(account.platform)} text-white`}></i>
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900 capitalize">{account.platform}</h3>
                              <p className="text-slate-600">{account.username}</p>
                              <p className="text-sm text-slate-500">Not connected</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => connectMutation.mutate(account.id)}
                            disabled={connectMutation.isPending}
                          >
                            Connect
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Posts</CardTitle>
                  <p className="text-slate-600">View and manage all your social media posts</p>
                </CardHeader>
                <CardContent>
                  {posts?.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                      <p className="mb-4">Create your first post to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts?.map((post) => {
                        const account = accounts?.find(acc => acc.id === post.socialAccountId);
                        return (
                          <div key={post.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className={`w-8 h-8 ${getPlatformColor(account?.platform || '')} rounded-lg flex items-center justify-center`}>
                                    <i className={`${getPlatformIcon(account?.platform || '')} text-white text-sm`}></i>
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900 capitalize">{account?.platform}</p>
                                    <p className="text-sm text-slate-500">{account?.username}</p>
                                  </div>
                                  <Badge className={
                                    post.status === "published" ? "bg-green-100 text-green-800" :
                                    post.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                                    "bg-gray-100 text-gray-800"
                                  }>
                                    {post.status}
                                  </Badge>
                                </div>
                                <p className="text-slate-700 mb-3">{post.content}</p>
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <span>
                                    {post.publishedAt 
                                      ? `Published: ${new Date(post.publishedAt).toLocaleDateString()}`
                                      : post.scheduledAt 
                                      ? `Scheduled: ${new Date(post.scheduledAt).toLocaleDateString()}`
                                      : "Draft"
                                    }
                                  </span>
                                  {post.status === "published" && (
                                    <div className="flex space-x-4">
                                      <span className="flex items-center"><Eye className="h-4 w-4 mr-1" />234 views</span>
                                      <span className="flex items-center"><Heart className="h-4 w-4 mr-1" />12 likes</span>
                                      <span className="flex items-center"><MessageCircle className="h-4 w-4 mr-1" />3 comments</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Total Followers</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">29.5K</p>
                        <p className="text-green-600 text-sm mt-2">+5.2% this month</p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Engagement Rate</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">4.8%</p>
                        <p className="text-green-600 text-sm mt-2">+0.3% this week</p>
                      </div>
                      <Heart className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Total Reach</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">109K</p>
                        <p className="text-green-600 text-sm mt-2">+8.1% this week</p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Posts This Month</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{posts?.length || 0}</p>
                        <p className="text-slate-600 text-sm mt-2">Across all platforms</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <p className="text-slate-600">Compare performance across all your platforms</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {platformMetrics.map((platform) => (
                      <div key={platform.platform} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${getPlatformColor(platform.platform.toLowerCase())} rounded-lg flex items-center justify-center`}>
                              <i className={`${getPlatformIcon(platform.platform.toLowerCase())} text-white`}></i>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">{platform.platform}</h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-slate-600">Followers</p>
                            <p className="text-xl font-bold text-slate-900">{platform.followers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Engagement</p>
                            <p className="text-xl font-bold text-slate-900">{platform.engagement}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Reach</p>
                            <p className="text-xl font-bold text-slate-900">{platform.reach}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Posts</p>
                            <p className="text-xl font-bold text-slate-900">{platform.posts}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
