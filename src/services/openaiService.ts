import OpenAI from 'openai';

class OpenAIService {
  private openai: OpenAI | null = null;
  private static instance: OpenAIService;

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  setApiKey(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
    localStorage.setItem('openai_api_key', apiKey);
  }

  getApiKey(): string | null {
    return localStorage.getItem('openai_api_key');
  }

  hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  initialize() {
    const apiKey = this.getApiKey();
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  async improveDescription(description: string, position: string, company: string): Promise<string> {
    if (!this.openai) {
      throw new Error('API Key no configurada');
    }

    const prompt = `
Transforma la siguiente descripción de trabajo en una descripción profesional para CV optimizada para ATS usando mejores prácticas.

Información del trabajo:
- Cargo: ${position}
- Empresa: ${company}
- Descripción original: "${description}"

Instrucciones específicas para ATS:
1. Usa verbos de acción potentes al inicio de cada bullet point (Desarrollé, Implementé, Lideré, Optimicé, Gestioné, Coordiné, etc.)
2. Incluye logros cuantificables con números, porcentajes o métricas específicas
3. Incorpora palabras clave relevantes para la industria
4. Enfócate en resultados e impacto empresarial
5. Formato de bullet points separados por salto de línea
6. Máximo 4 bullet points
7. Cada punto debe ser específico y orientado a resultados

Ejemplo de formato:
• Desarrollé e implementé [proyecto/sistema] que resultó en [métrica específica]
• Lideré equipo de [número] personas mejorando [proceso] en [porcentaje]%
• Optimicé [proceso/sistema] reduciendo [métrica] en [cantidad/porcentaje]

Responde SOLO con los bullet points mejorados, sin explicaciones adicionales.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || description;
    } catch (error) {
      console.error('Error mejorando descripción:', error);
      return description;
    }
  }

  async improveSummary(summary: string, professionalTitle: string): Promise<string> {
    if (!this.openai) {
      throw new Error('API Key no configurada');
    }

    const prompt = `
Transforma el siguiente resumen personal en un resumen profesional optimizado para ATS y reclutadores.

Título profesional: ${professionalTitle}
Resumen original: "${summary}"

Instrucciones específicas:
1. Mantén un tono profesional pero convincente
2. Destaca fortalezas clave y valor agregado único
3. Incluye palabras clave relevantes para la industria
4. Enfócate en lo que aporta al empleador
5. Menciona años de experiencia si es relevante
6. Máximo 3-4 líneas concisas
7. Usa lenguaje activo y orientado a resultados
8. Evita clichés como "trabajador en equipo" sin contexto

El resumen debe responder: ¿Qué valor aporto? ¿Cuáles son mis fortalezas principales? ¿Por qué me debería contratar?

Responde SOLO con el resumen mejorado, sin explicaciones adicionales.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || summary;
    } catch (error) {
      console.error('Error mejorando resumen:', error);
      return summary;
    }
  }

  async improveProfessionalTitle(title: string, industry?: string): Promise<string> {
    if (!this.openai || !title.trim()) {
      return title;
    }

    const prompt = `
Mejora el siguiente título profesional para que sea más impactante y específico para un CV.

Título original: "${title}"
${industry ? `Industria: ${industry}` : ''}

Instrucciones:
1. Hazlo más específico y profesional
2. Usa terminología estándar de la industria
3. Evita jerga coloquial
4. Máximo 6 palabras
5. Debe ser claro para reclutadores y ATS

Ejemplos:
- "programador" → "Desarrollador de Software Senior"
- "vendedor" → "Especialista en Ventas B2B"
- "diseñador" → "Diseñador UX/UI"

Responde SOLO con el título mejorado, sin explicaciones adicionales.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
        temperature: 0.5,
      });

      return response.choices[0]?.message?.content?.trim() || title;
    } catch (error) {
      console.error('Error mejorando título:', error);
      return title;
    }
  }

  async improveSkills(skills: string[], category: 'technical' | 'soft'): Promise<string[]> {
    if (!this.openai || skills.length === 0) {
      return skills;
    }

    const prompt = `
Mejora y optimiza la siguiente lista de habilidades ${category === 'technical' ? 'técnicas' : 'blandas'} para un CV profesional.

Habilidades originales: ${skills.join(', ')}

Instrucciones para habilidades ${category === 'technical' ? 'técnicas' : 'blandas'}:
${category === 'technical' ? `
1. Usa nombres específicos y versiones cuando sea relevante
2. Agrupa tecnologías relacionadas si es apropiado
3. Usa terminología estándar de la industria
4. Incluye frameworks, herramientas y metodologías
5. Ordena por relevancia/demanda del mercado
` : `
1. Usa términos profesionales y específicos
2. Evita clichés genéricos
3. Enfócate en competencias medibles
4. Usa lenguaje que demuestre nivel senior
5. Incluye soft skills valoradas en el mercado actual
`}

Devuelve máximo 8 habilidades mejoradas.
Responde SOLO con la lista separada por comas, sin explicaciones adicionales.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.6,
      });

      const improvedSkills = response.choices[0]?.message?.content?.trim();
      if (improvedSkills) {
        return improvedSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }
      return skills;
    } catch (error) {
      console.error('Error mejorando habilidades:', error);
      return skills;
    }
  }

  async improveEducationDescription(degree: string, institution: string): Promise<string> {
    if (!this.openai || !degree.trim()) {
      return degree;
    }

    const prompt = `
Mejora la siguiente información educativa para un CV profesional.

Título original: "${degree}"
Institución: "${institution}"

Instrucciones:
1. Usa terminología formal y estándar
2. Incluye el nivel específico (Licenciatura, Maestría, etc.)
3. Corrige abreviaciones informales
4. Mantén la precisión pero mejora la presentación

Ejemplo: "ing sistemas" → "Ingeniería en Sistemas de Información"

Responde SOLO con el título mejorado, sin explicaciones adicionales.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 80,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content?.trim() || degree;
    } catch (error) {
      console.error('Error mejorando educación:', error);
      return degree;
    }
  }
}

export const openaiService = OpenAIService.getInstance();