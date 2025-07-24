import { useState, useEffect } from 'react';
import { WizardCard } from '../WizardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, Briefcase, GraduationCap, Brain, Download, Wand2, Edit2, Save, X } from 'lucide-react';
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

export const ReviewStep = ({ data, onDataChange, onBack, currentStep, totalSteps }: ReviewStepProps) => {
  const [isImproving, setIsImproving] = useState(false);
  const [hasImproved, setHasImproved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEditedAfterIA, setHasEditedAfterIA] = useState(false);
  const [editData, setEditData] = useState<CVData>(data);
  const { toast } = useToast();

  // Sync editData when data changes (from parent)
  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert to original data
      setEditData(data);
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    onDataChange(editData);
    setIsEditing(false);
    setHasEditedAfterIA(true);
    toast({
      title: 'Cambios guardados',
      description: 'Tus modificaciones han sido aplicadas. Puedes volver a mejorar con IA si lo deseas.',
    });
  };

  const updateEditData = (updates: Partial<CVData>) => {
    setEditData(prev => ({ ...prev, ...updates }));
  };

  const improveTexts = async () => {
    setIsImproving(true);
    try {
      // Improve professional summary
      const improvedSummary = await openaiService.improveSummary(
        data.personal.summary,
        data.personal.professionalTitle
      );

      // Improve professional title
      const improvedTitle = await openaiService.improveProfessionalTitle(
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

      // Improve education descriptions
      const improvedEducation = await Promise.all(
        data.education.map(async (edu) => {
          const improvedDegree = await openaiService.improveEducationDescription(
            edu.degree,
            edu.institution
          );
          return {
            ...edu,
            degree: improvedDegree,
          };
        })
      );

      // Improve skills
      const improvedTechnicalSkills = await openaiService.improveSkills(
        data.skills.technical,
        'technical'
      );
      
      const improvedSoftSkills = await openaiService.improveSkills(
        data.skills.soft,
        'soft'
      );

      const improvedData = {
        ...data,
        personal: {
          ...data.personal,
          summary: improvedSummary,
          professionalTitle: improvedTitle,
        },
        workExperience: improvedExperiences,
        education: improvedEducation,
        skills: {
          technical: improvedTechnicalSkills,
          soft: improvedSoftSkills,
        },
      };

      onDataChange(improvedData);
      setHasImproved(true);
      setHasEditedAfterIA(false);
      
      toast({
        title: 'CV optimizado con IA',
        description: 'Hemos mejorado tu resumen, experiencias, educación, habilidades y más para máximo impacto ATS',
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
        description: 'Tu CV se ha descargado en formato PDF optimizado para ATS',
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
        <div className="flex gap-3 flex-wrap">
          {!isEditing ? (
            <>
              <Button
                onClick={improveTexts}
                disabled={isImproving || (hasImproved && !hasEditedAfterIA)}
                variant="outline"
                className="flex-1 min-w-fit"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isImproving ? 'Mejorando...' : 
                 hasImproved && !hasEditedAfterIA ? 'Textos mejorados' : 
                 hasEditedAfterIA ? 'Volver a mejorar con IA' : 'Mejorar con IA'}
              </Button>
              
              <Button
                onClick={handleEditToggle}
                variant="outline"
                className="flex-1 min-w-fit"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar información
              </Button>
              
              <Button
                onClick={generateCV}
                disabled={isGenerating}
                className="flex-1 min-w-fit"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Descargar CV'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSaveEdit}
                className="flex-1 min-w-fit"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
              
              <Button
                onClick={handleEditToggle}
                variant="outline"
                className="flex-1 min-w-fit"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
        </div>

        {hasEditedAfterIA && !isEditing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              💡 Has hecho cambios al CV. Puedes volver a usar la IA para optimizar el contenido actualizado.
            </p>
          </div>
        )}

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isEditing ? (
              <>
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
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      value={editData.personal.firstName}
                      onChange={(e) => updateEditData({
                        personal: { ...editData.personal, firstName: e.target.value }
                      })}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Apellido</label>
                    <Input
                      value={editData.personal.lastName}
                      onChange={(e) => updateEditData({
                        personal: { ...editData.personal, lastName: e.target.value }
                      })}
                      placeholder="Apellido"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título Profesional</label>
                  <Input
                    value={editData.personal.professionalTitle}
                    onChange={(e) => updateEditData({
                      personal: { ...editData.personal, professionalTitle: e.target.value }
                    })}
                    placeholder="Título profesional"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={editData.personal.email}
                      onChange={(e) => updateEditData({
                        personal: { ...editData.personal, email: e.target.value }
                      })}
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input
                      value={editData.personal.phone}
                      onChange={(e) => updateEditData({
                        personal: { ...editData.personal, phone: e.target.value }
                      })}
                      placeholder="Teléfono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resumen Profesional</label>
                  <Textarea
                    value={editData.personal.summary}
                    onChange={(e) => updateEditData({
                      personal: { ...editData.personal, summary: e.target.value }
                    })}
                    placeholder="Describe tu perfil profesional..."
                    rows={4}
                  />
                </div>
              </div>
            )}
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
            {!isEditing ? (
              data.workExperience.map((exp, index) => (
                <div key={exp.id} className={index > 0 ? 'pt-4 border-t' : ''}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(exp.startDate)} - {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}
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
              ))
            ) : (
              <div className="space-y-6">
                {editData.workExperience.map((exp, index) => (
                  <div key={exp.id} className={index > 0 ? 'pt-6 border-t' : ''}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cargo</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => {
                            const updatedExp = [...editData.workExperience];
                            updatedExp[index] = { ...exp, position: e.target.value };
                            updateEditData({ workExperience: updatedExp });
                          }}
                          placeholder="Cargo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Empresa</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const updatedExp = [...editData.workExperience];
                            updatedExp[index] = { ...exp, company: e.target.value };
                            updateEditData({ workExperience: updatedExp });
                          }}
                          placeholder="Empresa"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha de inicio</label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updatedExp = [...editData.workExperience];
                            updatedExp[index] = { ...exp, startDate: e.target.value };
                            updateEditData({ workExperience: updatedExp });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha de fin</label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => {
                            const updatedExp = [...editData.workExperience];
                            updatedExp[index] = { ...exp, endDate: e.target.value };
                            updateEditData({ workExperience: updatedExp });
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descripción</label>
                      <Textarea
                        value={exp.improvedDescription || exp.description}
                        onChange={(e) => {
                          const updatedExp = [...editData.workExperience];
                          updatedExp[index] = { ...exp, description: e.target.value, improvedDescription: undefined };
                          updateEditData({ workExperience: updatedExp });
                        }}
                        placeholder="Describe tus responsabilidades y logros..."
                        rows={4}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {!isEditing ? (
              data.education.map((edu, index) => (
                <div key={edu.id} className={index > 0 ? 'pt-4 border-t' : ''}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(edu.startDate)} - {edu.isCurrent ? 'Presente' : formatDate(edu.endDate)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-6">
                {editData.education.map((edu, index) => (
                  <div key={edu.id} className={index > 0 ? 'pt-6 border-t' : ''}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Título/Grado</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => {
                            const updatedEdu = [...editData.education];
                            updatedEdu[index] = { ...edu, degree: e.target.value };
                            updateEditData({ education: updatedEdu });
                          }}
                          placeholder="Título o grado académico"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Institución</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const updatedEdu = [...editData.education];
                            updatedEdu[index] = { ...edu, institution: e.target.value };
                            updateEditData({ education: updatedEdu });
                          }}
                          placeholder="Universidad o institución"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha de inicio</label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => {
                            const updatedEdu = [...editData.education];
                            updatedEdu[index] = { ...edu, startDate: e.target.value };
                            updateEditData({ education: updatedEdu });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha de fin</label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => {
                            const updatedEdu = [...editData.education];
                            updatedEdu[index] = { ...edu, endDate: e.target.value };
                            updateEditData({ education: updatedEdu });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {!isEditing ? (
              <>
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
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Habilidades Técnicas</label>
                  <Textarea
                    value={editData.skills.technical.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      updateEditData({
                        skills: { ...editData.skills, technical: skills }
                      });
                    }}
                    placeholder="Separar con comas: JavaScript, React, Python..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Habilidades Blandas</label>
                  <Textarea
                    value={editData.skills.soft.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      updateEditData({
                        skills: { ...editData.skills, soft: skills }
                      });
                    }}
                    placeholder="Separar con comas: Liderazgo, Comunicación..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WizardCard>
  );
};