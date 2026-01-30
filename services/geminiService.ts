
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export const getInventoryInsights = async (products: Product[], query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const productDataSummary = products.map(p => 
    `${p.name} (${p.category}): Stock ${p.stock}, Price $${p.price}, Status ${p.status}`
  ).join('\n');

  const systemPrompt = `You are JZ9 AI, an expert inventory strategist. 
  You are analyzing the current inventory:
  ${productDataSummary}
  
  Provide a concise, professional, and actionable insight based on the user's question. 
  Focus on identifying low stock risks, high-value opportunities, or stock imbalances.
  Use a professional business tone.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });
    
    return response.text || "I couldn't generate an insight at this moment.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Failed to connect to JZ9 AI intelligence.";
  }
};