
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
// Note : Pour un déploiement sécurisé en production, utilisez des variables d'environnement (process.env.VITE_SUPABASE_URL).
const supabaseUrl = "https://irxzkwkezqccgactbiqd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeHprd2tlenFjY2dhY3RiaXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODU4MDksImV4cCI6MjA4MDg2MTgwOX0.Xfqf4SHciIf6sCnwsQ4oaw1PvHJ7vf9U4jWybbEW5Nc";

let supabaseInstance = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erreur de configuration : Les clés Supabase sont manquantes.");
} else {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Erreur critique lors de l'initialisation de Supabase:", error);
    // On laisse instance à null pour que l'app continue de fonctionner en mode "local/invité"
    supabaseInstance = null;
  }
}

export const supabase = supabaseInstance;
