import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Plus, Edit, Trash2, Eye } from "lucide-react";
import type { Post, Ad, SocialAccount } from "@shared/schema";

const scheduleSchema = z.object({
  adId: z.number().min(1, "Ad is required"),
  socialAccountId: z.number().min(1, "Social account is required"),
  content: z.string().min(1, "Content is required"),
  scheduledAt: z.date({
    required_error: "Schedule date is required",
  }),
  scheduledTime: z.string().min(1, "Schedule time is required"),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

export default function Scheduler() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: ads } = useQuery<Ad[]>({
    queryKey: ["/api/ads"],
  });

  const { data: socialAccounts } = useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts"],
  });

  const form = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      content: "",
      scheduledTime: "09:00",
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async (data: ScheduleForm) => {
      const scheduledAt = new Date(data.scheduledAt);
      const [hours, minutes] = data.scheduledTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await apiRequest("POST", "/api/posts", {
        adId: data.adId,
        socialAccountId: data.socialAccountId,
        content: data.content,
        scheduledAt: scheduledAt.toISOString(),
        status: "scheduled",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Scheduled",
        description: "Your post has been scheduled successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsScheduleOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Schedule Post",
        description: error.message || "Could not schedule post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Post Deleted",
        description: "Scheduled post has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const onSubmit = (data: ScheduleForm) => {
    scheduleMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "published": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return "fab fa-facebook-f";
      case "instagram": return "fab fa-instagram";
      case "linkedin": return "fab fa-linkedin-in";
      case "twitter": return "fab fa-twitter";
      default: return "fas fa-share-alt";
    }
  };

  const currentWeekStart = startOfWeek(new Date());
  const currentWeekEnd = endOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getPostsForDay = (date: Date) => {
    return posts?.filter(post => {
      if (!post.scheduledAt) return false;
      const postDate = new Date(post.scheduledAt);
      return format(postDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }) || [];
  };

  return (
    <>
      <TopBar 
        title="Content Scheduler" 
        subtitle="Schedule and manage your social media posts across all platforms"
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Content Calendar</h2>
              <p className="text-slate-600">Schedule posts across all your connected social media accounts</p>
            </div>
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Post</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="adId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Ad</FormLabel>
                            <Select onValueChange={(value) => field.onChange(Number(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an ad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ads?.map((ad) => (
                                  <SelectItem key={ad.id} value={ad.id.toString()}>
                                    {ad.headline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialAccountId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Account</FormLabel>
                            <Select onValueChange={(value) => field.onChange(Number(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {socialAccounts?.filter(account => account.isConnected).map((account) => (
                                  <SelectItem key={account.id} value={account.id.toString()}>
                                    <div className="flex items-center space-x-2">
                                      <i className={`${getPlatformIcon(account.platform)} text-sm`}></i>
                                      <span>{account.platform} - {account.username}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Post Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your post content here..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="scheduledAt"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Schedule Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduledTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Schedule Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={() => setIsScheduleOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={scheduleMutation.isPending}>
                        {scheduleMutation.isPending ? "Scheduling..." : "Schedule Post"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>This Week's Schedule</span>
                <span className="text-sm font-normal text-slate-600">
                  {format(currentWeekStart, 'MMM dd')} - {format(currentWeekEnd, 'MMM dd, yyyy')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day) => {
                  const dayPosts = getPostsForDay(day);
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  
                  return (
                    <div 
                      key={day.toISOString()} 
                      className={`border rounded-lg p-3 min-h-[200px] ${
                        isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      }`}
                    >
                      <div className="text-center mb-3">
                        <p className="text-sm font-medium text-slate-600">
                          {format(day, 'EEE')}
                        </p>
                        <p className={`text-lg font-bold ${
                          isToday ? 'text-blue-600' : 'text-slate-900'
                        }`}>
                          {format(day, 'd')}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {dayPosts.map((post) => {
                          const account = socialAccounts?.find(acc => acc.id === post.socialAccountId);
                          return (
                            <div 
                              key={post.id} 
                              className="p-2 bg-white rounded border text-xs"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <Badge className={getStatusColor(post.status)}>
                                  {post.status}
                                </Badge>
                                <div className="flex space-x-1">
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => deleteMutation.mutate(post.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-slate-600 truncate">{post.content}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="flex items-center space-x-1">
                                  <i className={`${getPlatformIcon(account?.platform || '')} text-xs`}></i>
                                  <span className="text-xs text-slate-500">{account?.platform}</span>
                                </span>
                                <span className="text-xs text-slate-500">
                                  {post.scheduledAt && format(new Date(post.scheduledAt), 'HH:mm')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>All Scheduled Posts</CardTitle>
              <p className="text-slate-600">Manage all your scheduled content</p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : !posts?.length ? (
                <div className="text-center py-8 text-slate-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No scheduled posts</h3>
                  <p className="mb-4">Schedule your first post to get started</p>
                  <Button onClick={() => setIsScheduleOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts?.map((post) => {
                    const account = socialAccounts?.find(acc => acc.id === post.socialAccountId);
                    const ad = ads?.find(a => a.id === post.adId);
                    
                    return (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                            account?.platform === 'facebook' ? 'bg-blue-600' :
                            account?.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            account?.platform === 'linkedin' ? 'bg-blue-500' :
                            account?.platform === 'twitter' ? 'bg-sky-500' :
                            'bg-slate-500'
                          }`}>
                            <i className={`${getPlatformIcon(account?.platform || '')} text-sm`}></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{ad?.headline || 'Unknown Ad'}</p>
                            <p className="text-sm text-slate-500 line-clamp-2">{post.content}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(post.status)}>
                                {post.status}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {account?.platform} • {account?.username}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">
                            {post.scheduledAt && format(new Date(post.scheduledAt), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-sm text-slate-500">
                            {post.scheduledAt && format(new Date(post.scheduledAt), 'HH:mm')}
                          </p>
                          <div className="flex space-x-1 mt-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteMutation.mutate(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
