import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function extractTextFromImage(
  imageData: string,
  mimeType: string
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const base64Data = imageData.split(',')[1] || imageData;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract all text from this image. Focus on handwritten content and provide accurate transcription. Return only the extracted text without any additional commentary or description.",
            },
          ],
        },
      ],
    });

    return response.text || "No text could be extracted from the image.";
  } catch (error) {
    console.error("Gemini OCR error:", error);
    throw new Error(`Failed to extract text: ${error}`);
  }
}
