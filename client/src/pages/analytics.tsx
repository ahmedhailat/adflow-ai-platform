import { useQuery } from "@tanstack/react-query";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Eye, MousePointer, DollarSign, Users } from "lucide-react";

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  // Mock performance data for charts
  const weeklyPerformance = [
    { day: "Monday", performance: 75, impressions: 12500, clicks: 890 },
    { day: "Tuesday", performance: 85, impressions: 14200, clicks: 1120 },
    { day: "Wednesday", performance: 65, impressions: 10800, clicks: 756 },
    { day: "Thursday", performance: 92, impressions: 18600, clicks: 1520 },
    { day: "Friday", performance: 80, impressions: 15300, clicks: 1180 },
    { day: "Saturday", performance: 70, impressions: 11200, clicks: 840 },
    { day: "Sunday", performance: 60, impressions: 9800, clicks: 620 },
  ];

  const platformData = [
    { platform: "Facebook", impressions: 45200, clicks: 2140, ctr: 4.7, spend: 1250 },
    { platform: "Instagram", impressions: 32800, clicks: 1980, ctr: 6.0, spend: 980 },
    { platform: "LinkedIn", impressions: 18600, clicks: 892, ctr: 4.8, spend: 720 },
    { platform: "Twitter", impressions: 12400, clicks: 486, ctr: 3.9, spend: 420 },
  ];

  return (
    <>
      <TopBar 
        title="Analytics" 
        subtitle="Track your campaign performance and marketing metrics"
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Impressions</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">2.4M</p>
                    <p className="text-green-600 text-sm mt-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +8% from last week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="text-primary text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Clicks</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">125.8K</p>
                    <p className="text-green-600 text-sm mt-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12% from last week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MousePointer className="text-secondary text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Avg. CTR</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">5.2%</p>
                    <p className="text-green-600 text-sm mt-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +0.4% from last week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart className="text-accent text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Spend</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">$3,370</p>
                    <p className="text-orange-600 text-sm mt-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +18% from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-warning text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Breakdown</TabsTrigger>
              <TabsTrigger value="audience">Audience Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Weekly Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <p className="text-slate-600">Campaign performance over the last 7 days</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyPerformance.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <span className="text-sm text-slate-600 w-20">{day.day}</span>
                          <div className="flex-1 mx-4">
                            <div className="bg-slate-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-primary to-secondary rounded-full h-3 transition-all duration-300" 
                                style={{ width: `${day.performance}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">{day.performance}%</p>
                            <p className="text-xs text-slate-500">{day.impressions.toLocaleString()} imp</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Campaigns</CardTitle>
                  <p className="text-slate-600">Best performing campaigns this week</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns?.slice(0, 5).map((campaign, index) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{campaign.name}</h4>
                            <p className="text-sm text-slate-500">{campaign.product}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">
                            {(campaign.impressions || 0).toLocaleString()} impressions
                          </p>
                          <p className="text-sm text-green-600">{campaign.clickRate || "0.0"}% CTR</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance Comparison</CardTitle>
                  <p className="text-slate-600">How your campaigns perform across different platforms</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {platformData.map((platform) => (
                      <div key={platform.platform} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">{platform.platform}</h3>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-slate-600">Impressions</p>
                            <p className="text-xl font-bold text-slate-900">{platform.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Clicks</p>
                            <p className="text-xl font-bold text-slate-900">{platform.clicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">CTR</p>
                            <p className="text-xl font-bold text-slate-900">{platform.ctr}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Spend</p>
                            <p className="text-xl font-bold text-slate-900">${platform.spend}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance Details</CardTitle>
                  <p className="text-slate-600">Detailed breakdown of all your campaigns</p>
                </CardHeader>
                <CardContent>
                  {!campaigns?.length ? (
                    <div className="text-center py-8 text-slate-500">
                      <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No campaigns available for analysis</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {campaigns.map((campaign) => (
                        <div key={campaign.id} className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                              <p className="text-slate-600">{campaign.product} • {campaign.goal}</p>
                            </div>
                            <Badge className={
                              campaign.status === "active" ? "bg-green-100 text-green-800" :
                              campaign.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-slate-600">Impressions</p>
                              <p className="text-xl font-bold text-slate-900">{(campaign.impressions || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Clicks</p>
                              <p className="text-xl font-bold text-slate-900">{(campaign.clicks || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">CTR</p>
                              <p className="text-xl font-bold text-slate-900">{campaign.clickRate || "0.0"}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Spend</p>
                              <p className="text-xl font-bold text-slate-900">${((campaign.spend || 0) / 100).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Insights</CardTitle>
                  <p className="text-slate-600">Understanding your target audience performance</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Demographics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Age 25-34</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-primary rounded-full h-2 w-3/4"></div>
                            </div>
                            <span className="text-sm font-medium">42%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Age 35-44</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-primary rounded-full h-2 w-1/2"></div>
                            </div>
                            <span className="text-sm font-medium">28%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Age 45-54</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-primary rounded-full h-2 w-1/4"></div>
                            </div>
                            <span className="text-sm font-medium">18%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Other</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-primary rounded-full h-2 w-1/6"></div>
                            </div>
                            <span className="text-sm font-medium">12%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Interests</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Marketing</span>
                          <Badge variant="secondary">High engagement</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Technology</span>
                          <Badge variant="secondary">High engagement</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Business</span>
                          <Badge variant="outline">Medium engagement</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Software</span>
                          <Badge variant="outline">Medium engagement</Badge>
                        </div>
                      </div>
                    </div>
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
