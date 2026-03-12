import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project, Reference, Language } from './types';
import { CVPreview } from './components/CVPreview';
import { enhanceText } from './services/geminiService';
import { generateDocx } from './services/docxService';
import { 
  Plus, Trash2, Download, Wand2, ChevronDown, ChevronUp, 
  Briefcase, GraduationCap, Code, User, FileText, Settings, Users, Upload, Languages
} from 'lucide-react';

// Default State
const initialData: ResumeData = {
  themeColor: '#2c3e50', // Professional dark blue/grey
  personalInfo: {
    fullName: 'SALIH YILDIZ',
    title: 'Senior .NET Backend Developer | ASP.NET Core | ASP.NET MVC | Web API | Clean Architecture',
    email: 'yldzsalih27@gmail.com',
    phone: '0543 282 3301',
    location: 'Gaziantep, Turkey',
    website: 'https://salihyildiz.runasp.net',
    linkedin: 'https://linkedin.com/in/salih-yildiz-bab4b1181/',
    github: 'https://github.com/salihyildiz08',
    photoUrl: 'https://picsum.photos/200', // Placeholder
    summary: ".NET developer with 5+ years of experience building scalable and high-performance backend systems using ASP.NET Core, ASP.NET MVC and Web API.\n\nExperienced in designing maintainable and scalable architectures following Clean Architecture and SOLID principles. Strong background in RESTful API development, Entity Framework Core, SQL Server performance optimization, Redis caching, structured logging with Serilog, and JWT-based authentication.\n\nHands-on experience with payment system integrations, real-time applications using SignalR, and Agile/Scrum development environments.",
  },
  experience: [
    {
      id: '1',
      company: 'Dilek Halı A.Ş.',
      position: 'Senior .NET Developer',
      startDate: '2022',
      endDate: 'Present',
      description: '• Developed enterprise-level B2B order management systems using ASP.NET Core and EF Core.\n• Designed RESTful APIs to integrate frontend and backend services.\n• Improved SQL Server performance by 30% through indexing and query optimization.\n• Implemented Redis and In-Memory caching strategies.\n• Built structured logging infrastructure using Serilog.\n• Developed global exception handling middleware.\n• Implemented JWT authentication and role-based authorization.\n• Built real-time notification infrastructure with SignalR.\n• Designed and managed API versioning strategy.\n• Integrated bank APIs and payment systems.\n• Worked within Agile/Scrum development teams.'
    },
    {
      id: '2',
      company: 'Eksen Mobilya A.Ş.',
      position: '.NET Developer',
      startDate: '2020',
      endDate: '2022',
      description: '• Developed internal automation systems using ASP.NET Core and Web API.\n• Built dynamic frontend applications using Angular.\n• Designed database schemas and optimized SQL Server queries.'
    }
  ],
  education: [
    {
      id: '1',
      school: 'Iskenderun Technical University',
      degree: 'Bachelor’s Degree in Computer Engineering',
      startDate: '2016',
      endDate: '2020',
      description: ''
    }
  ],
  projects: [], // User didn't provide specific projects in the list, but they are in experience
  skills: [
    { category: 'Programming Languages', items: ['C#', 'JavaScript'] },
    { category: 'Backend', items: ['ASP.NET Core', 'ASP.NET MVC', '.NET Core', 'Web API', 'Entity Framework Core', 'LINQ', 'WCF'] },
    { category: 'Frontend', items: ['React', 'Angular', 'Razor Pages', 'HTML5', 'CSS3', 'Bootstrap', 'WPF'] },
    { category: 'Architecture', items: ['Clean Architecture', 'N-Tier Architecture', 'SOLID Principles', 'Design Patterns', 'Dependency Injection'] },
    { category: 'Databases', items: ['SQL Server', 'PostgreSQL', 'MongoDB', 'MySQL'] },
    { category: 'Caching & Performance', items: ['Redis', 'In-Memory Caching', 'SQL Index Optimization', 'Query Performance Tuning'] },
    { category: 'Logging & Monitoring', items: ['Serilog', 'Structured Logging', 'Global Exception Handling'] },
    { category: 'Testing', items: ['Unit Testing (xUnit, NUnit)', 'Moq'] },
    { category: 'Security', items: ['JWT Authentication', 'Role-Based Authorization'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'Docker', 'IIS', 'Postman'] },
    { category: 'Other', items: ['RESTful API Development', 'API Versioning', 'Middleware Development', 'Agile / Scrum'] }
  ],
  languages: [
    { id: '1', name: 'English', level: 'B2' }
  ],
  references: [
    { 
      id: '1', 
      name: 'Available upon request.', 
      company: '', 
      email: '', 
      phone: '' 
    }
  ]
};

function App() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Handlers for updating state
  const updatePersonalInfo = (key: keyof typeof data.personalInfo, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [key]: value }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, key: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [key]: value } : e)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, key: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [key]: value } : e)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: '',
      link: '',
      description: '',
      technologies: []
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, key: keyof Project, value: any) => {
     setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [key]: value } : p)
    }));
  };
  
  const removeProject = (id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addSkillCategory = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: 'New Category', items: [] }]
    }));
  };

  const updateSkillCategory = (index: number, category: string) => {
    const newSkills = [...data.skills];
    newSkills[index].category = category;
    setData(prev => ({ ...prev, skills: newSkills }));
  };

  const updateSkillItems = (index: number, items: string[]) => {
    const newSkills = [...data.skills];
    newSkills[index].items = items;
    setData(prev => ({ ...prev, skills: newSkills }));
  };

  const removeSkillCategory = (index: number) => {
    const newSkills = [...data.skills];
    newSkills.splice(index, 1);
    setData(prev => ({ ...prev, skills: newSkills }));
  };

  const addLanguage = () => {
    setData(prev => ({
      ...prev,
      languages: [...prev.languages, { id: Date.now().toString(), name: '', level: '' }]
    }));
  };

  const updateLanguage = (id: string, key: keyof Language, value: string) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [key]: value } : l)
    }));
  };

  const removeLanguage = (id: string) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  };

  const handleAiEnhance = async (text: string, context: string, callback: (val: string) => void) => {
    if (!text) return;
    setIsGenerating(true);
    const improved = await enhanceText(text, context);
    callback(improved);
    setIsGenerating(false);
  };

  const downloadPdf = () => {
    // Use window.print() for native, high-quality, text-based ATS-friendly PDF generation
    window.print();
  };

  // UI Components for Editor Sections
  const renderSidebarItem = (id: string, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r flex flex-col shrink-0 z-20 h-full overflow-y-auto no-scrollbar">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
              CV
            </div>
            Salih Yıldız CV Builder
          </div>
        </div>
        
        <nav className="flex-1 py-4 space-y-1">
          {renderSidebarItem('personal', 'Personal Info', <User size={18} />)}
          {renderSidebarItem('summary', 'About Me', <FileText size={18} />)}
          {renderSidebarItem('experience', 'Experience', <Briefcase size={18} />)}
          {renderSidebarItem('education', 'Education', <GraduationCap size={18} />)}
          {renderSidebarItem('projects', 'Projects', <Code size={18} />)}
          {renderSidebarItem('skills', 'Skills', <Wand2 size={18} />)}
          {renderSidebarItem('languages', 'Languages', <Languages size={18} />)}
          {renderSidebarItem('references', 'References', <Users size={18} />)}
          {renderSidebarItem('settings', 'Settings', <Settings size={18} />)}
        </nav>

        <div className="p-4 border-t bg-gray-50 space-y-3">
          <button 
            onClick={downloadPdf}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-2.5 rounded-lg transition-all font-medium shadow-lg active:scale-95"
            title="Use 'Save as PDF' from the print dialog"
          >
            <Download size={18} />
            Download PDF (Print)
          </button>
          <button 
            onClick={() => generateDocx(data)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-all font-medium shadow-lg active:scale-95"
          >
            <FileText size={18} />
            Download Word (DOCX)
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="w-96 bg-white border-r flex flex-col shrink-0 z-10 h-full overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700">Edit</h2>
            {isGenerating && <span className="text-xs text-blue-600 animate-pulse flex items-center gap-1"><Wand2 size={12}/> AI Working...</span>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar pb-20">
             
            {activeTab === 'personal' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <InputGroup label="Full Name" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo('fullName', v)} />
                <InputGroup label="Title" value={data.personalInfo.title} onChange={(v) => updatePersonalInfo('title', v)} />
                <InputGroup label="Email" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} />
                <InputGroup label="Phone" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} />
                <InputGroup label="Location" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} />
                <InputGroup label="Website" value={data.personalInfo.website} onChange={(v) => updatePersonalInfo('website', v)} placeholder="e.g. salihyildiz.dev" />
                <InputGroup label="LinkedIn" value={data.personalInfo.linkedin} onChange={(v) => updatePersonalInfo('linkedin', v)} placeholder="e.g. linkedin.com/in/salih" />
                <InputGroup label="GitHub" value={data.personalInfo.github} onChange={(v) => updatePersonalInfo('github', v)} placeholder="e.g. github.com/salih" />
                
                {/* Photo Upload */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Profile Photo</label>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                    <div className="w-16 h-16 shrink-0 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                      {data.personalInfo.photoUrl ? (
                        <img src={data.personalInfo.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center">
                        <Upload size={16} />
                        Select Photo
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                      {data.personalInfo.photoUrl && (
                         <button 
                           onClick={() => updatePersonalInfo('photoUrl', '')} 
                           className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
                         >
                           <Trash2 size={12} /> Remove Photo
                         </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Summary</label>
                <div className="relative">
                  <textarea 
                    className="w-full p-3 border rounded-lg h-48 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={data.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder="Briefly describe yourself..."
                  ></textarea>
                  <button 
                    onClick={() => handleAiEnhance(data.personalInfo.summary, 'Professional CV Summary', (v) => updatePersonalInfo('summary', v))}
                    className="absolute bottom-3 right-3 p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                    title="Enhance with AI"
                  >
                    <Wand2 size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4 bg-gray-50 relative group">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-3">
                      <InputGroup label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                      <InputGroup label="Position" value={exp.position} onChange={(v) => updateExperience(exp.id, 'position', v)} />
                      <div className="flex gap-2">
                         <InputGroup label="Start" value={exp.startDate} onChange={(v) => updateExperience(exp.id, 'startDate', v)} placeholder="2020-01" />
                         <InputGroup label="End" value={exp.endDate} onChange={(v) => updateExperience(exp.id, 'endDate', v)} placeholder="Present" />
                      </div>
                      <div className="relative">
                         <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                         <textarea 
                           className="w-full p-2 border rounded text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                           value={exp.description}
                           onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                         />
                         <button 
                            onClick={() => handleAiEnhance(exp.description, `Job description for ${exp.position} at ${exp.company}`, (v) => updateExperience(exp.id, 'description', v))}
                            className="absolute bottom-2 right-2 p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          >
                            <Wand2 size={14} />
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Experience
                </button>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                {data.education.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-4 bg-gray-50 relative group">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-3">
                      <InputGroup label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, 'school', v)} />
                      <InputGroup label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} />
                      <div className="flex gap-2">
                         <InputGroup label="Start" value={edu.startDate} onChange={(v) => updateEducation(edu.id, 'startDate', v)} />
                         <InputGroup label="End" value={edu.endDate} onChange={(v) => updateEducation(edu.id, 'endDate', v)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Education
                </button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="border rounded-lg p-4 bg-gray-50 relative group">
                    <button onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-3">
                      <InputGroup label="Project Name" value={proj.name} onChange={(v) => updateProject(proj.id, 'name', v)} />
                      <InputGroup label="Link" value={proj.link} onChange={(v) => updateProject(proj.id, 'link', v)} placeholder="https://..." />
                      <div className="relative">
                         <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                         <textarea 
                           className="w-full p-2 border rounded text-sm h-20 focus:ring-2 focus:ring-blue-500 outline-none"
                           value={proj.description}
                           onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                         />
                         <button 
                            onClick={() => handleAiEnhance(proj.description, `Project description for ${proj.name}`, (v) => updateProject(proj.id, 'description', v))}
                            className="absolute bottom-2 right-2 p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          >
                            <Wand2 size={14} />
                          </button>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Technologies (Comma separated)</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={proj.technologies.join(', ')}
                          onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                          placeholder="React, Node.js, AWS..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addProject} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Project
                </button>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                {data.skills.map((group, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50 relative group">
                    <button onClick={() => removeSkillCategory(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-3">
                      <InputGroup label="Category" value={group.category} onChange={(v) => updateSkillCategory(idx, v)} placeholder="e.g. Frontend" />
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Skills (Comma separated)</label>
                        <textarea 
                          className="w-full p-2 border rounded text-sm h-20 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={group.items.join(', ')}
                          onChange={(e) => updateSkillItems(idx, e.target.value.split(',').map(s => s.trim()))}
                          placeholder="React, TypeScript, CSS..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addSkillCategory} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Category
                </button>
              </div>
            )}

            {activeTab === 'languages' && (
              <div className="space-y-6">
                {data.languages.map((lang) => (
                   <div key={lang.id} className="border rounded-lg p-4 bg-gray-50 relative group">
                   <button onClick={() => removeLanguage(lang.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 size={16} />
                   </button>
                   <div className="space-y-3">
                     <InputGroup label="Language" value={lang.name} onChange={(v) => updateLanguage(lang.id, 'name', v)} placeholder="e.g. English" />
                     <InputGroup label="Level" value={lang.level} onChange={(v) => updateLanguage(lang.id, 'level', v)} placeholder="e.g. C1 (Advanced)" />
                   </div>
                 </div>
                ))}
                <button 
                  onClick={addLanguage} 
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Language
                </button>
              </div>
            )}

            {activeTab === 'references' && (
              <div className="space-y-6">
                {data.references.map((ref) => (
                   <div key={ref.id} className="border rounded-lg p-4 bg-gray-50 relative group">
                   <button onClick={() => setData(prev => ({...prev, references: prev.references.filter(r => r.id !== ref.id)}))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 size={16} />
                   </button>
                   <div className="space-y-3">
                     <InputGroup label="Full Name" value={ref.name} onChange={(v) => setData(prev => ({...prev, references: prev.references.map(r => r.id === ref.id ? {...r, name: v} : r)}))} />
                     <InputGroup label="Company / Position" value={ref.company} onChange={(v) => setData(prev => ({...prev, references: prev.references.map(r => r.id === ref.id ? {...r, company: v} : r)}))} />
                     <InputGroup label="Email" value={ref.email} onChange={(v) => setData(prev => ({...prev, references: prev.references.map(r => r.id === ref.id ? {...r, email: v} : r)}))} />
                     <InputGroup label="Phone" value={ref.phone} onChange={(v) => setData(prev => ({...prev, references: prev.references.map(r => r.id === ref.id ? {...r, phone: v} : r)}))} />
                   </div>
                 </div>
                ))}
                <button 
                  onClick={() => setData(prev => ({...prev, references: [...prev.references, {id: Date.now().toString(), name: '', company: '', email: '', phone: ''}]}))} 
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Reference
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                  <div className="flex flex-wrap gap-3">
                    {['#2c3e50', '#1a365d', '#115e59', '#881337', '#334155', '#4c1d95', '#000000'].map(color => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-full border-2 ${data.themeColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setData(prev => ({ ...prev, themeColor: color }))}
                      />
                    ))}
                  </div>
                  <input 
                    type="color" 
                    value={data.themeColor}
                    onChange={(e) => setData(prev => ({ ...prev, themeColor: e.target.value }))}
                    className="mt-4 w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
         </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-200 overflow-auto flex justify-center p-8 relative">
        <div className="scale-[0.85] origin-top shadow-2xl">
          <div id="print-area">
            <CVPreview data={data} id="resume-preview" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Inputs
const InputGroup = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
    <input 
      type="text" 
      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default App;