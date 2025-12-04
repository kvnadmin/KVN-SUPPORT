import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Ticket, TicketCategory, TicketPriority } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Interfaces for AI responses
interface TicketAnalysis {
  category: TicketCategory;
  priority: TicketPriority;
  summary: string;
  suggestedFixes: string[];
}

export const analyzeTicket = async (title: string, description: string): Promise<TicketAnalysis> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock analysis.");
    return {
      category: TicketCategory.OTHER,
      priority: TicketPriority.MEDIUM,
      summary: "API Key missing. Could not analyze.",
      suggestedFixes: ["Check API configuration."]
    };
  }

  const prompt = `
    Analyze the following IT support ticket.
    Title: ${title}
    Description: ${description}

    Provide the following in JSON format:
    1. Category (Hardware, Software, Network, Access, Other)
    2. Priority (Low, Medium, High, Critical) - base this on urgency and impact.
    3. A concise summary of the issue (max 15 words).
    4. An array of 3 distinct, actionable troubleshooting steps or suggested fixes.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, enum: Object.values(TicketCategory) },
      priority: { type: Type.STRING, enum: Object.values(TicketPriority) },
      summary: { type: Type.STRING },
      suggestedFixes: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      }
    },
    required: ["category", "priority", "summary", "suggestedFixes"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2, // Low temperature for deterministic classification
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TicketAnalysis;

  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback default
    return {
      category: TicketCategory.OTHER,
      priority: TicketPriority.MEDIUM,
      summary: title,
      suggestedFixes: ["Manual triage required."]
    };
  }
};

export const generateDraftReply = async (ticket: Ticket): Promise<string> => {
  if (!apiKey) return "Please configure API Key for AI features.";

  const prompt = `
    You are a helpful and professional IT Support Agent.
    Draft a reply to this ticket.
    
    Ticket Details:
    Title: ${ticket.title}
    Description: ${ticket.description}
    Current Status: ${ticket.status}
    Category: ${ticket.category}
    
    History:
    ${ticket.comments.map(c => `${c.userName}: ${c.content}`).join('\n')}

    Instructions:
    - Be polite and empathetic.
    - If the issue is critical, assure them it is being looked at immediately.
    - If info is missing, ask for it.
    - Keep it concise (under 100 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7
      }
    });
    return response.text || "Could not generate draft.";
  } catch (error) {
    console.error("Draft generation failed:", error);
    return "Error generating draft.";
  }
};
