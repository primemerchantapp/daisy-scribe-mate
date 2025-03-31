
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

const PatientSelection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800 font-helvetica">Patient Selection</h2>
        <button className="text-gray-700 p-1 rounded-full hover:bg-gray-100">
          <UserPlus size={24} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <p className="text-base mb-2 text-gray-700 font-helvetica">Search Patients</p>
          <Input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>
        
        <div>
          <p className="text-base mb-2 text-gray-700 font-helvetica">Select Patient</p>
          <Select>
            <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg">
              <SelectValue placeholder="Select a patient..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maria-santos">Maria Santos</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PatientSelection;
