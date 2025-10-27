
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    diarizedTranscript: {
      type: Type.ARRAY,
      description: "The transcript of the conversation, with each part attributed to 'Salesperson' or 'Prospect'.",
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, description: "The speaker, either 'Salesperson' or 'Prospect'." },
          text: { type: Type.STRING, description: "The spoken text." }
        },
        required: ['speaker', 'text']
      }
    },
    sentimentAnalysis: {
      type: Type.ARRAY,
      description: "An analysis of the prospect's engagement level throughout the call. Provide a data point for every 10% of the call's duration.",
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.INTEGER, description: "The point in the call as a percentage (0, 10, 20, ..., 100)." },
          engagement: { type: Type.NUMBER, description: "The prospect's engagement score from 1 (low) to 10 (high)." }
        },
        required: ['time', 'engagement']
      }
    },
    coachingCard: {
      type: Type.OBJECT,
      description: "Actionable feedback for the salesperson.",
      properties: {
        whatWentWell: {
          type: Type.ARRAY,
          description: "A list of exactly 3 things the salesperson did well.",
          items: { type: Type.STRING }
        },
        missedOpportunities: {
          type: Type.ARRAY,
          description: "A list of exactly 3 areas for improvement or missed opportunities.",
          items: { type: Type.STRING }
        }
      },
      required: ['whatWentWell', 'missedOpportunities']
    }
  },
  required: ['diarizedTranscript', 'sentimentAnalysis', 'coachingCard']
};

export const analyzeCallTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `
        Analyze the following sales call transcript. You are a world-class sales coach.
        Your task is to provide a detailed analysis in JSON format.
        Identify the two speakers and label them consistently as 'Salesperson' and 'Prospect'.
        
        Transcript:
        ---
        ${transcript}
        ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const jsonText = result.text.trim();
    const parsedResult = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object matches the expected structure
    if (
        !parsedResult.diarizedTranscript ||
        !parsedResult.sentimentAnalysis ||
        !parsedResult.coachingCard
    ) {
        throw new Error("Analysis result is missing required fields.");
    }
    
    return parsedResult as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing transcript with Gemini:", error);
    throw new Error("Failed to get analysis from AI. Please check the transcript and try again.");
  }
};
