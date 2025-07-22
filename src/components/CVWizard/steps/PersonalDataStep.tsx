import { useState, useEffect } from 'react';
import { WizardCard } from '../WizardCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PersonalData } from '@/types/cv';

interface PersonalDataStepProps {
  data: PersonalData;
  onDataChange: (data: PersonalData) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  currentField: number;
  onFieldChange: (field: number) => void;
}

const fields = [
  { key: 'firstName', label: 'Nombre', placeholder: 'Ej: María' },
  { key: 'lastName', label: 'Apellido', placeholder: 'Ej: González' },
  { key: 'email', label: 'Email', placeholder: 'maria.gonzalez@email.com' },
  { key: 'phone', label: 'Teléfono', placeholder: '+56 9 1234 5678' },
  { key: 'professionalTitle', label: 'Título Profesional', placeholder: 'Ej: Desarrolladora Full Stack' },
  { key: 'summary', label: 'Resumen Personal', placeholder: 'Cuéntanos sobre ti, tus fortalezas y lo que te apasiona en tu área profesional...', isTextarea: true },
];

export const PersonalDataStep = ({
  data,
  onDataChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  currentField,
  onFieldChange,
}: PersonalDataStepProps) => {
  const [currentData, setCurrentData] = useState(data);
  const currentFieldConfig = fields[currentField];

  useEffect(() => {
    onDataChange(currentData);
  }, [currentData, onDataChange]);

  const handleNext = () => {
    if (currentField < fields.length - 1) {
      onFieldChange(currentField + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentField > 0) {
      onFieldChange(currentField - 1);
    } else {
      onBack();
    }
  };

  const handleInputChange = (value: string) => {
    setCurrentData({
      ...currentData,
      [currentFieldConfig.key]: value,
    });
  };

  const isFieldValid = () => {
    const value = currentData[currentFieldConfig.key as keyof PersonalData];
    return value && value.trim().length > 0;
  };

  return (
    <WizardCard
      title={currentFieldConfig.label}
      description={`Paso ${currentField + 1} de ${fields.length} - Datos Personales`}
      onNext={handleNext}
      onBack={handleBack}
      nextLabel={currentField === fields.length - 1 ? 'Continuar' : 'Siguiente'}
      nextDisabled={!isFieldValid()}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="space-y-4">
        <Label htmlFor={currentFieldConfig.key} className="text-lg font-medium">
          {currentFieldConfig.label}
        </Label>
        
        {currentFieldConfig.isTextarea ? (
          <Textarea
            id={currentFieldConfig.key}
            value={currentData[currentFieldConfig.key as keyof PersonalData]}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentFieldConfig.placeholder}
            className="min-h-[120px] text-base"
            autoFocus
          />
        ) : (
          <Input
            id={currentFieldConfig.key}
            type={currentFieldConfig.key === 'email' ? 'email' : 'text'}
            value={currentData[currentFieldConfig.key as keyof PersonalData]}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentFieldConfig.placeholder}
            className="text-base"
            autoFocus
          />
        )}
        
        <div className="flex justify-center space-x-2 mt-6">
          {fields.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentField ? 'bg-primary' : 
                index < currentField ? 'bg-primary/60' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </WizardCard>
  );
};