import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition, BorderStyle, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "../types";

export const generateDocx = (data: ResumeData) => {
  const { personalInfo, experience, education, projects, skills, languages, references } = data;

  // Standard font to match preview (Arial/Helvetica)
  const FONT_FAMILY = "Arial";

  // Helper for section headers with bottom border
  const createSectionHeader = (text: string) => {
    return new Paragraph({
      text: text.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      border: {
        bottom: {
          color: "000000",
          space: 4,
          value: BorderStyle.SINGLE,
          size: 6, // 1/8pt
        },
      },
      spacing: {
        before: 400, // 20pt
        after: 200,  // 10pt
      },
      run: {
        font: FONT_FAMILY,
        size: 28, // 14pt
        bold: true,
      }
    });
  };

  // Helper for normal text
  const createText = (text: string, options?: { bold?: boolean; italics?: boolean; size?: number; color?: string }) => {
    return new TextRun({
      text: text,
      font: FONT_FAMILY,
      size: options?.size || 22, // 11pt default
      bold: options?.bold,
      italics: options?.italics,
      color: options?.color,
    });
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // --- HEADER ---
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: personalInfo.fullName.toUpperCase(),
                font: FONT_FAMILY,
                size: 48, // 24pt
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: personalInfo.title,
                font: FONT_FAMILY,
                size: 28, // 14pt
                color: "444444",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 },
            children: [
              createText(personalInfo.location || ""),
              createText(" | "),
              createText(personalInfo.email || ""),
              createText(" | "),
              createText(personalInfo.phone || ""),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            border: {
              bottom: {
                color: "000000",
                space: 10,
                value: BorderStyle.SINGLE,
                size: 12,
              }
            },
            children: [
              createText("GitHub: " + (personalInfo.github || "")),
              createText(" | LinkedIn: " + (personalInfo.linkedin || "")),
              createText(" | Portfolio: " + (personalInfo.website || "")),
            ],
          }),

          // --- SUMMARY ---
          ...(personalInfo.summary ? [
            createSectionHeader("Profesyonel Özet"),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
              children: [createText(personalInfo.summary)],
            }),
          ] : []),

          // --- SKILLS (Simple List - No Tables) ---
          ...(skills.length > 0 ? [
            createSectionHeader("Teknik Yetkinlikler"),
            ...skills.map(group => 
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  createText(group.category + ": ", { bold: true }),
                  createText(group.items.join(", ")),
                ],
              })
            ),
            new Paragraph({ text: "", spacing: { after: 100 } }),
          ] : []),

          // --- EXPERIENCE ---
          ...(experience.length > 0 ? [
            createSectionHeader("İş Deneyimi"),
            ...experience.flatMap(exp => [
              new Paragraph({
                tabStops: [
                  { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                ],
                spacing: { before: 100 },
                children: [
                  createText(exp.position, { bold: true, size: 24 }),
                  new TextRun({
                    text: `\t${exp.startDate} – ${exp.endDate}`,
                    font: FONT_FAMILY,
                    size: 22,
                    italics: true,
                    color: "666666",
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [createText(exp.company, { bold: true, color: "444444" })],
              }),
              new Paragraph({
                spacing: { after: 200 },
                children: [createText(exp.description)],
              }),
            ]),
          ] : []),

          // --- PROJECTS ---
          ...(projects.length > 0 ? [
            createSectionHeader("Projeler"),
            ...projects.flatMap(proj => [
              new Paragraph({
                tabStops: [
                  { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                ],
                spacing: { before: 100 },
                children: [
                  createText(proj.name, { bold: true, size: 24 }),
                  ...(proj.link ? [
                    new TextRun({
                      text: `\t[Link]`,
                      font: FONT_FAMILY,
                      size: 20,
                      color: "0000FF",
                    }),
                  ] : []),
                ],
              }),
              ...(proj.technologies.length > 0 ? [
                new Paragraph({
                  spacing: { after: 50 },
                  children: [createText(`Teknolojiler: ${proj.technologies.join(", ")}`, { italics: true, size: 20, color: "666666" })],
                }),
              ] : []),
              new Paragraph({
                spacing: { after: 200 },
                children: [createText(proj.description)],
              }),
            ]),
          ] : []),

          // --- EDUCATION ---
          ...(education.length > 0 ? [
            createSectionHeader("Eğitim"),
            ...education.flatMap(edu => [
              new Paragraph({
                tabStops: [
                  { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                ],
                spacing: { before: 100 },
                children: [
                  createText(edu.school, { bold: true, size: 24 }),
                  new TextRun({
                    text: `\t${edu.startDate} ${edu.endDate ? `– ${edu.endDate}` : ''}`,
                    font: FONT_FAMILY,
                    size: 22,
                    italics: true,
                    color: "666666",
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 150 },
                children: [createText(edu.degree)],
              }),
            ]),
          ] : []),

          // --- LANGUAGES ---
          ...(languages && languages.length > 0 ? [
            createSectionHeader("Dil Bilgisi"),
            ...languages.map(lang => 
              new Paragraph({
                bullet: { level: 0 },
                children: [
                  createText(lang.name + ": ", { bold: true }),
                  createText(lang.level),
                ],
              })
            ),
            new Paragraph({ text: "", spacing: { after: 150 } }),
          ] : []),

          // --- REFERENCES ---
          ...(references.length > 0 ? [
            createSectionHeader("Referanslar"),
            ...references.map(ref => 
              new Paragraph({
                spacing: { after: 50 },
                children: [
                  createText(`${ref.name} ${ref.company ? `– ${ref.company}` : ''} ${ref.email ? ` | ${ref.email}` : ''} ${ref.phone ? ` | ${ref.phone}` : ''}`),
                ],
              })
            ),
          ] : []),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    const fileNameSafe = personalInfo.fullName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
      
    saveAs(blob, `${fileNameSafe}_CV.docx`);
  });
};
