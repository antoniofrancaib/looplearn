
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  pulseKey?: number | string;
}

export const StatCard = ({ icon: Icon, label, value, pulseKey }: StatCardProps) => (
  <motion.div 
    key={pulseKey}
    initial={{ scale: 1 }}
    animate={pulseKey ? { scale: [1, 1.02, 1] } : {}}
    className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50 hover:border-teal-200 transition-colors"
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-4 w-4 text-teal-500" />
      <p className="text-xs text-gray-500">{label}</p>
    </div>
    <p className="text-xl font-semibold text-teal-600">{value}</p>
  </motion.div>
);
