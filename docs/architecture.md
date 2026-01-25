# Architecture de StopAndZen

Ce document décrit l'architecture générale de l'application StopAndZen, les choix technologiques et la structure des données.

## Stack Technologique

- **Framework** : React 19 (via importmap)
- **Langage** : TypeScript (fichiers `.tsx`)
- **Styling** : Tailwind CSS avec configuration en ligne et un système de variables CSS pour les thèmes.
- **Données Locales** : `localStorage` du navigateur pour la persistance des sessions, badges, préférences, etc.
- **IA Générative** : Google Gemini API (`@google/genai`) pour les feedbacks personnalisés et la génération d'intentions.

## Structure des Fichiers

Le projet est organisé de la manière suivante :

- `index.html`: Point d'entrée de l'application, charge les scripts, les polices et la configuration Tailwind.
- `index.tsx`: Initialise l'application React et la monte dans le DOM.
- `App.tsx`: Le composant principal qui gère l'état global, la navigation et le rendu des différents écrans.
- `components/`: Contient tous les composants React réutilisables (Button, Card, Player, etc.).
- `hooks/`: Contient les hooks personnalisés, comme `useI18n.tsx`.
- `constants.ts`: Fichier central pour toutes les données statiques de l'application (définitions des rituels, programmes, badges, etc.).
- `types.ts`: Définit les interfaces TypeScript pour les structures de données principales (Ritual, Session, Badge).
- `utils.ts`: Fonctions utilitaires pures (ex: `calculateStreaks`).
- `locales/`: Contient les fichiers de traduction bruts (ex: `fr.json`). **Note :** Ces fichiers servent de source, mais ne sont pas chargés dynamiquement.
- `docs/`: Documentation du projet.

## Gestion de l'État

L'état global est géré au sein du composant `App.tsx` à l'aide de hooks `useState`. Cette approche a été choisie pour sa simplicité, adaptée à la taille actuelle du projet. Les données persistantes sont chargées depuis le `localStorage` au démarrage de l'application et y sont sauvegardées à chaque modification.

## Internationalisation (i18n)

Pour garantir la stabilité et éviter les erreurs de chargement asynchrone, l'application utilise une approche d'internationalisation simple et robuste.

- **Source de Vérité Unique** : Le hook `hooks/useI18n.tsx` est le seul et unique point de gestion des traductions.
- **Intégration Statique** : Le contenu complet du fichier `locales/fr.json` est directement intégré dans une constante `frTranslations` à l'intérieur du hook. Cette décision architecturale a été prise suite à des erreurs persistantes liées à une intégration partielle des traductions. Elle élimine toute dépendance à un fichier externe au moment de l'exécution et garantit que 100% des clés de traduction sont disponibles.
- **Fonction `t()`** : Le hook expose une fonction `t(key, params)` qui recherche une clé dans l'objet `frTranslations` et remplace les éventuels paramètres (ex: `{count}`). Si une clé n'est pas trouvée, la clé elle-même est retournée, facilitant le débogage.

Cette méthode assure une performance maximale (pas de requêtes réseau ou de lecture de fichier) et une fiabilité à toute épreuve, deux critères essentiels pour l'expérience utilisateur. Pour le contexte historique de ce choix, voir le document des [leçons apprises](./lessons_learned.md).
