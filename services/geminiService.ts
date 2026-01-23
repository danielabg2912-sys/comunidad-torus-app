import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SierraActivity } from '../types';

type SierraActivityIdea = Omit<SierraActivity, 'id' | 'imageUrl' | 'content'>;

// Initialize lazily to avoid crash if env var is missing during build/load
const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    throw new Error("Gemini API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

const schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'The creative title of the activity in Spanish.'
    },
    summary: {
      type: Type.STRING,
      description: 'A short, engaging summary of the activity in Spanish.'
    },
    highlights: {
      type: Type.ARRAY,
      description: 'A list of 2-3 key highlight points for the activity, in Spanish.',
      items: {
        type: Type.STRING
      }
    }
  },
  required: ['title', 'summary', 'highlights']
};

export async function generateSierraActivityIdea(): Promise<SierraActivityIdea | null> {
  try {
    const ai = getAiClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a creative and appealing new activity idea for a section called 'Actividades en la Sierra'. The target audience is a community interested in wellness, nature, and Mexican cannabis culture. The response must be in Spanish. Provide a title, a short summary, and 2 to 3 key highlight points.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text.trim();
    if (!text) {
      console.error("Gemini API returned an empty response.");
      return null;
    }

    const generatedIdea: SierraActivityIdea = JSON.parse(text);
    return generatedIdea;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error('Failed to generate idea from Gemini API.');
  }
}
