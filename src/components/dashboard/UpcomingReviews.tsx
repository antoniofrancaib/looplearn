
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, addDays } from 'date-fns';

export const UpcomingReviews = () => {
  const upcomingReviews = Array.from({ length: 5 }).map((_, index) => ({
    date: format(addDays(new Date(), index), 'MMM dd'),
    cards: Math.floor(Math.random() * 20) + 5,
  }));

  return (
    <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Upcoming Reviews</h3>
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={upcomingReviews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              stroke="#374151"
              fontSize={10}
              tickSize={5}
            />
            <YAxis 
              stroke="#374151"
              fontSize={10}
              tickSize={5}
            />
            <Tooltip />
            <Bar 
              dataKey="cards" 
              fill="#14b8a6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
