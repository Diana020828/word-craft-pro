import { useState, useEffect } from 'react';
import { WizardCard } from '../WizardCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Education } from '@/types/cv';

interface EducationStepProps {
  data: Education[];
  onDataChange: (data: Education[]) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const EducationStep = ({
  data,
  onDataChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: EducationStepProps) => {
  const [education, setEducation] = useState<Education[]>(
    data.length > 0 ? data : [createEmptyEducation()]
  );

  useEffect(() => {
    onDataChange(education);
  }, [education, onDataChange]);

  function createEmptyEducation(): Education {
    return {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
    };
  }

  const addEducation = () => {
    setEducation([...education, createEmptyEducation()]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setEducation(education.map(edu => {
      if (edu.id === id) {
        const updated = { ...edu, [field]: value };
        // Si se marca como actual, limpiar la fecha de fin
        if (field === 'isCurrent' && value === true) {
          updated.endDate = '';
        }
        return updated;
      }
      return edu;
    }));
  };

  const isValid = () => {
    return education.every(edu =>
      edu.institution.trim() && 
      edu.degree.trim() && 
      edu.startDate && 
      (edu.isCurrent || edu.endDate)
    );
  };

  return (
    <WizardCard
      title="Educación"
      description="Agrega tu formación académica y certificaciones"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid()}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="space-y-6">
        {education.map((edu, index) => (
          <Card key={edu.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="w-5 h-5" />
                  Educación {index + 1}
                </CardTitle>
                {education.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`institution-${edu.id}`}>Institución</Label>
                <Input
                  id={`institution-${edu.id}`}
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="Ej: Universidad de Chile"
                />
              </div>

              <div>
                <Label htmlFor={`degree-${edu.id}`}>Título o Certificación</Label>
                <Input
                  id={`degree-${edu.id}`}
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Ej: Ingeniería en Informática"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`startDate-${edu.id}`}>Fecha de Inicio</Label>
                  <Input
                    id={`startDate-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`endDate-${edu.id}`}>Fecha de Fin</Label>
                  <Input
                    id={`endDate-${edu.id}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    disabled={edu.isCurrent}
                    placeholder={edu.isCurrent ? "Presente" : ""}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${edu.id}`}
                  checked={edu.isCurrent}
                  onCheckedChange={(checked) => updateEducation(edu.id, 'isCurrent', checked === true)}
                />
                <Label htmlFor={`current-${edu.id}`} className="text-sm font-normal">
                  Actualmente estudio aquí
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar otra educación
        </Button>
      </div>
    </WizardCard>
  );
};