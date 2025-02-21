
import React, { useState } from 'react';
import { InterestSelector, Interest } from '@/components/InterestSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const InterestsPage = () => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const handleInterestsChange = (interests: Interest[]) => {
    setSelectedInterests(interests);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Interests</h1>
      </div>
      
      <Card className="bg-white/50 backdrop-blur-sm border-teal-100/20">
        <CardHeader>
          <CardTitle className="text-2xl text-teal-800">Customize Your Learning Experience</CardTitle>
          <CardDescription className="text-gray-600">
            Select the topics that interest you to personalize your feed and get recommendations
            tailored to your preferences. You can update these at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white/80 p-6 rounded-lg shadow-sm border border-teal-50">
            <h3 className="text-lg font-medium text-teal-700 mb-2">Select Your Interests</h3>
            <p className="text-gray-500 mb-4">
              Click on the topics below to add them to your interests. You can select multiple topics.
            </p>
            <InterestSelector 
              selectedInterests={selectedInterests}
              onInterestsChange={handleInterestsChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterestsPage;
