import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  WandSparkles, 
  Megaphone, 
  Share2, 
  TrendingUp, 
  Calendar, 
  Settings,
  Zap,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Sidebar() {
  const [location] = useLocation();
  const { t, isRTL } = useLanguage();

  const navigation = [
    {
      name: t("nav.dashboard"),
      href: "/",
      icon: BarChart3,
    },
    {
      name: t("nav.ai-generator"),
      href: "/ai-generator",
      icon: WandSparkles,
    },
    {
      name: t("nav.campaigns"),
      href: "/campaigns",
      icon: Megaphone,
    },
    {
      name: t("nav.social-media"),
      href: "/social-media",
      icon: Share2,
    },
    {
      name: t("nav.analytics"),
      href: "/analytics",
      icon: TrendingUp,
    },
    {
      name: t("nav.scheduler"),
      href: "/scheduler",
      icon: Calendar,
    },
    {
      name: t("nav.pricing"),
      href: "/pricing",
      icon: CreditCard,
    },
    {
      name: t("nav.settings"),
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Zap className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AdFlow AI</h1>
            <p className="text-xs text-slate-500">Marketing Automation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">John Doe</p>
            <p className="text-xs text-slate-500">Marketing Manager</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
