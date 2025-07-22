import { useState, useEffect } from 'react';
import { WizardCard } from '../WizardCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Skills } from '@/types/cv';

interface SkillsStepProps {
  data: Skills;
  onDataChange: (data: Skills) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const SkillsStep = ({
  data,
  onDataChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: SkillsStepProps) => {
  const [skills, setSkills] = useState<Skills>(data);
  const [technicalInput, setTechnicalInput] = useState('');
  const [softInput, setSoftInput] = useState('');

  useEffect(() => {
    onDataChange(skills);
  }, [skills, onDataChange]);

  const addTechnicalSkill = () => {
    if (technicalInput.trim() && !skills.technical.includes(technicalInput.trim())) {
      setSkills({
        ...skills,
        technical: [...skills.technical, technicalInput.trim()],
      });
      setTechnicalInput('');
    }
  };

  const addSoftSkill = () => {
    if (softInput.trim() && !skills.soft.includes(softInput.trim())) {
      setSkills({
        ...skills,
        soft: [...skills.soft, softInput.trim()],
      });
      setSoftInput('');
    }
  };

  const removeTechnicalSkill = (skill: string) => {
    setSkills({
      ...skills,
      technical: skills.technical.filter(s => s !== skill),
    });
  };

  const removeSoftSkill = (skill: string) => {
    setSkills({
      ...skills,
      soft: skills.soft.filter(s => s !== skill),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'technical' | 'soft') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'technical') {
        addTechnicalSkill();
      } else {
        addSoftSkill();
      }
    }
  };

  const isValid = () => {
    return skills.technical.length > 0 && skills.soft.length > 0;
  };

  return (
    <WizardCard
      title="Habilidades"
      description="Agrega tus habilidades técnicas y blandas"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid()}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="space-y-8">
        {/* Technical Skills */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Habilidades Técnicas</Label>
          <div className="flex gap-2">
            <Input
              value={technicalInput}
              onChange={(e) => setTechnicalInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'technical')}
              placeholder="Ej: React, Python, SQL..."
              className="flex-1"
            />
            <Button type="button" onClick={addTechnicalSkill} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-muted/30">
            {skills.technical.length === 0 ? (
              <span className="text-muted-foreground text-sm">
                Agrega al menos una habilidad técnica
              </span>
            ) : (
              skills.technical.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeTechnicalSkill(skill)}
                  />
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Habilidades Blandas</Label>
          <div className="flex gap-2">
            <Input
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'soft')}
              placeholder="Ej: Trabajo en equipo, Liderazgo..."
              className="flex-1"
            />
            <Button type="button" onClick={addSoftSkill} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-muted/30">
            {skills.soft.length === 0 ? (
              <span className="text-muted-foreground text-sm">
                Agrega al menos una habilidad blanda
              </span>
            ) : (
              skills.soft.map((skill) => (
                <Badge key={skill} variant="outline" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeSoftSkill(skill)}
                  />
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Presiona Enter o el botón + para agregar cada habilidad</p>
        </div>
      </div>
    </WizardCard>
  );
};