
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Subject {
  name: string;
  count: number;
}

interface SubjectDistributionProps {
  subjects: Subject[];
  colors: string[];
}

export const SubjectDistribution = ({ subjects, colors }: SubjectDistributionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Subject Distribution</CardTitle>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={subjects}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {subjects.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
