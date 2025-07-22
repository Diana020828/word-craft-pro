import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  isLastStep?: boolean;
  currentStep: number;
  totalSteps: number;
}

export const WizardCard = ({
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = 'Siguiente',
  backLabel = 'Atrás',
  nextDisabled = false,
  isLastStep = false,
  currentStep,
  totalSteps,
}: WizardCardProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="animate-fade-in shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
          {description && (
            <CardDescription className="text-base text-muted-foreground mt-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {backLabel}
            </Button>
            
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="flex items-center gap-2"
            >
              {isLastStep ? 'Generar CV' : nextLabel}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};