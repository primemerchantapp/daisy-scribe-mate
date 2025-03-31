
import React from 'react';
import Header from '@/components/Header';
import BottomNavbar from '@/components/BottomNavbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, LogOut, Bell, Shield, HelpCircle, 
  FileText, Clipboard, Database, Download, 
  Pencil, User, Building
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto pt-20 pb-24 px-4 overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80" alt="Dr. Sarah Wilson" />
              <AvatarFallback>SW</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
              <Pencil size={16} />
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Dr. Sarah Wilson</h1>
          <p className="text-gray-600">Pediatric Physician</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
              Verified Provider
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
              Premium
            </Badge>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings size={16} />
              <span>Settings</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User size={18} />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p>sarah.wilson@medclinic.com</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p>(555) 123-4567</p>
              </div>
              <div>
                <p className="text-gray-500">Specialty</p>
                <p>Pediatric Medicine</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="ghost" size="sm" className="text-primary">
                Edit Details
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building size={18} />
                Practice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Organization</p>
                <p>Metro Children's Hospital</p>
              </div>
              <div>
                <p className="text-gray-500">Department</p>
                <p>Pediatric Primary Care</p>
              </div>
              <div>
                <p className="text-gray-500">Provider ID</p>
                <p>MCH7890123</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="ghost" size="sm" className="text-primary">
                View Details
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText size={18} />
                Documentation Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Notes Created</span>
                    <span className="font-medium">124</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Templates Used</span>
                    <span className="font-medium">43</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Voice Sessions</span>
                    <span className="font-medium">31</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="ghost" size="sm" className="text-primary">
                View Full Stats
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold">Preferences</CardTitle>
            <CardDescription>Manage your application settings</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell size={18} />
                  <span className="text-base font-medium">Notifications</span>
                </div>
                <p className="text-sm text-gray-500">Receive alerts about new updates and features</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Shield size={18} />
                  <span className="text-base font-medium">Two-Factor Authentication</span>
                </div>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Database size={18} />
                  <span className="text-base font-medium">Data Synchronization</span>
                </div>
                <p className="text-sm text-gray-500">Automatically sync with hospital records</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clipboard size={18} />
                Template Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Default to SOAP format</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include ROS in templates</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-populate standard values</span>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2">
              <Button variant="outline" size="sm">
                Customize Templates
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <HelpCircle size={18} />
                Support & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="mr-2" size={16} />
                  Help Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2" size={16} />
                  Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2" size={16} />
                  Export Your Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default ProfilePage;
