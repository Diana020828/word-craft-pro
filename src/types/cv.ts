export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  professionalTitle: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  improvedDescription?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface CVData {
  personal: PersonalData;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
}