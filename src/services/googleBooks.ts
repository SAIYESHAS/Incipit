import { GoogleGenAI, Type } from "@google/genai";

export interface GoogleBook {
  id: string;
  isAIGenerated?: boolean;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    summary?: string;
    audience?: string;
    ageRating?: string;
    categories?: string[];
    pageCount?: number;
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    imageLinks?: {
      thumbnail: string;
    };
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    previewLink?: string;
  };
}

export async function searchGlobalBooks(query: string, maxResults: number = 20): Promise<GoogleBook[]> {
  if (!query.trim()) return [];
  
  try {
    console.log(`Searching AI Global Hub for: ${query}`);
    const aiResults = await geminiSearchFallback(query, maxResults);
    return aiResults || [];
  } catch (error) {
    console.error('Global AI Search Error:', error);
    return [];
  }
}

export async function searchBhavansBooks(maxResults: number = 20): Promise<GoogleBook[]> {
  try {
    console.log(`Fetching Bharatiya Vidya Bhavan (bhavans.info) collection...`);
    const aiResults = await geminiSearchFallback("books published by Bharatiya Vidya Bhavan bhavans.info", maxResults);
    return aiResults || [];
  } catch (error) {
    console.error('Bhavans Search Error:', error);
    return [];
  }
}

async function geminiSearchFallback(query: string, maxResults: number): Promise<GoogleBook[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key not configured for AI Hub");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for real books matching the query: "${query}". 
      Focus on finding books that are popular or available on platforms like Kindle and Goodreads.
      For each book, you MUST provide:
      1. A compelling, detailed description (full overview).
      2. A concise summary (approx 200 characters).
      3. A note on "Who will like this" (target audience/themes).
      4. An appropriate age rating (e.g., General, Young Adult, Mature).
      5. The ISBN-13 if available.
      Return up to ${maxResults} items.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
       async function geminiSearchFallback(query: string, maxResults: number): Promise<GoogleBook[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key not configured for AI Hub");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Search for real books matching the query: "${query}". 
    Return a JSON object with an "items" array. 
    Each item must have: id, volumeInfo { title, authors[], description, summary, audience, ageRating, industryIdentifiers[{type, identifier}] }. 
    Return up to ${maxResults} items.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const dataText = response.text(); // FIX: Added () to call the function

    try {
      // FIX: Removed spaces from regex /```json|```/g
      const cleanedJson = dataText.replace(/```json|```/g, "").trim();
      const data = JSON.parse(cleanedJson);

      if (data.items) {
        return data.items.map((item: any) => {
          const isbn13 = item.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier;
          const isbn10 = item.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier;
          const isbn = isbn13 || isbn10;
          
          let coverUrl = `https://picsum.photos/seed/${encodeURIComponent(item.volumeInfo.title)}/400/600`;
          if (isbn) {
            coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
          }

          return {
            ...item,
            isAIGenerated: true,
            volumeInfo: {
              ...item.volumeInfo,
              imageLinks: { thumbnail: coverUrl }
            }
          };
        });
      }
    } catch (parseError) {
      console.error("JSON Parsing Error. Raw response:", dataText);
      return []; 
    }
  } catch (error: any) {
    if (error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED") {
      console.error("Gemini Quota Exceeded. Try again in a minute.");
    } else {
      console.error("Gemini fallback error:", error);
    }
  }
  return null;
}

export async function getGlobalBookById(id: string): Promise<GoogleBook | null> {
  return null;
}
