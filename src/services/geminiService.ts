
import { GoogleGenAI } from "@google/genai";

export async function generateGeminiText(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
        console.error("Clé API Gemini non trouvée dans l'environnement (generateGeminiText).");
        return "Erreur de configuration : Clé API manquante. Impossible de contacter le coach.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Je n'ai pas pu générer de réponse, réessaie plus tard.";

  } catch (error) {
    console.error("Erreur lors de l'appel à Gemini (generateGeminiText):", error);
    return "Désolé, une erreur est survenue lors de la communication avec l'IA. Vérifie ta connexion et réessaie.";
  }
}

export async function generateSazyChat(
    history: { role: 'user' | 'model'; text: string }[],
    systemInstruction: string,
    userContext?: string
): Promise<string> {
    try {
        const apiKey = process.env.API_KEY;
        // Debug log pour vérifier si la clé est présente (ne pas logger la clé elle-même en prod)
        if (!apiKey) {
            console.error("SAZY ERROR: API Key missing in process.env.API_KEY");
            throw new Error("API Key missing");
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Convert history to Gemini format
        let contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        // Inject dynamic context into the last user message if present
        if (userContext && contents.length > 0 && contents[contents.length - 1].role === 'user') {
            const lastMsg = contents[contents.length - 1];
            lastMsg.parts[0].text = `[Info Système - Contexte Utilisateur Caché : ${userContext}]\n\n${lastMsg.parts[0].text}`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7, 
            }
        });

        if (!response || !response.text) {
            console.error("SAZY ERROR: Empty response from Gemini");
            throw new Error("Empty response");
        }

        return response.text;

    } catch (error: any) {
        console.error("--------------------------------");
        console.error("SAZY FATAL ERROR DETAILS:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        if (error.response) console.error("Response data:", error.response);
        console.error("--------------------------------");
        return "Désolé, j'ai eu un petit vertige numérique (Erreur API). Vérifie la console pour les détails techniques.";
    }
}
