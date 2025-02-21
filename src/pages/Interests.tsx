
import React from 'react';
import { InterestSelector } from '@/components/InterestSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InterestsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Interests</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Learning Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Select the topics that interest you. We'll use these to personalize your learning experience
            and show you relevant content in your feed.
          </p>
          <InterestSelector 
            selectedInterests={[]} 
            onInterestsChange={() => {}} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InterestsPage;
