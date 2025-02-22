
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DeepDive as DeepDiveComponent } from "@/components/dashboard/DeepDive";
import { Interest } from '@/types/interests';
import { AnimatePresence, motion } from 'framer-motion';

const DeepDivePage = () => {
  const [userInterests, setUserInterests] = useState<Interest[]>([]);

  useEffect(() => {
    const loadUserInterests = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userInterestsData } = await supabase
        .from('user_interests')
        .select('interest')
        .eq('user_id', user.id);

      if (userInterestsData) {
        setUserInterests(userInterestsData.map(row => row.interest as Interest));
      }
    };

    loadUserInterests();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto py-8"
      >
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Deep Dive
        </h1>
        <DeepDiveComponent userInterests={userInterests} />
      </motion.div>
    </AnimatePresence>
  );
};

export default DeepDivePage;
