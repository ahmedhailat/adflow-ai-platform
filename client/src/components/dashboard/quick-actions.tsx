import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, WandSparkles, BarChart, Calendar } from "lucide-react";

export default function QuickActions() {
  const [, navigate] = useLocation();

  const actions = [
    {
      title: "Create Campaign",
      description: "Start a new marketing campaign",
      icon: Plus,
      color: "bg-primary",
      action: () => navigate("/campaigns"),
    },
    {
      title: "Generate Ads",
      description: "Create ads with AI",
      icon: WandSparkles,
      color: "bg-secondary",
      action: () => navigate("/ai-generator"),
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: BarChart,
      color: "bg-accent",
      action: () => navigate("/analytics"),
    },
    {
      title: "Schedule Post",
      description: "Plan your content",
      icon: Calendar,
      color: "bg-orange-500",
      action: () => navigate("/scheduler"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="ghost"
            className="w-full justify-start h-auto p-3 hover:bg-slate-50"
            onClick={action.action}
          >
            <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
              <action.icon className="text-white h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">{action.title}</p>
              <p className="text-sm text-slate-500">{action.description}</p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
