import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface CVPreviewProps {
  data: ResumeData;
  id?: string;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data, id }) => {
  const { personalInfo, experience, education, projects, skills, languages, references, themeColor } = data;

  const ensureUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div 
      id={id}
      className="bg-white text-gray-900 print-container mx-auto p-12 max-w-[210mm] min-h-[297mm] shadow-none print:max-w-none print:w-full print:p-[15mm] print:mx-0 print:min-h-0"
      style={{ 
        fontFamily: 'Arial, Helvetica, sans-serif', // Standard ATS font
        lineHeight: '1.5',
        color: '#000'
      }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-6 mb-6 flex items-center gap-6 print:flex-row">
        {personalInfo.photoUrl && (
          <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm print:w-32 print:h-32">
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.fullName} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold uppercase tracking-wide mb-2 text-left print:text-4xl">{personalInfo.fullName}</h1>
          <h2 className="text-xl font-medium text-left mb-4 text-gray-700 print:text-xl">{personalInfo.title}</h2>
          
          <div className="flex flex-wrap justify-start gap-x-4 gap-y-2 text-sm text-gray-700 print:flex-wrap">
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {personalInfo.location}
              </span>
            )}
            {personalInfo.email && (
               <span className="flex items-center gap-1">
                 | <Mail size={14} /> <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
               </span>
            )}
            {personalInfo.phone && (
               <span className="flex items-center gap-1">
                 | <Phone size={14} /> {personalInfo.phone}
               </span>
            )}
          </div>
          <div className="flex flex-wrap justify-start gap-x-4 gap-y-2 text-sm text-gray-700 mt-2">
            {personalInfo.github && (
               <span className="flex items-center gap-1">
                 <Github size={14} /> <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
               </span>
            )}
            {personalInfo.linkedin && (
               <span className="flex items-center gap-1">
                 | <Linkedin size={14} /> <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
               </span>
            )}
            {personalInfo.website && (
               <span className="flex items-center gap-1">
                 | <Globe size={14} /> <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
               </span>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8 break-inside-avoid">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3 pb-1">Professional Summary</h3>
          <p className="text-sm text-left whitespace-pre-line leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8 break-inside-avoid">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3 pb-1">Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {skills.map((group, idx) => (
              <div key={idx} className="break-inside-avoid">
                <h4 className="font-bold mb-1 text-gray-800">{group.category}</h4>
                <p className="text-gray-700 leading-relaxed">
                  {group.items.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3 pb-1">Experience</h3>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-md text-gray-900">{exp.position}</h4>
                  <span className="text-sm font-bold text-gray-700">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-800 mb-2">{exp.company}</div>
                <div className="text-sm text-gray-700 whitespace-pre-line pl-2 border-l-2 border-gray-100">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3 pb-1">Projects</h3>
          <div className="space-y-6">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-md text-gray-900">{proj.name}</h4>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                      [Link]
                    </a>
                  )}
                </div>
                {proj.technologies.length > 0 && (
                  <div className="text-xs text-gray-600 italic mb-2">
                    Technologies: {proj.technologies.join(', ')}
                  </div>
                )}
                <div className="text-sm text-gray-700 whitespace-pre-line pl-2 border-l-2 border-gray-100">
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3 pb-1">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-md text-gray-900">{edu.school}</h4>
                  <span className="text-sm font-bold text-gray-700">
                    {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-800">{edu.degree}</div>
                {edu.description && <div className="text-sm text-gray-600 mt-1 pl-2 border-l-2 border-gray-100">{edu.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3 pb-1">Languages</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {languages.map((lang) => (
              <li key={lang.id} className="break-inside-avoid">
                <span className="font-bold text-gray-800">{lang.name}:</span> {lang.level}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* References */}
      {references.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3 pb-1">References</h3>
          <div className="text-sm text-gray-700 space-y-2">
            {references.map((ref) => (
              <div key={ref.id} className="break-inside-avoid">
                <span className="font-bold text-gray-800">{ref.name}</span> {ref.company ? `– ${ref.company}` : ''} 
                <div className="text-xs text-gray-600">
                  {ref.email ? `${ref.email}` : ''}
                  {ref.phone ? ` | ${ref.phone}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
