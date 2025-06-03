import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AIGenerator from "@/pages/ai-generator";
import Campaigns from "@/pages/campaigns";
import Analytics from "@/pages/analytics";
import Scheduler from "@/pages/scheduler";
import SocialMedia from "@/pages/social-media";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/ai-generator" component={AIGenerator} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/scheduler" component={Scheduler} />
          <Route path="/social-media" component={SocialMedia} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
