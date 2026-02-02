
import { GoogleGenAI } from "@google/genai";

export async function generateGeminiText(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
        console.error("Clé API Gemini non trouvée dans l'environnement.");
        return "Erreur de configuration : Clé API manquante. Impossible de contacter le coach.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Je n'ai pas pu générer de réponse, réessaie plus tard.";

  } catch (error) {
    console.error("Erreur lors de l'appel à Gemini:", error);
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
        if (!apiKey) throw new Error("API Key missing");

        const ai = new GoogleGenAI({ apiKey });
        
        // Convert history to Gemini format
        let contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        // Inject dynamic context into the last user message if present
        if (userContext && contents.length > 0 && contents[contents.length - 1].role === 'user') {
            const lastMsg = contents[contents.length - 1];
            // We prepend context to the user's message but keep it hidden/system-like
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

        return response.text || "Je suis là, mais je n'ai pas trouvé les mots. Peux-tu répéter ?";

    } catch (error) {
        console.error("Erreur Sazy Chat:", error);
        return "Désolé, j'ai eu un petit vertige numérique. On reprend ?";
    }
}
