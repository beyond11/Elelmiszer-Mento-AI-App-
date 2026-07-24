import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up json parsing with generous limit for photo uploads
app.use(express.json({ limit: "15mb" }));

// Lazy initializer for Gemini API client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in your Secrets settings.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API Route for recipe and food analysis using Gemini
app.post("/api/analyze-food", async (req, res) => {
  try {
    const { image, textInput, existingIngredients } = req.body;
    
    let parts: any[] = [];
    
    // Add image if provided
    if (image) {
      // Expect base64 data string like "data:image/png;base64,iVBORw0KG..."
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      } else {
        // Fallback for simple base64 strings
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: image
          }
        });
      }
    }
    
    // Construct rich expert prompt in Hungarian
    let prompt = `Te egy professzionális magyar konyhaművészeti és élelmiszer-pazarlás elleni szakértő (gastro-mentor AI) vagy. `;
    prompt += `A felhasználó beküldött egy képet vagy leírást a háztartásában felhalmozott, kidobásra váró vagy maradék élelmiszerekről, alapanyagokról.\n\n`;
    
    if (textInput) {
      prompt += `Felhasználói megjegyzések/leírás az alapanyagokról: "${textInput}"\n`;
    }
    if (existingIngredients && existingIngredients.length > 0) {
      prompt += `Megjelölt korábbi alapanyagok: ${existingIngredients.join(", ")}\n`;
    }
    
    prompt += `\nKérlek végezd el az alábbiakat magyar nyelven:
1. Azonosítsd be a képen látható vagy leírt alapanyagokat (detectedItems).
2. Készíts egy kreatív és praktikus heti étkezési terv javaslatot (mealPlan) belőlük vagy azok bevonásával.
3. Adj meg legalább 2-3 részletes receptet (recipes) lépésről lépésre, amelyek prioritásként használják fel ezeket az alapanyagokat, minimális egyéb alapanyag szükséglettel.
4. Becsüld meg, hogy az újrahasznosítással és megmentéssel mennyi pénzt takarít meg a felhasználó a családi kasszának forintban (savingsHuf) (figyelembe véve Magyarország átlagos árait).
5. Számold ki a megmentett élelmiszer alapján, hány kilogramm CO2 ökológiai lábnyom-csökkenést ér el (carbonSavedKg), pl. 1.5-3.0 kg körüli reális értékekkel.
6. Adj 2-3 kiváló gyakorlati tárolási vagy élelmiszer-mentési tippet (practicalTips).`;

    parts.push({ text: prompt });

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Az alapanyag magyar neve" },
                  quantityRating: { type: Type.STRING, description: "A tapasztalt/becsült mennyiség (pl. 'fél darab', 'kb. 300g', 'pár szem')" },
                  condition: { type: Type.STRING, description: "Állapot (pl. 'érett', 'nyers', 'kissé száraz', 'maradék')" }
                },
                required: ["name"]
              }
            },
            mealPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealName: { type: Type.STRING, description: "Az étkezés neve (pl: 'Hétfő Ebéd', 'Kedd Vacsora', 'Szombati snack')" },
                  recipeTitle: { type: Type.STRING, description: "Az ajánlott étel neve" },
                  description: { type: Type.STRING, description: "Rövid indoklás vagy leírás, hogyan hasznosítja a maradékot" }
                },
                required: ["mealName", "recipeTitle", "description"]
              }
            },
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "A recept magyar címe" },
                  prepTime: { type: Type.STRING, description: "Elkészítési idő (pl. '25 perc')" },
                  difficulty: { type: Type.STRING, description: "Nehézség (pl. 'Könnyű', 'Közepes')" },
                  ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Megmentett alapanyagok listája" },
                  otherNeeded: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Egyéb otthon lévő alapvető hozzávalók (pl. só, olaj, liszt)" },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recept lépései sorrendben" }
                },
                required: ["title", "prepTime", "difficulty", "ingredientsUsed", "steps"]
              }
            },
            savingsHuf: { type: Type.INTEGER, description: "Becsült megtakarított összeg Forintban (pl. 2400)" },
            carbonSavedKg: { type: Type.NUMBER, description: "Megtakarított ökológiai lábnyom kg CO2-ben kifejezve, tizedesjegy pontossággal (pl. 2.4)" },
            practicalTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Magyar nyelvű hasznos tárolási tippek" }
          },
          required: ["detectedItems", "mealPlan", "recipes", "savingsHuf", "carbonSavedKg", "practicalTips"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Failed to generate response from Gemini AI.");
    }
    
    const parsedData = JSON.parse(resultText.trim());
    return res.json(parsedData);

  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return res.status(500).json({ 
      error: error.message || "Hiba történt az AI elemzés során.",
      details: error.stack
    });
  }
});

// Setup server with Vite or static production assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
