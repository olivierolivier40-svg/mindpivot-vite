// Ce service agit comme une interface côté client pour notre API backend.
// Il masque les détails d'implémentation de la communication avec le serveur.

export async function generateGeminiText(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `La requête a échoué avec le statut ${response.status}`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API proxy Gemini:", error);
    // Retourne un message d'erreur convivial en français.
    return "Désolé, une erreur est survenue lors de la communication avec l'IA. Veuillez réessayer.";
  }
}
