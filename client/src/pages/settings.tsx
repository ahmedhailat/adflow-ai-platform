import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Key, Bell, Palette, Globe, Shield, CreditCard, HelpCircle } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company is required"),
  timezone: z.string().min(1, "Timezone is required"),
  bio: z.string().optional(),
});

const apiKeySchema = z.object({
  openaiKey: z.string().min(1, "OpenAI API key is required"),
  facebookToken: z.string().optional(),
  instagramToken: z.string().optional(),
  linkedinToken: z.string().optional(),
  twitterToken: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;
type ApiKeyForm = z.infer<typeof apiKeySchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Doe",
      email: "john@company.com",
      company: "Marketing Agency",
      timezone: "America/New_York",
      bio: "Marketing professional with 5+ years of experience in digital advertising and campaign management.",
    },
  });

  const apiKeyForm = useForm<ApiKeyForm>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      openaiKey: "",
      facebookToken: "",
      instagramToken: "",
      linkedinToken: "",
      twitterToken: "",
    },
  });

  const onProfileSubmit = (data: ProfileForm) => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const onApiKeySubmit = (data: ApiKeyForm) => {
    toast({
      title: "API Keys Updated",
      description: "Your API keys have been saved securely.",
    });
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 4) + "•".repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <>
      <TopBar 
        title="Settings" 
        subtitle="Manage your account preferences and integrations"
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <p className="text-slate-600">Update your personal and company information</p>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="timezone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timezone</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Update Profile</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys & Integrations</CardTitle>
                  <p className="text-slate-600">Manage your API keys for various services</p>
                </CardHeader>
                <CardContent>
                  <Form {...apiKeyForm}>
                    <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="space-y-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Services</h3>
                          <FormField
                            control={apiKeyForm.control}
                            name="openaiKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center space-x-2">
                                  <span>OpenAI API Key</span>
                                  <Badge variant="destructive">Required</Badge>
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password"
                                    placeholder="sk-..."
                                    {...field} 
                                  />
                                </FormControl>
                                <p className="text-sm text-slate-500">
                                  Required for AI ad generation. Get your key from{" "}
                                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    OpenAI Dashboard
                                  </a>
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-4">Social Media Platforms</h3>
                          <div className="space-y-4">
                            <FormField
                              control={apiKeyForm.control}
                              name="facebookToken"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-2">
                                    <i className="fab fa-facebook-f text-blue-600"></i>
                                    <span>Facebook Access Token</span>
                                    <Badge variant="outline">Optional</Badge>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password"
                                      placeholder="EAAG..."
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={apiKeyForm.control}
                              name="instagramToken"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-2">
                                    <i className="fab fa-instagram text-pink-600"></i>
                                    <span>Instagram Access Token</span>
                                    <Badge variant="outline">Optional</Badge>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password"
                                      placeholder="IGQ..."
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={apiKeyForm.control}
                              name="linkedinToken"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-2">
                                    <i className="fab fa-linkedin-in text-blue-500"></i>
                                    <span>LinkedIn Access Token</span>
                                    <Badge variant="outline">Optional</Badge>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password"
                                      placeholder="AQX..."
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={apiKeyForm.control}
                              name="twitterToken"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-2">
                                    <i className="fab fa-twitter text-sky-500"></i>
                                    <span>Twitter Bearer Token</span>
                                    <Badge variant="outline">Optional</Badge>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password"
                                      placeholder="AAAA..."
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <Button type="submit">Save API Keys</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <p className="text-slate-600">Choose what notifications you want to receive</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Campaign Performance</h4>
                        <p className="text-sm text-slate-600">Get notified when your campaigns reach performance milestones</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">AI Generation Complete</h4>
                        <p className="text-sm text-slate-600">Receive notifications when AI ad generation is finished</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Scheduled Posts</h4>
                        <p className="text-sm text-slate-600">Get reminders about upcoming scheduled posts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Weekly Reports</h4>
                        <p className="text-sm text-slate-600">Receive weekly performance summary emails</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Account Security</h4>
                        <p className="text-sm text-slate-600">Important security notifications and login alerts</p>
                      </div>
                      <Switch defaultChecked disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <p className="text-slate-600">Customize the look and feel of your dashboard</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Theme</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="w-full h-20 bg-white border rounded mb-3"></div>
                        <p className="text-sm font-medium text-center">Light</p>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="w-full h-20 bg-slate-900 rounded mb-3"></div>
                        <p className="text-sm font-medium text-center">Dark</p>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="w-full h-20 bg-gradient-to-br from-white to-slate-900 rounded mb-3"></div>
                        <p className="text-sm font-medium text-center">Auto</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Language & Region</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Language</label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Date Format</label>
                        <Select defaultValue="mdy">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <p className="text-slate-600">Manage your privacy settings and account security</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Data Analytics</h4>
                        <p className="text-sm text-slate-600">Allow us to collect anonymous usage data to improve the platform</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Marketing Emails</h4>
                        <p className="text-sm text-slate-600">Receive emails about new features and marketing tips</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" size="sm">Enable 2FA</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Data Management</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-2 h-4 w-4" />
                        Export My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        <Shield className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Usage</CardTitle>
                  <p className="text-slate-600">Manage your subscription and view usage statistics</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">Pro Plan</h3>
                        <p className="text-blue-100">Unlimited campaigns and AI generations</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$49</p>
                        <p className="text-blue-100">/month</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">2,450</p>
                      <p className="text-sm text-slate-600">AI Generations This Month</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">24</p>
                      <p className="text-sm text-slate-600">Active Campaigns</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">4</p>
                      <p className="text-sm text-slate-600">Connected Accounts</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Payment Method</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-8 w-8 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-slate-600">Expires 12/24</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Billing History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
