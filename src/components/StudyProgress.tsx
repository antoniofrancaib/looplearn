import { Progress } from "@/components/ui/progress";

interface StudyProgressProps {
  correct: number;
  total: number;
}

export const StudyProgress = ({ correct, total }: StudyProgressProps) => {
  const percentage = total === 0 ? 0 : (correct / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">Progress</span>
        <span className="text-sm font-medium">{`${correct}/${total}`}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};