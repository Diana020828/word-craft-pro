import jsPDF from 'jspdf';
import { CVData } from '@/types/cv';

export class DocumentGenerator {
  private static readonly PAGE_WIDTH = 210; // A4 width in mm
  private static readonly PAGE_HEIGHT = 297; // A4 height in mm
  private static readonly MARGIN_LEFT = 20;
  private static readonly MARGIN_RIGHT = 20;
  private static readonly MARGIN_TOP = 20;
  private static readonly MARGIN_BOTTOM = 20;
  private static readonly LINE_HEIGHT = 5;
  private static readonly SECTION_SPACING = 10;
  
  // ATS-optimized typography settings
  private static readonly FONTS = {
    name: { size: 18, weight: 'bold' },
    title: { size: 12, weight: 'normal' },
    contact: { size: 10, weight: 'normal' },
    sectionHeader: { size: 11, weight: 'bold' },
    jobTitle: { size: 10, weight: 'bold' },
    dates: { size: 9, weight: 'normal' },
    text: { size: 9, weight: 'normal' },
    bullet: { size: 9, weight: 'normal' }
  };
  
  static async generateCV(data: CVData): Promise<void> {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Set default font to Arial (Helvetica equivalent) for maximum ATS compatibility
    doc.setFont('helvetica', 'normal');
    
    let currentY = this.MARGIN_TOP;
    
    // Header Section - Name and Contact (ATS-friendly format)
    currentY = this.addHeader(doc, data, currentY);
    
    // Professional Summary
    if (data.personal.summary) {
      currentY = this.addSection(doc, 'PROFESSIONAL SUMMARY', currentY);
      currentY = this.addText(doc, data.personal.summary, currentY, { 
        justify: true, 
        lineHeight: this.LINE_HEIGHT 
      });
      currentY += this.SECTION_SPACING;
    }
    
    // Work Experience (ATS format)
    if (data.workExperience.length > 0) {
      currentY = this.addSection(doc, 'PROFESSIONAL EXPERIENCE', currentY);
      currentY = this.addWorkExperience(doc, data.workExperience, currentY);
      currentY += this.SECTION_SPACING;
    }
    
    // Education
    if (data.education.length > 0) {
      currentY = this.addSection(doc, 'EDUCATION', currentY);
      currentY = this.addEducation(doc, data.education, currentY);
      currentY += this.SECTION_SPACING;
    }
    
    // Skills (ATS-optimized)
    if (data.skills.technical.length > 0 || data.skills.soft.length > 0) {
      currentY = this.addSection(doc, 'SKILLS', currentY);
      currentY = this.addSkills(doc, data.skills, currentY);
    }
    
    // Generate filename and save
    const fileName = `CV_${data.personal.firstName}_${data.personal.lastName}.pdf`;
    doc.save(fileName);
  }
  
  private static addHeader(doc: jsPDF, data: CVData, startY: number): number {
    let currentY = startY;
    
    // Name - Professional, bold, centered (matching preview exactly)
    doc.setFontSize(this.FONTS.name.size);
    doc.setFont('helvetica', this.FONTS.name.weight);
    const fullName = `${data.personal.firstName} ${data.personal.lastName}`.toUpperCase();
    const nameWidth = doc.getTextWidth(fullName);
    const centerX = (this.PAGE_WIDTH - nameWidth) / 2;
    doc.text(fullName, centerX, currentY);
    currentY += 8;
    
    // Professional Title - Medium, centered
    if (data.personal.professionalTitle) {
      doc.setFontSize(this.FONTS.title.size);
      doc.setFont('helvetica', this.FONTS.title.weight);
      const titleWidth = doc.getTextWidth(data.personal.professionalTitle);
      const titleCenterX = (this.PAGE_WIDTH - titleWidth) / 2;
      doc.text(data.personal.professionalTitle, titleCenterX, currentY);
      currentY += 6;
    }
    
    // Contact Information - Single line, centered, ATS-scannable
    doc.setFontSize(this.FONTS.contact.size);
    doc.setFont('helvetica', this.FONTS.contact.weight);
    const contactInfo = `${data.personal.email} | ${data.personal.phone}`;
    const contactWidth = doc.getTextWidth(contactInfo);
    const contactCenterX = (this.PAGE_WIDTH - contactWidth) / 2;
    doc.text(contactInfo, contactCenterX, currentY);
    currentY += 8;
    
    // Separator line (thinner, matching preview)
    doc.setDrawColor(160, 160, 160); // Gray color like preview
    doc.setLineWidth(0.3);
    doc.line(this.MARGIN_LEFT, currentY, this.PAGE_WIDTH - this.MARGIN_RIGHT, currentY);
    currentY += 8;
    
    return currentY;
  }
  
  private static addSection(doc: jsPDF, title: string, startY: number): number {
    // Check if we need a new page
    if (startY > this.PAGE_HEIGHT - 40) {
      doc.addPage();
      startY = this.MARGIN_TOP;
    }
    
    doc.setFontSize(this.FONTS.sectionHeader.size);
    doc.setFont('helvetica', this.FONTS.sectionHeader.weight);
    doc.text(title, this.MARGIN_LEFT, startY);
    
    // Underline for section headers (matching preview exactly)
    const titleWidth = doc.getTextWidth(title);
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.line(this.MARGIN_LEFT, startY + 1, this.MARGIN_LEFT + titleWidth, startY + 1);
    
    return startY + 7;
  }
  
  private static addText(doc: jsPDF, text: string, startY: number, options: { 
    justify?: boolean; 
    lineHeight?: number;
    indent?: number;
  } = {}): number {
    const maxWidth = this.PAGE_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT - (options.indent || 0);
    doc.setFontSize(this.FONTS.text.size);
    doc.setFont('helvetica', this.FONTS.text.weight);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    let currentY = startY;
    const lineHeight = options.lineHeight || this.LINE_HEIGHT;
    
    for (const line of lines) {
      if (currentY > this.PAGE_HEIGHT - 30) {
        doc.addPage();
        currentY = this.MARGIN_TOP;
      }
      
      doc.text(line, this.MARGIN_LEFT + (options.indent || 0), currentY);
      currentY += lineHeight;
    }
    
    return currentY + 2;
  }
  
  private static addWorkExperience(doc: jsPDF, experiences: any[], startY: number): number {
    let currentY = startY;
    
    for (const exp of experiences) {
      // Check for page break
      if (currentY > this.PAGE_HEIGHT - 60) {
        doc.addPage();
        currentY = this.MARGIN_TOP;
      }
      
      // Job Title and Company (exactly like preview: "Position | Company")
      doc.setFontSize(this.FONTS.jobTitle.size);
      doc.setFont('helvetica', this.FONTS.jobTitle.weight);
      const jobTitle = `${exp.position} | ${exp.company}`;
      doc.text(jobTitle, this.MARGIN_LEFT, currentY);
      
      // Dates (right-aligned, exactly like preview)
      doc.setFontSize(this.FONTS.dates.size);
      doc.setFont('helvetica', this.FONTS.dates.weight);
      const endDateText = exp.isCurrent ? 'Presente' : this.formatDate(exp.endDate);
      const dateText = `${this.formatDate(exp.startDate)} - ${endDateText}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, this.PAGE_WIDTH - this.MARGIN_RIGHT - dateWidth, currentY);
      currentY += 6;
      
      // Description with bullet points (exactly matching preview format)
      const description = exp.improvedDescription || exp.description;
      if (description) {
        doc.setFontSize(this.FONTS.bullet.size);
        doc.setFont('helvetica', this.FONTS.bullet.weight);
        
        const bulletPoints = description.split('\n').filter((line: string) => line.trim());
        
        for (const point of bulletPoints) {
          if (currentY > this.PAGE_HEIGHT - 25) {
            doc.addPage();
            currentY = this.MARGIN_TOP;
          }
          
          let cleanPoint = point.replace(/^[•\-*]\s*/, '').trim();
          if (cleanPoint) {
            // Add bullet point (gray like preview)
            doc.setTextColor(100, 100, 100);
            doc.text('•', this.MARGIN_LEFT + 3, currentY);
            
            // Add text with proper wrapping (black text)
            doc.setTextColor(0, 0, 0);
            const maxWidth = this.PAGE_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT - 8;
            const lines = doc.splitTextToSize(cleanPoint, maxWidth);
            
            for (let i = 0; i < lines.length; i++) {
              if (currentY > this.PAGE_HEIGHT - 25) {
                doc.addPage();
                currentY = this.MARGIN_TOP;
              }
              
              doc.text(lines[i], this.MARGIN_LEFT + 8, currentY);
              if (i < lines.length - 1) currentY += this.LINE_HEIGHT;
            }
            currentY += this.LINE_HEIGHT + 1;
          }
        }
      }
      
      currentY += 4; // Space between jobs (matching preview)
    }
    
    return currentY;
  }
  
  private static addEducation(doc: jsPDF, education: any[], startY: number): number {
    let currentY = startY;
    
    for (const edu of education) {
      if (currentY > this.PAGE_HEIGHT - 25) {
        doc.addPage();
        currentY = this.MARGIN_TOP;
      }
      
      // Degree and Institution (exactly like preview)
      doc.setFontSize(this.FONTS.jobTitle.size);
      doc.setFont('helvetica', this.FONTS.jobTitle.weight);
      doc.setTextColor(0, 0, 0);
      const eduTitle = `${edu.degree} | ${edu.institution}`;
      doc.text(eduTitle, this.MARGIN_LEFT, currentY);
      
      // Dates (right-aligned, exactly like preview)
      doc.setFontSize(this.FONTS.dates.size);
      doc.setFont('helvetica', this.FONTS.dates.weight);
      doc.setTextColor(100, 100, 100);
      const endDateText = edu.isCurrent ? 'Presente' : this.formatDate(edu.endDate);
      const dateText = `${this.formatDate(edu.startDate)} - ${endDateText}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, this.PAGE_WIDTH - this.MARGIN_RIGHT - dateWidth, currentY);
      
      currentY += 7;
    }
    
    return currentY;
  }
  
  private static addSkills(doc: jsPDF, skills: any, startY: number): number {
    let currentY = startY;
    doc.setTextColor(0, 0, 0);
    
    // Technical Skills (exactly like preview)
    if (skills.technical.length > 0) {
      doc.setFontSize(this.FONTS.text.size);
      doc.setFont('helvetica', 'bold');
      doc.text('Technical Skills: ', this.MARGIN_LEFT, currentY);
      
      // Get the width of the label to position the skills properly
      const labelWidth = doc.getTextWidth('Technical Skills: ');
      doc.setFont('helvetica', 'normal');
      
      const techSkills = skills.technical.join(', ');
      const maxWidth = this.PAGE_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT - labelWidth;
      const lines = doc.splitTextToSize(techSkills, maxWidth);
      
      // Position the first line right after the label
      doc.text(lines[0], this.MARGIN_LEFT + labelWidth, currentY);
      currentY += this.LINE_HEIGHT;
      
      // Add remaining lines if any
      for (let i = 1; i < lines.length; i++) {
        if (currentY > this.PAGE_HEIGHT - 25) {
          doc.addPage();
          currentY = this.MARGIN_TOP;
        }
        doc.text(lines[i], this.MARGIN_LEFT, currentY);
        currentY += this.LINE_HEIGHT;
      }
      currentY += 3;
    }
    
    // Soft Skills / Core Competencies (exactly like preview)
    if (skills.soft.length > 0) {
      doc.setFontSize(this.FONTS.text.size);
      doc.setFont('helvetica', 'bold');
      doc.text('Core Competencies: ', this.MARGIN_LEFT, currentY);
      
      const labelWidth = doc.getTextWidth('Core Competencies: ');
      doc.setFont('helvetica', 'normal');
      
      const softSkills = skills.soft.join(', ');
      const maxWidth = this.PAGE_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT - labelWidth;
      const lines = doc.splitTextToSize(softSkills, maxWidth);
      
      // Position the first line right after the label
      doc.text(lines[0], this.MARGIN_LEFT + labelWidth, currentY);
      currentY += this.LINE_HEIGHT;
      
      // Add remaining lines if any
      for (let i = 1; i < lines.length; i++) {
        if (currentY > this.PAGE_HEIGHT - 25) {
          doc.addPage();
          currentY = this.MARGIN_TOP;
        }
        doc.text(lines[i], this.MARGIN_LEFT, currentY);
        currentY += this.LINE_HEIGHT;
      }
    }
    
    return currentY;
  }
  
  private static formatDate(dateStr: string): string {
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
  }
}