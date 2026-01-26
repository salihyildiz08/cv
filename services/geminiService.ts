import { GoogleGenAI } from "@google/genai";

export const enhanceText = async (text: string, context: string): Promise<string> => {
  // Guidelines: API key must be obtained exclusively from process.env.API_KEY
  // Guidelines: Always use new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Updated to recommended model for text tasks
      contents: `You are a professional CV editor. Rewrite the following text to be more professional, concise, and impactful for a CV. 
      Context: ${context} (e.g., job description, summary, project details).
      Language: Turkish.
      
      Text to rewrite: "${text}"
      
      Return ONLY the rewritten text, no explanations.`,
    });

    // Guidelines: use response.text property directly.
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return text;
  }
};