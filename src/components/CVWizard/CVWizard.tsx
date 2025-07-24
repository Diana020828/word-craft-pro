import { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { PersonalDataStep } from './steps/PersonalDataStep';
import { WorkExperienceStep } from './steps/WorkExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ReviewStep } from './steps/ReviewStep';
import { CVData, PersonalData, WorkExperience, Education, Skills } from '@/types/cv';
import { cvStorage } from '@/services/cvStorage';
// import { AnimatePresence, motion } from 'framer-motion';

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
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto py-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={stepLabels.length}
            stepLabels={stepLabels}
          />
          <div className="relative w-full min-h-[420px]">
            <div className="w-full">
              {renderStep()}
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <CVPreview data={cvData} />
        </div>
      </div>
    </div>
  );
};

const CVPreview = ({ data }: { data: CVData }) => {
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Present';
    try {
      const [year, month] = dateStr.split('-');
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const monthIndex = parseInt(month) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white shadow-2xl border border-gray-200 text-black font-sans mx-auto overflow-hidden" 
         style={{ 
           fontFamily: 'Arial, Helvetica, sans-serif',
           width: '210mm',
           minHeight: '297mm',
           padding: '20mm',
           fontSize: '9pt',
           lineHeight: '1.2',
           boxSizing: 'border-box'
         }}>
      
      {/* Header - Exactly matching PDF */}
      <div className="text-center mb-8">
        <h1 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: '0 0 8px 0',
          color: '#000'
        }}>
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        
        {data.personal.professionalTitle && (
          <p style={{ 
            fontSize: '12pt', 
            fontWeight: 'normal',
            margin: '0 0 6px 0',
            color: '#000'
          }}>
            {data.personal.professionalTitle}
          </p>
        )}
        
        <p style={{ 
          fontSize: '10pt', 
          fontWeight: 'normal',
          margin: '0 0 8px 0',
          color: '#000'
        }}>
          {data.personal.email} | {data.personal.phone}
        </p>
        
        {/* Separator line exactly like PDF */}
        <div style={{
          width: '100%',
          height: '0.3mm',
          backgroundColor: '#a0a0a0',
          margin: '0 auto'
        }}></div>
      </div>

      {/* Professional Summary */}
      {data.personal.summary && (
        <div style={{ marginBottom: '10mm' }}>
          <h2 style={{ 
            fontSize: '11pt', 
            fontWeight: 'bold', 
            textTransform: 'uppercase',
            margin: '0 0 2mm 0',
            color: '#000',
            borderBottom: '0.3mm solid #787878',
            display: 'inline-block',
            paddingBottom: '1mm'
          }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ 
            fontSize: '9pt', 
            fontWeight: 'normal',
            margin: '5mm 0 0 0',
            lineHeight: '1.4',
            textAlign: 'justify',
            color: '#000'
          }}>
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {data.workExperience.length > 0 && (
        <div style={{ marginBottom: '10mm' }}>
          <h2 style={{ 
            fontSize: '11pt', 
            fontWeight: 'bold', 
            textTransform: 'uppercase',
            margin: '0 0 2mm 0',
            color: '#000',
            borderBottom: '0.3mm solid #787878',
            display: 'inline-block',
            paddingBottom: '1mm'
          }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          
          <div style={{ marginTop: '7mm' }}>
            {data.workExperience.map((exp, index) => (
              <div key={exp.id} style={{ marginBottom: index < data.workExperience.length - 1 ? '4mm' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6mm' }}>
                  <h3 style={{ 
                    fontSize: '10pt', 
                    fontWeight: 'bold',
                    margin: '0',
                    color: '#000'
                  }}>
                    {exp.position} | {exp.company}
                  </h3>
                  <span style={{ 
                    fontSize: '9pt', 
                    fontWeight: 'normal',
                    color: '#646464',
                    whiteSpace: 'nowrap',
                    marginLeft: '4mm'
                  }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                
                <div style={{ fontSize: '9pt', fontWeight: 'normal' }}>
                  {(exp.improvedDescription || exp.description).split('\n').map((line, lineIndex) => {
                    const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
                    return cleanLine ? (
                      <div key={lineIndex} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        marginBottom: '1mm',
                        lineHeight: '1.3'
                      }}>
                        <span style={{ 
                          color: '#646464', 
                          marginRight: '2mm',
                          fontSize: '9pt',
                          lineHeight: '1.3'
                        }}>•</span>
                        <span style={{ 
                          flex: '1',
                          color: '#000',
                          fontSize: '9pt',
                          lineHeight: '1.3'
                        }}>
                          {cleanLine}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: '10mm' }}>
          <h2 style={{ 
            fontSize: '11pt', 
            fontWeight: 'bold', 
            textTransform: 'uppercase',
            margin: '0 0 2mm 0',
            color: '#000',
            borderBottom: '0.3mm solid #787878',
            display: 'inline-block',
            paddingBottom: '1mm'
          }}>
            EDUCATION
          </h2>
          
          <div style={{ marginTop: '7mm' }}>
            {data.education.map((edu, index) => (
              <div key={edu.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: index < data.education.length - 1 ? '7mm' : '0'
              }}>
                <h3 style={{ 
                  fontSize: '10pt', 
                  fontWeight: 'bold',
                  margin: '0',
                  color: '#000'
                }}>
                  {edu.degree} | {edu.institution}
                </h3>
                <span style={{ 
                  fontSize: '9pt', 
                  fontWeight: 'normal',
                  color: '#646464',
                  whiteSpace: 'nowrap',
                  marginLeft: '4mm'
                }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <div>
          <h2 style={{ 
            fontSize: '11pt', 
            fontWeight: 'bold', 
            textTransform: 'uppercase',
            margin: '0 0 2mm 0',
            color: '#000',
            borderBottom: '0.3mm solid #787878',
            display: 'inline-block',
            paddingBottom: '1mm'
          }}>
            SKILLS
          </h2>
          
          <div style={{ marginTop: '7mm' }}>
            {data.skills.technical.length > 0 && (
              <div style={{ marginBottom: '3mm' }}>
                <span style={{ 
                  fontSize: '9pt', 
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                  Technical Skills: 
                </span>
                <span style={{ 
                  fontSize: '9pt', 
                  fontWeight: 'normal',
                  color: '#000'
                }}>
                  {data.skills.technical.join(', ')}
                </span>
              </div>
            )}
            
            {data.skills.soft.length > 0 && (
              <div>
                <span style={{ 
                  fontSize: '9pt', 
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                  Core Competencies: 
                </span>
                <span style={{ 
                  fontSize: '9pt', 
                  fontWeight: 'normal',
                  color: '#000'
                }}>
                  {data.skills.soft.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {data.workExperience.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '8mm 0',
          color: '#999',
          fontSize: '9pt'
        }}>
          <p>Agrega tu experiencia laboral para ver la vista previa...</p>
        </div>
      )}
    </div>
  );
};