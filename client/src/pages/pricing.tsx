import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Star, Zap, Crown, Building2 } from "lucide-react";
import { SiVisa, SiMastercard, SiAmericanexpress, SiPaypal, SiApplepay, SiGooglepay } from "react-icons/si";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  const createSubscriptionMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await apiRequest("POST", "/api/create-subscription", { priceId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const plans = [
    {
      id: 'free',
      name: t('pricing.free'),
      icon: Star,
      price: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      features: [
        '5 AI-generated ads per month',
        '1 campaign',
        'Basic analytics',
        'Email support',
        '1 social media account'
      ],
      buttonText: t('pricing.getStarted'),
      popular: false,
      current: true,
    },
    {
      id: 'pro',
      name: t('pricing.pro'),
      icon: Zap,
      price: 29,
      yearlyPrice: 290,
      description: 'Best for growing businesses',
      features: [
        'Unlimited AI-generated ads',
        '10 campaigns',
        'Advanced analytics',
        'Priority support',
        '5 social media accounts',
        'Content scheduling',
        'A/B testing',
        'Custom templates'
      ],
      buttonText: t('pricing.choosePlan'),
      popular: true,
      current: false,
    },
    {
      id: 'enterprise',
      name: t('pricing.enterprise'),
      icon: Crown,
      price: 99,
      yearlyPrice: 990,
      description: 'For large teams and agencies',
      features: [
        'Everything in Pro',
        'Unlimited campaigns',
        'White-label solution',
        'Dedicated account manager',
        'Unlimited social accounts',
        'API access',
        'Custom integrations',
        'Advanced reporting',
        'Team collaboration'
      ],
      buttonText: t('pricing.choosePlan'),
      popular: false,
      current: false,
    }
  ];

  const handleSubscribe = (planId: string, price: number) => {
    if (planId === 'free') {
      toast({
        title: "Free Plan",
        description: "You're already on the free plan!",
      });
      return;
    }

    // In a real app, you'd have actual Stripe price IDs
    const priceId = `price_${planId}_${isYearly ? 'yearly' : 'monthly'}`;
    createSubscriptionMutation.mutate(priceId);
  };

  return (
    <>
      <TopBar 
        title={t('pricing.title')} 
        subtitle={t('pricing.subtitle')}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4 bg-slate-100 rounded-lg p-1">
              <span className={`px-4 py-2 text-sm font-medium ${!isYearly ? 'text-primary' : 'text-slate-600'}`}>
                {t('pricing.monthly')}
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <div className="flex items-center space-x-2">
                <span className={`px-4 py-2 text-sm font-medium ${isYearly ? 'text-primary' : 'text-slate-600'}`}>
                  {t('pricing.yearly')}
                </span>
                <Badge className="bg-green-100 text-green-800 text-xs">Save 17%</Badge>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.price;
              const Icon = plan.icon;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    plan.popular ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-primary text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${
                      plan.id === 'free' ? 'bg-slate-100' :
                      plan.id === 'pro' ? 'bg-primary text-white' :
                      'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <p className="text-slate-600 text-sm">{plan.description}</p>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-slate-900">
                          ${price}
                        </span>
                        <span className="text-slate-600 ml-2">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>
                      {isYearly && plan.price > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Save ${(plan.price * 12) - plan.yearlyPrice} per year
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      className={`w-full ${
                        plan.current 
                          ? 'bg-slate-100 text-slate-600 cursor-not-allowed' 
                          : plan.popular 
                          ? 'bg-primary hover:bg-blue-600' 
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                      onClick={() => handleSubscribe(plan.id, price)}
                      disabled={plan.current || createSubscriptionMutation.isPending}
                    >
                      {plan.current ? t('pricing.currentPlan') : plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Campaign-based Pricing */}
          <div className="mt-16">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Pay Per Campaign</CardTitle>
                <p className="text-slate-600">Perfect for one-off projects or testing</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Basic Campaign</h3>
                    <div className="text-3xl font-bold text-slate-900 mb-2">$15</div>
                    <p className="text-slate-600 text-sm mb-4">per campaign</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• 10 AI-generated ads</li>
                      <li>• 1 platform</li>
                      <li>• 30-day analytics</li>
                    </ul>
                  </div>
                  
                  <div className="text-center p-6 border rounded-lg ring-2 ring-primary">
                    <h3 className="font-semibold text-lg mb-2">Advanced Campaign</h3>
                    <div className="text-3xl font-bold text-slate-900 mb-2">$35</div>
                    <p className="text-slate-600 text-sm mb-4">per campaign</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• 25 AI-generated ads</li>
                      <li>• 3 platforms</li>
                      <li>• 90-day analytics</li>
                      <li>• A/B testing</li>
                    </ul>
                  </div>
                  
                  <div className="text-center p-6 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Premium Campaign</h3>
                    <div className="text-3xl font-bold text-slate-900 mb-2">$65</div>
                    <p className="text-slate-600 text-sm mb-4">per campaign</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• Unlimited AI-generated ads</li>
                      <li>• All platforms</li>
                      <li>• Unlimited analytics</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accepted Payment Methods */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Accepted Payment Methods</h2>
            <div className="flex justify-center items-center space-x-8 mb-8">
              <SiVisa className="h-12 w-12 text-blue-600" />
              <SiMastercard className="h-12 w-12 text-red-500" />
              <SiAmericanexpress className="h-12 w-12 text-blue-500" />
              <SiPaypal className="h-12 w-12 text-blue-600" />
              <SiApplePay className="h-12 w-12 text-slate-900" />
              <SiGooglepay className="h-12 w-12 text-slate-600" />
            </div>
            <p className="text-slate-600 text-sm">
              Secure payments powered by Stripe. All transactions are encrypted and protected.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-slate-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-600 text-sm">We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers for annual plans.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Is there a free trial?</h3>
                <p className="text-slate-600 text-sm">Yes, our free plan includes 5 AI-generated ads per month with no time limit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Do you offer refunds?</h3>
                <p className="text-slate-600 text-sm">We offer a 30-day money-back guarantee for all paid plans.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}