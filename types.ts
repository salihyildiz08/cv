export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
  technologies: string[];
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    summary: string;
    photoUrl: string;
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  languages: Language[];
  references: Reference[];
  themeColor: string;
}