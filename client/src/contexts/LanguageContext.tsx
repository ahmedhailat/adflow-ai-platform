import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.ai-generator': 'AI Ad Generator',
    'nav.campaigns': 'Campaigns',
    'nav.social-media': 'Social Media',
    'nav.analytics': 'Analytics',
    'nav.scheduler': 'Content Scheduler',
    'nav.settings': 'Settings',
    'nav.pricing': 'Pricing',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Welcome back! Here\'s your marketing performance overview.',
    'dashboard.activeCampaigns': 'Active Campaigns',
    'dashboard.totalImpressions': 'Total Impressions',
    'dashboard.clickRate': 'Click Rate',
    'dashboard.adSpend': 'Ad Spend',
    'dashboard.recentCampaigns': 'Recent Campaigns',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.connectedAccounts': 'Connected Accounts',
    
    // AI Generator
    'ai.title': 'AI Ad Generator',
    'ai.subtitle': 'Create high-converting ads in seconds with artificial intelligence',
    'ai.product': 'Product/Service',
    'ai.audience': 'Target Audience',
    'ai.goal': 'Campaign Goal',
    'ai.platform': 'Platform',
    'ai.generate': 'Generate AI Ad Copy',
    'ai.generating': 'Generating...',
    'ai.headline': 'Headline',
    'ai.primaryText': 'Primary Text',
    'ai.callToAction': 'Call to Action',
    'ai.createCampaign': 'Create Campaign',
    'ai.regenerate': 'Regenerate',
    
    // Campaigns
    'campaigns.title': 'Campaigns',
    'campaigns.subtitle': 'Manage your marketing campaigns across all platforms',
    'campaigns.new': 'New Campaign',
    'campaigns.name': 'Campaign Name',
    'campaigns.status': 'Status',
    'campaigns.performance': 'Performance',
    'campaigns.budget': 'Budget',
    
    // Pricing
    'pricing.title': 'Pricing Plans',
    'pricing.subtitle': 'Choose the perfect plan for your marketing needs',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly',
    'pricing.free': 'Free',
    'pricing.pro': 'Pro',
    'pricing.enterprise': 'Enterprise',
    'pricing.getStarted': 'Get Started',
    'pricing.choosePlan': 'Choose Plan',
    'pricing.currentPlan': 'Current Plan',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.ai-generator': 'مولد الإعلانات بالذكاء الاصطناعي',
    'nav.campaigns': 'الحملات',
    'nav.social-media': 'وسائل التواصل الاجتماعي',
    'nav.analytics': 'التحليلات',
    'nav.scheduler': 'جدولة المحتوى',
    'nav.settings': 'الإعدادات',
    'nav.pricing': 'الأسعار',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.subtitle': 'أهلاً بك! إليك نظرة عامة على أداء التسويق الخاص بك.',
    'dashboard.activeCampaigns': 'الحملات النشطة',
    'dashboard.totalImpressions': 'إجمالي المشاهدات',
    'dashboard.clickRate': 'معدل النقر',
    'dashboard.adSpend': 'إنفاق الإعلانات',
    'dashboard.recentCampaigns': 'الحملات الأخيرة',
    'dashboard.quickActions': 'الإجراءات السريعة',
    'dashboard.connectedAccounts': 'الحسابات المتصلة',
    
    // AI Generator
    'ai.title': 'مولد الإعلانات بالذكاء الاصطناعي',
    'ai.subtitle': 'أنشئ إعلانات عالية التحويل في ثوانٍ باستخدام الذكاء الاصطناعي',
    'ai.product': 'المنتج/الخدمة',
    'ai.audience': 'الجمهور المستهدف',
    'ai.goal': 'هدف الحملة',
    'ai.platform': 'المنصة',
    'ai.generate': 'إنشاء محتوى إعلاني بالذكاء الاصطناعي',
    'ai.generating': 'جاري الإنشاء...',
    'ai.headline': 'العنوان الرئيسي',
    'ai.primaryText': 'النص الأساسي',
    'ai.callToAction': 'دعوة للعمل',
    'ai.createCampaign': 'إنشاء حملة',
    'ai.regenerate': 'إعادة إنشاء',
    
    // Campaigns
    'campaigns.title': 'الحملات',
    'campaigns.subtitle': 'إدارة حملاتك التسويقية عبر جميع المنصات',
    'campaigns.new': 'حملة جديدة',
    'campaigns.name': 'اسم الحملة',
    'campaigns.status': 'الحالة',
    'campaigns.performance': 'الأداء',
    'campaigns.budget': 'الميزانية',
    
    // Pricing
    'pricing.title': 'خطط الأسعار',
    'pricing.subtitle': 'اختر الخطة المثالية لاحتياجاتك التسويقية',
    'pricing.monthly': 'شهرياً',
    'pricing.yearly': 'سنوياً',
    'pricing.free': 'مجاني',
    'pricing.pro': 'احترافي',
    'pricing.enterprise': 'للمؤسسات',
    'pricing.getStarted': 'ابدأ الآن',
    'pricing.choosePlan': 'اختر الخطة',
    'pricing.currentPlan': 'الخطة الحالية',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.create': 'إنشاء',
    'common.update': 'تحديث',
    'common.loading': 'جاري التحميل...',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};