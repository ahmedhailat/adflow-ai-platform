import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, WandSparkles, Copy, Download, Share } from "lucide-react";

const generateSchema = z.object({
  product: z.string().min(1, "Product/service is required"),
  audience: z.string().min(1, "Target audience is required"),
  goal: z.string().min(1, "Campaign goal is required"),
  platform: z.string().optional(),
});

type GenerateForm = z.infer<typeof generateSchema>;

interface GeneratedAd {
  headline: string;
  primaryText: string;
  callToAction: string;
  variations?: {
    headline: string[];
    primaryText: string[];
    callToAction: string[];
  };
}

export default function AIGenerator() {
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      product: "",
      audience: "",
      goal: "Lead Generation",
      platform: "facebook",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateForm) => {
      const response = await apiRequest("POST", "/api/ai/generate-ad", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedAd(data);
      toast({
        title: "Ad Generated Successfully",
        description: "Your AI-powered ad copy is ready!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate ad copy. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async () => {
      if (!generatedAd) throw new Error("No generated ad available");
      
      const formData = form.getValues();
      const campaignResponse = await apiRequest("POST", "/api/campaigns", {
        name: `${formData.product} - ${formData.goal} Campaign`,
        product: formData.product,
        audience: formData.audience,
        goal: formData.goal,
        status: "draft",
        platforms: [formData.platform || "facebook"],
      });
      
      const campaign = await campaignResponse.json();
      
      await apiRequest("POST", "/api/ads", {
        campaignId: campaign.id,
        headline: generatedAd.headline,
        primaryText: generatedAd.primaryText,
        callToAction: generatedAd.callToAction,
        platform: formData.platform || "facebook",
        status: "draft",
      });

      return campaign;
    },
    onSuccess: () => {
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      form.reset();
      setGeneratedAd(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Campaign",
        description: error.message || "Could not create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateForm) => {
    generateMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  return (
    <>
      <TopBar 
        title="AI Ad Generator" 
        subtitle="Create high-converting ads in seconds with artificial intelligence"
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
                <CardTitle className="flex items-center gap-2">
                  <WandSparkles className="h-6 w-6" />
                  AI Ad Generator
                </CardTitle>
                <p className="text-blue-100">Fill in the details to generate your ad copy</p>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="product"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product/Service</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., SaaS Marketing Tool" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Marketing professionals, SMB owners" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Goal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select campaign goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                              <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                              <SelectItem value="Sales Conversion">Sales Conversion</SelectItem>
                              <SelectItem value="App Downloads">App Downloads</SelectItem>
                              <SelectItem value="Website Traffic">Website Traffic</SelectItem>
                              <SelectItem value="Engagement">Engagement</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="google">Google Ads</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      disabled={generateMutation.isPending}
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <WandSparkles className="mr-2 h-4 w-4" />
                          Generate AI Ad Copy
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Generated Results */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Ad Copy</CardTitle>
                <p className="text-muted-foreground">AI-generated content will appear here</p>
              </CardHeader>
              <CardContent>
                {!generatedAd ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <WandSparkles className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-center">Fill the form and click generate to see your AI-powered ad copy</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Headline</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedAd.headline)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <p className="font-semibold text-slate-900">{generatedAd.headline}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Primary Text</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedAd.primaryText)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <p className="text-slate-900">{generatedAd.primaryText}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Call to Action</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedAd.callToAction)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <Badge variant="secondary" className="bg-primary text-white">
                          {generatedAd.callToAction}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t">
                      <Button 
                        onClick={() => createCampaignMutation.mutate()}
                        disabled={createCampaignMutation.isPending}
                        className="flex-1"
                      >
                        {createCampaignMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Share className="mr-2 h-4 w-4" />
                        )}
                        Create Campaign
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => generateMutation.mutate(form.getValues())}
                        disabled={generateMutation.isPending}
                      >
                        <WandSparkles className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
