import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType } from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from '@/types/cv';

export class DocumentGenerator {
  static async generateCV(data: CVData): Promise<void> {
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: 'Calibri',
              size: 22,
            },
          },
        },
        paragraphStyles: [
          {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 32,
              bold: true,
              color: '2F5496',
            },
            paragraph: {
              spacing: {
                after: 240,
                before: 120,
              },
            },
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 26,
              bold: true,
              color: '2F5496',
            },
            paragraph: {
              spacing: {
                after: 120,
                before: 240,
              },
            },
          },
        ],
      },
      sections: [
        {
          children: [
            // Header with name and title
            new Paragraph({
              children: [
                new TextRun({
                  text: `${data.personal.firstName} ${data.personal.lastName}`,
                  bold: true,
                  size: 36,
                  color: '1F4E79',
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: data.personal.professionalTitle,
                  size: 24,
                  color: '2F5496',
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
            }),

            // Contact Information
            new Paragraph({
              children: [
                new TextRun({
                  text: `${data.personal.email} | ${data.personal.phone}`,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 360 },
            }),

            // Professional Summary
            new Paragraph({
              children: [
                new TextRun({
                  text: 'RESUMEN PROFESIONAL',
                  bold: true,
                  size: 26,
                  color: '2F5496',
                }),
              ],
              spacing: { after: 120 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: data.personal.summary,
                  size: 22,
                }),
              ],
              spacing: { after: 360 },
            }),

            // Work Experience
            new Paragraph({
              children: [
                new TextRun({
                  text: 'EXPERIENCIA LABORAL',
                  bold: true,
                  size: 26,
                  color: '2F5496',
                }),
              ],
              spacing: { after: 120 },
            }),

            ...data.workExperience.flatMap((exp) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.position,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` | ${exp.company}`,
                    size: 22,
                    color: '404040',
                  }),
                ],
                spacing: { after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.startDate} - ${exp.endDate}`,
                    size: 20,
                    italics: true,
                    color: '666666',
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.improvedDescription || exp.description,
                    size: 22,
                  }),
                ],
                spacing: { after: 240 },
              }),
            ]),

            // Education
            new Paragraph({
              children: [
                new TextRun({
                  text: 'EDUCACIÓN',
                  bold: true,
                  size: 26,
                  color: '2F5496',
                }),
              ],
              spacing: { after: 120 },
            }),

            ...data.education.flatMap((edu) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: edu.degree,
                    bold: true,
                    size: 22,
                  }),
                  new TextRun({
                    text: ` | ${edu.institution}`,
                    size: 22,
                    color: '404040',
                  }),
                ],
                spacing: { after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.startDate} - ${edu.endDate}`,
                    size: 20,
                    italics: true,
                    color: '666666',
                  }),
                ],
                spacing: { after: 240 },
              }),
            ]),

            // Skills
            new Paragraph({
              children: [
                new TextRun({
                  text: 'HABILIDADES',
                  bold: true,
                  size: 26,
                  color: '2F5496',
                }),
              ],
              spacing: { after: 120 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Habilidades Técnicas: ',
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: data.skills.technical.join(', '),
                  size: 22,
                }),
              ],
              spacing: { after: 120 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Habilidades Blandas: ',
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: data.skills.soft.join(', '),
                  size: 22,
                }),
              ],
              spacing: { after: 120 },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `CV_${data.personal.firstName}_${data.personal.lastName}.docx`;
    saveAs(blob, fileName);
  }
}