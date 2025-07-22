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
Transforma la siguiente descripción de trabajo coloquial en una descripción profesional para CV usando el formato Harvard. 

Información del trabajo:
- Cargo: ${position}
- Empresa: ${company}
- Descripción original: "${description}"

Instrucciones:
1. Usa verbos de acción en pasado (desarrollé, implementé, lideré, optimicé, etc.)
2. Incluye logros cuantificables cuando sea posible (porcentajes, números, métricas)
3. Enfócate en resultados e impacto
4. Mantén un tono profesional pero natural
5. Máximo 3-4 líneas
6. No inventes datos específicos, pero sugiere el tipo de métricas que se podrían incluir

Responde SOLO con la descripción mejorada, sin explicaciones adicionales.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
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
Transforma el siguiente resumen personal coloquial en un resumen profesional para CV.

Título profesional: ${professionalTitle}
Resumen original: "${summary}"

Instrucciones:
1. Mantén el tono profesional pero personalizado
2. Destaca fortalezas y valor agregado
3. Máximo 3-4 líneas
4. Enfócate en lo que aporta al empleador
5. Usa un lenguaje activo y convincente

Responde SOLO con el resumen mejorado, sin explicaciones adicionales.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || summary;
    } catch (error) {
      console.error('Error mejorando resumen:', error);
      return summary;
    }
  }
}

export const openaiService = OpenAIService.getInstance();