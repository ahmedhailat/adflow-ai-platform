import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WandSparkles, Loader2, Sparkles } from "lucide-react";

const generateSchema = z.object({
  product: z.string().min(1, "Product/service is required"),
  audience: z.string().min(1, "Target audience is required"),
  goal: z.string().min(1, "Campaign goal is required"),
});

type GenerateForm = z.infer<typeof generateSchema>;

interface GeneratedAd {
  headline: string;
  primaryText: string;
  callToAction: string;
}

export default function AIGeneratorCard() {
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      product: "",
      audience: "",
      goal: "Lead Generation",
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
        description: error.message || "Failed to generate ad copy. Please check your OpenAI API key.",
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
        platforms: ["facebook"],
      });
      
      const campaign = await campaignResponse.json();
      
      await apiRequest("POST", "/api/ads", {
        campaignId: campaign.id,
        headline: generatedAd.headline,
        primaryText: generatedAd.primaryText,
        callToAction: generatedAd.callToAction,
        platform: "facebook",
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
  });

  const onSubmit = (data: GenerateForm) => {
    generateMutation.mutate(data);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">AI Ad Generator</CardTitle>
            <p className="text-blue-100 mt-1">Create high-converting ads in seconds</p>
          </div>
          <WandSparkles className="h-8 w-8 text-blue-200" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
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

        {/* Generated Ad Preview */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          {!generatedAd ? (
            <div className="text-center text-slate-500">
              <Sparkles className="h-8 w-8 mx-auto mb-2" />
              <p>Generated ad copy will appear here</p>
              <p className="text-sm">Fill the form above and click generate</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Headline</h4>
                <p className="text-slate-900 font-semibold">{generatedAd.headline}</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Primary Text</h4>
                <p className="text-slate-900 text-sm">{generatedAd.primaryText}</p>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button 
                  onClick={() => createCampaignMutation.mutate()}
                  disabled={createCampaignMutation.isPending}
                  size="sm"
                  className="bg-primary hover:bg-blue-600"
                >
                  {createCampaignMutation.isPending ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <WandSparkles className="mr-1 h-3 w-3" />
                  )}
                  Create Campaign
                </Button>
                <Button 
                  onClick={() => generateMutation.mutate(form.getValues())}
                  disabled={generateMutation.isPending}
                  size="sm"
                  variant="outline"
                >
                  <WandSparkles className="mr-1 h-3 w-3" />
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
