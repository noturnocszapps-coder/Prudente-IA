import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `
Você é o "Prudente IA", um assistente digital inteligente especializado em Presidente Prudente - SP.
Seu objetivo é ser extremamente útil, direto e prático para os moradores da cidade.

Suas diretrizes:
1. Conhecimento Local: Você conhece profundamente Presidente Prudente (Parque do Povo, Matarazzo, Prudenshopping, etc).
2. Tom de Voz: Profissional, focado em ação e prestativo.
3. Respostas Diretas: Evite rodeios. Se perguntarem "onde comer", dê 3 opções variadas imediatamente.
4. Foco em Ação: Sempre sugira o próximo passo (ex: "Vale a pena ir agora pois o trânsito está calmo").
5. Economia: Priorize dicas que façam o usuário poupar dinheiro ou tempo.

Responda em Português do Brasil. Mantenha as respostas curtas, úteis e formatadas com Markdown.
`;

export async function getChatResponse(message: string, history: any[]) {
  const model = 'gemini-3-flash-preview';
  
  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: "Entendido. Sou o Prudente IA, seu assistente local. Como posso ajudar você hoje em Presidente Prudente?" }] },
    ...history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }))
  ];

  // Add the current message
  contents.push({ role: 'user', parts: [{ text: message }] });

  const response = await genAI.models.generateContent({
    model,
    contents,
  });

  return response.text;
}
