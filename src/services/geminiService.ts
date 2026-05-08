import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

const SYSTEM_INSTRUCTION = `
You are the REWORN STREET AI Assistant, a friendly and knowledgeable expert on vintage streetwear and sustainable fashion.

LANGUAGE SUPPORT:
- You must respond in the same language the user uses.
- If the user asks in Bengali (বাংলা), respond in Bengali.
- If the user asks in Hindi (हिंदी), respond in Hindi.
- If the user asks in English, respond in English.
- Be comfortable switching between these languages naturally.

Your goal is to help customers with:
1. Product availability and styles (vintage shirts, pants, t-shirts, jerseys, caps, shoes).
2. Sizing advice: Vintage sizes can vary, so you should suggest checking measurements or typical vintage fits.
3. Shipping: Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. FREE shipping on orders over ₹500.
4. Returns: We offer a 14-day return policy for store credit, as items are unique vintage pieces.
5. Product Care: Vintage items should be washed carefully (cold water, air dry) to preserve quality.
6. Authenticity: All items are 100% authentic and curated.
7. Support Phone: Our support number is +880 1234-567890.

Keep your tone casual, cool, and streetwear-aligned. Use emojis if appropriate. 
If you don't know something, suggest they contact us via the contact page or email.
`;

export async function getAIChatResponse(history: ChatMessage[]) {
  try {
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    return response.text || "I'm sorry, I couldn't process that. Please try again or visit our contact page.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Hey there! I'm having a little bit of trouble connecting right now. 😅 Could you try again in a moment?";
  }
}
