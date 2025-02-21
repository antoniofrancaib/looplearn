
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Subject {
  name: string;
  count: number;
}

interface MasteryProgressProps {
  averageScore: number;
  subjects: Subject[];
  totalCards: number;
}

export const MasteryProgress = ({
  averageScore,
  subjects,
  totalCards,
}: MasteryProgressProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Mastery Progress</CardTitle>
    </CardHeader>
    <CardContent className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{averageScore}%</span>
        </div>
        <Progress 
          className="h-2 [&>div]:bg-primary" 
          style={{ transform: `translateX(-${100 - averageScore}%)` }} 
        />
      </div>
      {subjects.map((subject) => (
        <div key={subject.name} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{subject.name}</span>
            <span>{Math.round((subject.count / totalCards) * 100)}%</span>
          </div>
          <Progress 
            className="h-2 [&>div]:bg-primary" 
            style={{ transform: `translateX(-${100 - Math.round((subject.count / totalCards) * 100)}%)` }}
          />
        </div>
      ))}
    </CardContent>
  </Card>
);
