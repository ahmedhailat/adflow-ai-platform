import TopBar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import AIGeneratorCard from "@/components/dashboard/ai-generator-card";
import RecentCampaigns from "@/components/dashboard/recent-campaigns";
import QuickActions from "@/components/dashboard/quick-actions";
import SocialAccounts from "@/components/dashboard/social-accounts";
import PerformanceChart from "@/components/dashboard/performance-chart";

export default function Dashboard() {
  return (
    <>
      <TopBar 
        title="Dashboard" 
        subtitle="Welcome back! Here's your marketing performance overview."
      />
      <main className="flex-1 overflow-y-auto p-6">
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <AIGeneratorCard />
            <RecentCampaigns />
          </div>

          <div className="space-y-8">
            <QuickActions />
            <SocialAccounts />
            <PerformanceChart />
          </div>
        </div>
      </main>
    </>
  );
}
