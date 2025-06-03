import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { SocialAccount } from "@shared/schema";

export default function SocialAccounts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts"],
  });

  const connectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/social-accounts/${id}`, {
        isConnected: true,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Connected",
        description: "Social media account connected successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return "fab fa-facebook-f";
      case "instagram": return "fab fa-instagram";
      case "linkedin": return "fab fa-linkedin-in";
      case "twitter": return "fab fa-twitter";
      default: return "fas fa-share-alt";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "facebook": return "bg-blue-600";
      case "instagram": return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "linkedin": return "bg-blue-500";
      case "twitter": return "bg-slate-900";
      default: return "bg-slate-500";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-5 bg-slate-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts?.map((account) => (
          <div key={account.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${getPlatformColor(account.platform)} rounded-lg flex items-center justify-center`}>
                <i className={`${getPlatformIcon(account.platform)} text-white text-sm`}></i>
              </div>
              <div>
                <p className="font-medium text-slate-900 capitalize">{account.platform}</p>
                <p className="text-sm text-slate-500">{account.username}</p>
              </div>
            </div>
            {account.isConnected ? (
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            ) : (
              <Button
                size="sm"
                className="bg-primary hover:bg-blue-600 text-xs"
                onClick={() => connectMutation.mutate(account.id)}
                disabled={connectMutation.isPending}
              >
                Connect
              </Button>
            )}
          </div>
        ))}

        <Button variant="ghost" className="w-full mt-4 text-primary hover:text-blue-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </CardContent>
    </Card>
  );
}
