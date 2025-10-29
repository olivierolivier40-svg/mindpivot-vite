import { GoogleGenAI } from "@google/genai";

// Ceci est une fonction serverless (API serverless) compatible avec des plateformes comme Vercel ou Netlify.
// Elle agit comme un proxy sécurisé pour l'API Gemini.
// La clé API_KEY doit être configurée comme une variable d'environnement sur le serveur de déploiement.

// La signature (req, res) est une convention courante.
// `req` contient le corps de la requête avec le JSON analysé.
// `res` fournit des méthodes comme `status()` et `json()` pour construire la réponse.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // La clé API est lue depuis les variables d'environnement du serveur, JAMAIS depuis le client.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("Clé API Gemini non configurée sur le serveur.");
      return res.status(500).json({ error: 'Le service IA n\'est pas configuré.' });
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    
    return res.status(200).json({ text });

  } catch (error) {
    console.error("Erreur dans la fonction serverless Gemini:", error);
    return res.status(500).json({ error: 'Échec de la réponse de l\'IA.' });
  }
}
