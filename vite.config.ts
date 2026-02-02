
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement basées sur le mode actuel (développement, production...)
  // Le troisième argument '' signifie qu'on charge toutes les variables, pas seulement celles préfixées par VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // On expose la clé API sur process.env.API_KEY pour que le code de l'app fonctionne
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY),
    },
  }
})
