import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Eye, MousePointer, DollarSign, Megaphone } from "lucide-react";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Active Campaigns",
      value: stats?.activeCampaigns || 0,
      change: "+12% from last month",
      icon: Megaphone,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      trending: true,
    },
    {
      title: "Total Impressions",
      value: stats?.totalImpressions || "0",
      change: "+8% from last week",
      icon: Eye,
      iconBg: "bg-purple-100",
      iconColor: "text-secondary",
      trending: true,
    },
    {
      title: "Click Rate",
      value: stats?.clickRate || "0.0%",
      change: "+0.3% from last week",
      icon: MousePointer,
      iconBg: "bg-green-100",
      iconColor: "text-accent",
      trending: true,
    },
    {
      title: "Ad Spend",
      value: stats?.adSpend || "$0",
      change: "+15% from last month",
      icon: DollarSign,
      iconBg: "bg-orange-100",
      iconColor: "text-warning",
      trending: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 flex items-center ${
                  stat.trending ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.iconColor} h-6 w-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
