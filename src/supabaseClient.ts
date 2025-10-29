import { createClient } from '@supabase/supabase-js';

// Comme pour la clé API Gemini, nous supposons que ces variables d'environnement 
// sont pré-configurées et disponibles dans le contexte d'exécution.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey) {
  // Affiche une erreur claire si les clés ne sont pas configurées, mais ne bloque pas l'application.
  console.error("Erreur de configuration : Les variables SUPABASE_URL et SUPABASE_ANON_KEY sont requises. Les fonctionnalités d'authentification seront désactivées.");
  supabaseInstance = null;
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;