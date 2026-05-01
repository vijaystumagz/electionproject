/**
 * @file ai.ts
 * @description Utility for interacting with Google Gemini AI models directly from the client.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY || '';

// Initialize the Gemini AI SDK with the provided API key
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Calls Gemini AI to get a dynamic response for election-related questions.
 * 
 * @param {string} prompt - The user's input message/question.
 * @returns {Promise<string>} - A promise that resolves to the AI-generated text response.
 * @throws {Error} - Logs error to console if API call fails.
 */
export const getAIResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY || API_KEY.includes('PLACEHOLDER')) {
    return "AI is currently in simulation mode. (Please provide a VITE_GOOGLE_AI_KEY in your .env to enable live Gemini responses).";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    /**
     * System instruction to constrain the AI's behavior and maintain non-partisanship.
     */
    const systemInstruction = `
      You are Elexia, a helpful and neutral Election Assistant. 
      Your goal is to help users understand the voting process, deadlines, and registration. 
      Keep responses concise, accurate, and non-partisan. 
      If a question is not about elections or voting, politely redirect the user back to election topics.
    `;

    const result = await model.generateContent([systemInstruction, prompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("[Gemini AI Error]", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again or select an option from the menu.";
  }
};
