import { useState, useEffect } from 'react';
import { WizardCard } from '../WizardCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { WorkExperience } from '@/types/cv';

interface WorkExperienceStepProps {
  data: WorkExperience[];
  onDataChange: (data: WorkExperience[]) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const WorkExperienceStep = ({
  data,
  onDataChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: WorkExperienceStepProps) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    data.length > 0 ? data : [createEmptyExperience()]
  );

  useEffect(() => {
    onDataChange(experiences);
  }, [experiences, onDataChange]);

  function createEmptyExperience(): WorkExperience {
    return {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    };
  }

  const addExperience = () => {
    setExperiences([...experiences, createEmptyExperience()]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setExperiences(experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const isValid = () => {
    return experiences.every(exp =>
      exp.company.trim() && exp.position.trim() && exp.startDate && exp.endDate && exp.description.trim()
    );
  };

  return (
    <WizardCard
      title="Experiencia Laboral"
      description="Describe tu experiencia profesional en lenguaje natural"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid()}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <Card key={experience.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5" />
                  Experiencia {index + 1}
                </CardTitle>
                {experiences.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(experience.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`company-${experience.id}`}>Empresa</Label>
                  <Input
                    id={`company-${experience.id}`}
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="Ej: Google Chile"
                  />
                </div>
                <div>
                  <Label htmlFor={`position-${experience.id}`}>Cargo</Label>
                  <Input
                    id={`position-${experience.id}`}
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                    placeholder="Ej: Desarrollador Frontend"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`startDate-${experience.id}`}>Fecha de Inicio</Label>
                  <Input
                    id={`startDate-${experience.id}`}
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`endDate-${experience.id}`}>Fecha de Fin</Label>
                  <Input
                    id={`endDate-${experience.id}`}
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${experience.id}`}>
                  Descripción (escribe en lenguaje natural)
                </Label>
                <Textarea
                  id={`description-${experience.id}`}
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  placeholder="Ej: Trabajé en el equipo de desarrollo web, hice páginas con React, colaboré con diseñadores y ayudé a mejorar el rendimiento del sitio..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  No te preocupes por el lenguaje, lo mejoraremos automáticamente
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar otra experiencia
        </Button>
      </div>
    </WizardCard>
  );
};