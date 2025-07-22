import { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { PersonalDataStep } from './steps/PersonalDataStep';
import { WorkExperienceStep } from './steps/WorkExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ReviewStep } from './steps/ReviewStep';
import { CVData, PersonalData, WorkExperience, Education, Skills } from '@/types/cv';
import { cvStorage } from '@/services/cvStorage';

const initialPersonalData: PersonalData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  professionalTitle: '',
  summary: '',
};

const initialSkills: Skills = {
  technical: [],
  soft: [],
};

const stepLabels = [
  'Datos Personales',
  'Experiencia Laboral',
  'Educación',
  'Habilidades',
  'Revisión Final',
];

export const CVWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [personalField, setPersonalField] = useState(0);
  const [cvData, setCvData] = useState<CVData>({
    personal: initialPersonalData,
    workExperience: [],
    education: [],
    skills: initialSkills,
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = cvStorage.load();
    if (savedData) {
      setCvData(savedData);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    cvStorage.save(cvData);
  }, [cvData]);

  const updatePersonalData = (data: PersonalData) => {
    setCvData(prev => ({ ...prev, personal: data }));
  };

  const updateWorkExperience = (data: WorkExperience[]) => {
    setCvData(prev => ({ ...prev, workExperience: data }));
  };

  const updateEducation = (data: Education[]) => {
    setCvData(prev => ({ ...prev, education: data }));
  };

  const updateSkills = (data: Skills) => {
    setCvData(prev => ({ ...prev, skills: data }));
  };

  const updateCvData = (data: CVData) => {
    setCvData(data);
  };

  const nextStep = () => {
    if (currentStep < stepLabels.length - 1) {
      setCurrentStep(currentStep + 1);
      setPersonalField(0); // Reset personal field when moving to next step
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setPersonalField(0); // Reset personal field when moving to previous step
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDataStep
            data={cvData.personal}
            onDataChange={updatePersonalData}
            onNext={nextStep}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={stepLabels.length}
            currentField={personalField}
            onFieldChange={setPersonalField}
          />
        );
      case 1:
        return (
          <WorkExperienceStep
            data={cvData.workExperience}
            onDataChange={updateWorkExperience}
            onNext={nextStep}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={stepLabels.length}
          />
        );
      case 2:
        return (
          <EducationStep
            data={cvData.education}
            onDataChange={updateEducation}
            onNext={nextStep}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={stepLabels.length}
          />
        );
      case 3:
        return (
          <SkillsStep
            data={cvData.skills}
            onDataChange={updateSkills}
            onNext={nextStep}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={stepLabels.length}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={cvData}
            onDataChange={updateCvData}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={stepLabels.length}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={stepLabels.length}
          stepLabels={stepLabels}
        />
        {renderStep()}
      </div>
    </div>
  );
};