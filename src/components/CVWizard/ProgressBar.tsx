import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressBar = ({ currentStep, totalSteps, stepLabels }: ProgressBarProps) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Paso {currentStep + 1} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {stepLabels[currentStep]}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};