import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
}

// FIX: Update function signature to remove apiKey parameter and use process.env.API_KEY instead.
export async function analyzeSkin(imageBase64: string): Promise<AnalysisResult> {
  // The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';
  const imageMimeType = "image/jpeg";

  // FIX: Updated prompt to be more concise for use with responseSchema.
  const prompt = `
    Analyze the provided user's selfie. You are an expert virtual dermatologist named 'EverGlow AI'.
    Your task is to identify the skin type, point out up to 3 common skin concerns, and create a personalized AM/PM skincare regimen with 3-5 affordable product recommendations. Be gentle and positive in your language.
  `;

  const imagePart = fileToGenerativePart(imageBase64.split(',')[1], imageMimeType);

  try {
    // FIX: Use responseSchema to enforce JSON output.
    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    skinType: { type: Type.STRING },
                    skinIssues: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    },
                    amRoutine: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                step: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ["step", "description"],
                        },
                    },
                    pmRoutine: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                step: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ["step", "description"],
                        },
                    },
                    productRecommendations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                productType: { type: Type.STRING },
                                name: { type: Type.STRING },
                                reason: { type: Type.STRING },
                            },
                            required: ["productType", "name", "reason"],
                        },
                    },
                },
                required: ["skinType", "skinIssues", "amRoutine", "pmRoutine", "productRecommendations"],
            },
        }
    });

    // FIX: Simplified response handling as responseSchema guarantees valid JSON.
    const result: AnalysisResult = JSON.parse(response.text);
    return result;

  } catch (error) {
    console.error("Error analyzing skin with Gemini API:", error);
    
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('api key not valid')) {
            // FIX: Updated error message as API key is now from environment variables.
            throw new Error("The API Key configured in the environment is invalid. Please contact the administrator.");
        }
        if (message.includes('failed to fetch')) {
            throw new Error("A network error occurred. Please check your internet connection and try again.");
        }
    }

    throw new Error("An unknown error occurred during analysis. The service may be temporarily unavailable.");
  }
}
