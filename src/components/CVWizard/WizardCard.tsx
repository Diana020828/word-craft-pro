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
      <Card className="animate-fade-in shadow-2xl border border-green-500/30 bg-black/80 backdrop-blur-xl rounded-3xl px-8 py-10 transition-all duration-300">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-green-400 drop-shadow-lg tracking-tight font-sans">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-base text-white/80 mt-2 font-medium font-sans">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {children}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 rounded-full px-6 py-2 text-base shadow-sm hover:shadow-md transition-all border-green-500/40 bg-black/60 text-white hover:bg-green-900/30 hover:text-green-400 font-sans"
            >
              <ChevronLeft className="w-4 h-4" />
              {backLabel}
            </Button>
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="flex items-center gap-2 rounded-full px-6 py-2 text-base shadow-md bg-green-500 hover:bg-green-400 text-black font-bold border-0 font-sans ring-2 ring-green-500/40 focus:ring-green-400/60"
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