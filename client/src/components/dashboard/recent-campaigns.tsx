import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, BarChart } from "lucide-react";
import type { Campaign } from "@shared/schema";

export default function RecentCampaigns() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentCampaigns = campaigns?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Campaigns</CardTitle>
          <Link href="/campaigns">
            <a className="text-primary hover:text-blue-600 text-sm font-medium">View All</a>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recentCampaigns.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
            <p className="text-center mb-4">Create your first campaign to get started</p>
            <Link href="/ai-generator">
              <a className="text-primary hover:text-blue-600 font-medium">
                Generate your first ad →
              </a>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCampaigns.map((campaign, index) => {
              const colors = [
                "bg-primary",
                "bg-secondary", 
                "bg-accent",
                "bg-orange-500",
                "bg-pink-500"
              ];
              
              return (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${colors[index % colors.length]} rounded-lg flex items-center justify-center`}>
                      <Megaphone className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{campaign.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-slate-500">{campaign.product}</p>
                        <Badge 
                          variant="outline" 
                          className={
                            campaign.status === "active" ? "border-green-200 text-green-700" :
                            campaign.status === "paused" ? "border-yellow-200 text-yellow-700" :
                            "border-gray-200 text-gray-700"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {(campaign.impressions || 0).toLocaleString()} impressions
                    </p>
                    <p className="text-sm text-green-600">{campaign.clickRate || "0.0%"} CTR</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
