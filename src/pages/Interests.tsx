
import React, { useState } from 'react';
import { InterestSelector, Interest } from '@/components/InterestSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const InterestsPage = () => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const handleInterestsChange = (interests: Interest[]) => {
    setSelectedInterests(interests);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Interests
          </motion.h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border-teal-100/20 overflow-hidden">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-teal-100/50">
                  <Compass className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-2xl text-teal-800">
                  Customize Your Learning Experience
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600 text-base">
                Select the topics that interest you to personalize your feed and get recommendations
                tailored to your preferences. Your interests help us curate content that matches
                what you want to learn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div 
                className="bg-white/80 p-6 rounded-lg shadow-sm border border-teal-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-medium text-teal-700 mb-2">Select Your Interests</h3>
                <p className="text-gray-500 mb-6">
                  Click on the topics below to add them to your interests. These will be used to personalize
                  your learning experience and recommend relevant content in the Explore section.
                </p>
                <InterestSelector 
                  selectedInterests={selectedInterests}
                  onInterestsChange={handleInterestsChange}
                />
              </motion.div>
              
              {selectedInterests.length > 0 && (
                <motion.div 
                  className="text-sm text-teal-600 italic px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {selectedInterests.length} interests selected
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterestsPage;
