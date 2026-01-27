import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface CVPreviewProps {
  data: ResumeData;
  id?: string;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data, id }) => {
  const { personalInfo, experience, education, projects, skills, languages, references, themeColor } = data;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(themeColor) || { r: 59, g: 130, b: 246 };

  const ensureUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div 
      id={id}
      className="bg-white text-gray-800 print-container mx-auto relative overflow-hidden"
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        height: 'auto'
      }}
    >
      {/* Header / Banner */}
      <div className="flex h-64 text-white" style={{ backgroundColor: themeColor }}>
        <div className="w-1/3 flex items-center justify-center p-6 bg-black/10">
          <div className="w-48 h-48 rounded-full border-4 border-white overflow-hidden bg-gray-300 shadow-lg relative">
            {personalInfo.photoUrl ? (
              <img 
                src={personalInfo.photoUrl} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/50">
                {personalInfo.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div className="w-2/3 p-10 flex flex-col justify-center">
          {/* Removed uppercase class to respect user capitalization */}
          <h1 className="text-5xl font-bold mb-2">{personalInfo.fullName}</h1>
          <p className="text-2xl font-light uppercase">{personalInfo.title}</p>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-50 min-h-[calc(297mm-16rem)] border-r border-gray-100 flex flex-col">
          <div className="p-8 space-y-8 flex-1">
            
            {/* Contact Info */}
            <div>
              {/* Removed tracking-widest */}
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 border-b pb-2">İletişim</h3>
              <ul className="space-y-4 text-sm">
                {personalInfo.email && (
                  <li className="flex items-start gap-3">
                    <Mail size={16} className="mt-1 shrink-0" style={{ color: themeColor }} />
                    <span className="break-all">{personalInfo.email}</span>
                  </li>
                )}
                {personalInfo.phone && (
                  <li className="flex items-start gap-3">
                    <Phone size={16} className="mt-1 shrink-0" style={{ color: themeColor }} />
                    <span>{personalInfo.phone}</span>
                  </li>
                )}
                {personalInfo.location && (
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="mt-1 shrink-0" style={{ color: themeColor }} />
                    <span>{personalInfo.location}</span>
                  </li>
                )}
                {personalInfo.website && (
                  <li className="flex items-start gap-3">
                    <Globe size={16} className="mt-1 shrink-0" style={{ color: themeColor }} />
                    <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noreferrer" className="hover:underline text-blue-600 break-all">{personalInfo.website}</a>
                  </li>
                )}
                {personalInfo.linkedin && (
                  <li className="flex items-start gap-3">
                    <Linkedin size={16} className="mt-1 shrink-0" style={{ color: themeColor }} />
                    <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="hover:underline break-all">{personalInfo.linkedin}</a>
                  </li>
                )}
                {personalInfo.github && (
                  <li className="flex items-start gap-3">
                    <Github size={16} className="mt-1 shrink-0" style={{ color: themeColor }} />
                    <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noreferrer" className="hover:underline break-all">{personalInfo.github}</a>
                  </li>
                )}
              </ul>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 border-b pb-2">Yetenekler</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs font-semibold px-2 py-1 rounded text-white"
                      style={{ backgroundColor: themeColor }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages (Added to Sidebar) */}
            {languages && languages.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 border-b pb-2">Yabancı Dil</h3>
                <ul className="space-y-2">
                  {languages.map((lang) => (
                    <li key={lang.id} className="text-sm">
                      <div className="font-bold text-gray-800">{lang.name}</div>
                      <div className="text-xs text-gray-500">{lang.level}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education (Sidebar style) */}
            {education.length > 0 && (
               <div>
               <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 border-b pb-2">Eğitim</h3>
               <div className="space-y-5">
                 {education.map((edu) => (
                   <div key={edu.id}>
                     <div className="font-bold text-gray-800">{edu.school}</div>
                     <div className="text-sm text-gray-600">{edu.degree}</div>
                     <div className="text-xs text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                   </div>
                 ))}
               </div>
             </div>
            )}

            {/* References (Moved to Sidebar under Education) */}
            {references.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 border-b pb-2">Referanslar</h3>
                <div className="space-y-4">
                  {references.map((ref) => (
                    <div key={ref.id} className="text-sm">
                      <div className="font-bold text-gray-800">{ref.name}</div>
                      <div className="text-xs italic text-gray-600 mb-0.5">{ref.company}</div>
                      <div className="text-[10px] text-gray-400">{ref.email}</div>
                      <div className="text-[10px] text-gray-400">{ref.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8 space-y-8">
          
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-3" style={{ color: themeColor }}>
                <span className="w-8 h-1 rounded-full bg-current"></span>
                Hakkımda
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-3" style={{ color: themeColor }}>
                <span className="w-8 h-1 rounded-full bg-current"></span>
                İş Deneyimi
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                    <div 
                      className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white"
                      style={{ borderColor: themeColor }}
                    ></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">{exp.company}</div>
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-3" style={{ color: themeColor }}>
                <span className="w-8 h-1 rounded-full bg-current"></span>
                Projeler
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{proj.name}</h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: themeColor }}>
                          Link <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-[10px] uppercase font-bold text-gray-500 bg-white border px-1.5 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};