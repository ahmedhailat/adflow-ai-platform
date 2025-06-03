import { Bell, Plus, Globe, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopBarProps {
  title: string;
  subtitle: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [, navigate] = useLocation();
  const { language, setLanguage, t, isRTL } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600">{subtitle}</p>
        </div>
        <div className={`flex items-center space-x-4 ${isRTL ? "space-x-reverse" : ""}`}>
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'العربية' : 'English'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className="mr-2">🇺🇸</span>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                <span className="mr-2">🇸🇦</span>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pricing Button */}
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate("/pricing")}
            className="flex items-center space-x-2"
          >
            <CreditCard className="h-4 w-4" />
            <span>{t('nav.pricing')}</span>
          </Button>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* New Campaign Button */}
          <Button 
            className="bg-primary hover:bg-blue-600 text-white"
            onClick={() => navigate("/campaigns")}
          >
            <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t('campaigns.new')}
          </Button>
        </div>
      </div>
    </header>
  );
}
