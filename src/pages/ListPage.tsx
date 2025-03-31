
import React from 'react';
import Header from '@/components/Header';
import BottomNavbar from '@/components/BottomNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for scribe history
const scribes = [
  {
    id: '1',
    patientName: 'Maria Santos',
    encounterDate: '2025-03-27',
    encounterType: 'Annual Physical',
    documentType: 'SOAP Note',
    createdAt: '2025-03-27T08:45:00Z'
  },
  {
    id: '2',
    patientName: 'John Miller',
    encounterDate: '2025-03-26',
    encounterType: 'Follow-up',
    documentType: 'Progress Note',
    createdAt: '2025-03-26T14:30:00Z'
  },
  {
    id: '3',
    patientName: 'Emily Johnson',
    encounterDate: '2025-03-25',
    encounterType: 'New Patient',
    documentType: 'H&P Note',
    createdAt: '2025-03-25T10:15:00Z'
  },
  {
    id: '4',
    patientName: 'Robert Chen',
    encounterDate: '2025-03-24',
    encounterType: 'Urgent Care',
    documentType: 'Urgent Care Note',
    createdAt: '2025-03-24T16:20:00Z'
  }
];

const ListPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto pt-20 pb-24 px-4 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Documentation History</h1>
          <p className="text-gray-600">View and access your previous medical documentations</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Search patient or document type..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar size={18} />
            <span>Filter by Date</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {scribes.map((scribe) => (
            <Card key={scribe.id} className="shadow-sm hover:shadow transition-shadow">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{scribe.patientName}</CardTitle>
                  <span className="text-sm text-gray-500">{new Date(scribe.encounterDate).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{scribe.encounterType}</p>
                    <p className="text-sm text-gray-600">{scribe.documentType}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <FileText size={18} className="mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default ListPage;
