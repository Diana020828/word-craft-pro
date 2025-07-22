import { useState, useEffect } from 'react';
import { WizardCard } from '../WizardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Briefcase, GraduationCap, Brain, Download, Wand2 } from 'lucide-react';
import { CVData } from '@/types/cv';
import { openaiService } from '@/services/openaiService';
import { DocumentGenerator } from '@/services/documentGenerator';
import { useToast } from '@/hooks/use-toast';

interface ReviewStepProps {
  data: CVData;
  onDataChange: (data: CVData) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const ReviewStep = ({
  data,
  onDataChange,
  onBack,
  currentStep,
  totalSteps,
}: ReviewStepProps) => {
  const [isImproving, setIsImproving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasImproved, setHasImproved] = useState(false);
  const { toast } = useToast();

  const improveTexts = async () => {
    setIsImproving(true);
    try {
      // Improve summary
      const improvedSummary = await openaiService.improveSummary(
        data.personal.summary,
        data.personal.professionalTitle
      );

      // Improve work experience descriptions
      const improvedExperiences = await Promise.all(
        data.workExperience.map(async (exp) => {
          const improvedDescription = await openaiService.improveDescription(
            exp.description,
            exp.position,
            exp.company
          );
          return {
            ...exp,
            improvedDescription,
          };
        })
      );

      const improvedData = {
        ...data,
        personal: {
          ...data.personal,
          summary: improvedSummary,
        },
        workExperience: improvedExperiences,
      };

      onDataChange(improvedData);
      setHasImproved(true);
      
      toast({
        title: 'Textos mejorados',
        description: 'Hemos optimizado las descripciones usando IA profesional',
      });
    } catch (error) {
      console.error('Error improving texts:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron mejorar los textos. Verifica tu API Key.',
        variant: 'destructive',
      });
    } finally {
      setIsImproving(false);
    }
  };

  const generateCV = async () => {
    setIsGenerating(true);
    try {
      await DocumentGenerator.generateCV(data);
      toast({
        title: 'CV generado exitosamente',
        description: 'Tu CV se ha descargado en formato Word',
      });
    } catch (error) {
      console.error('Error generating CV:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el CV. Inténtalo nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <WizardCard
      title="Revisión Final"
      description="Revisa tu información y genera tu CV profesional"
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isLastStep
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={improveTexts}
            disabled={isImproving || hasImproved}
            variant="outline"
            className="flex-1"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isImproving ? 'Mejorando...' : hasImproved ? 'Textos mejorados' : 'Mejorar con IA'}
          </Button>
          
          <Button
            onClick={generateCV}
            disabled={isGenerating}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generando...' : 'Descargar CV'}
          </Button>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{data.personal.firstName} {data.personal.lastName}</p>
                <p className="text-sm text-muted-foreground">{data.personal.professionalTitle}</p>
              </div>
              <div>
                <p className="text-sm">{data.personal.email}</p>
                <p className="text-sm">{data.personal.phone}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Resumen Profesional:</p>
              <p className="text-sm text-muted-foreground">{data.personal.summary}</p>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Experiencia Laboral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.workExperience.map((exp, index) => (
              <div key={exp.id} className={index > 0 ? 'pt-4 border-t' : ''}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </p>
                </div>
                <p className="text-sm">
                  {exp.improvedDescription || exp.description}
                </p>
                {exp.improvedDescription && (
                  <Badge variant="secondary" className="mt-2">
                    Mejorado con IA
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Educación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={edu.id} className={index > 0 ? 'pt-4 border-t' : ''}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Habilidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Habilidades Técnicas:</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.technical.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Habilidades Blandas:</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.soft.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WizardCard>
  );
};