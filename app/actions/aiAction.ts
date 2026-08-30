"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function generateTextAction(prompt: string): Promise<string> {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });
    console.log("output is " + interaction.output_text);
    return interaction.output_text || "no output generated";
  } catch (error) {
    console.error("Error generating text:", error);
    return "Error generating text: " + (error as Error).message;
  }
}

