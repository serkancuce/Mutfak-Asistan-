
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // Perhaps disable the functionality and show a message to the user.
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: { type: Type.STRING, description: 'Tarifin adı.' },
      difficulty: { type: Type.STRING, enum: ['Kolay', 'Orta', 'Zor'], description: 'Tarifin zorluk seviyesi.' },
      prepTime: { type: Type.STRING, description: 'Tahmini hazırlık süresi (örn: "30 dakika").' },
      calories: { type: Type.INTEGER, description: 'Porsiyon başına tahmini kalori miktarı.' },
      ingredients: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Tarif için gerekli malzemelerin listesi.',
      },
      instructions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Tarifin hazırlanışı için adım adım talimatlar.',
      },
      dietaryRestrictions: {
        type: Type.ARRAY,
        items: { type: Type.STRING, enum: ['Vejetaryen', 'Keto', 'Glutensiz', 'Vegan'] },
        description: 'Tarifin uygun olduğu diyet kısıtlamaları (örn: ["Vejetaryen", "Glutensiz"]). Eğer hiçbiri yoksa boş bir dizi döndür.',
      },
    },
    required: ['recipeName', 'difficulty', 'prepTime', 'calories', 'ingredients', 'instructions', 'dietaryRestrictions'],
  },
};

export const analyzeImageAndSuggestRecipes = async (base64Image: string): Promise<Recipe[]> => {
  try {
    const prompt = `
      Sen uzman bir şef ve mutfak asistanısın. Bu buzdolabı fotoğrafındaki malzemeleri analiz et.
      1. Görüntüdeki tüm yenilebilir malzemeleri tanımla.
      2. Bu malzemeleri kullanarak hazırlanabilecek 3 ila 5 adet çeşitli ve lezzetli yemek tarifi öner.
      3. Her tarif için zorluk seviyesi, hazırlık süresi, porsiyon başına kalori, gerekli malzemeler listesi, adım adım talimatlar ve uygun olduğu diyet kısıtlamalarını (Vejetaryen, Keto, Glutensiz, Vegan) belirt.
      4. Eğer bir tarif herhangi bir diyet kısıtlamasına uymuyorsa, dietaryRestrictions alanı için boş bir dizi döndür.
      5. Cevabını yalnızca sağlanan JSON şemasına uygun olarak formatla. Başka hiçbir metin ekleme.
    `;

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      }
    });

    const jsonText = response.text.trim();
    const recipes = JSON.parse(jsonText) as Recipe[];
    return recipes;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get recipes from Gemini API.");
  }
};
