import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pencil, Clock, Shield, Check, AlertCircle, Bell, ChevronRight } from 'lucide-react';

const Profile = () => {
  // Mock user data
  const user = {
    name: 'Team Claire',
    email: 'teamclaire@gmail.com',
    role: 'Premium Subscriber',
    avatarUrl: '/avatars/user-01.jpg',
    joinDate: 'September 2022',
    lastActive: '2 hours ago',
    verified: true,
    twoFactorEnabled: true
  };

  // Mock activity data
  const recentActivity = [
    { id: 1, type: 'login', description: 'Logged in from India, IN', date: '2 hours ago', icon: <Clock size={16} /> },
    { id: 2, type: 'portfolio', description: 'Added AAPL to watchlist', date: '1 day ago', icon: <Check size={16} /> },
    { id: 3, type: 'alert', description: 'Created price alert for TSLA', date: '3 days ago', icon: <Bell size={16} /> },
    { id: 4, type: 'security', description: 'Changed account password', date: '1 week ago', icon: <Shield size={16} /> },
    { id: 5, type: 'portfolio', description: 'Updated investment strategy', date: '2 weeks ago', icon: <Check size={16} /> },
  ];

  return (
    <DashboardLayout>
      <PageTitle 
        title="Profile" 
        description="View and manage your account information"
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Account Overview</CardTitle>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="mr-2">{user.role}</Badge>
                {user.verified && (
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">{user.joinDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last active</span>
                <span className="font-medium">{user.lastActive}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Two-factor auth</span>
                <span className="font-medium flex items-center">
                  {user.twoFactorEnabled ? (
                    <>
                      <Check size={16} className="text-green-500 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-amber-500 mr-1" />
                      Disabled
                    </>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Your account activity from the past 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="mr-3 mt-0.5 flex-shrink-0">
                          {activity.icon}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline">View All Activity</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">User Preferences</CardTitle>
                  <CardDescription>Customize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-12">Preference settings will be shown here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscriptions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Subscription Management</CardTitle>
                  <CardDescription>Manage your subscription plans and billing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-12">Subscription details will be shown here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Security Settings</CardTitle>
                  <CardDescription>Manage your account security options</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-12">Security settings will be shown here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile; 