# Leçons Apprises & Post-Mortem

Ce document a pour but de consigner les défis techniques majeurs rencontrés durant le développement, d'analyser leurs causes profondes (post-mortem) et de documenter les solutions pérennes mises en place. L'objectif est de capitaliser sur ces apprentissages pour améliorer la stabilité et la qualité du code à l'avenir.

---

## Problème Persistant de Traductions (Octobre 2024)

### Symptômes

Pendant plusieurs itérations de développement, un bug récurrent empêchait l'affichage correct des traductions pour certains éléments de l'interface, notamment les rituels et les badges. Les clés de traduction (ex: `ritual_soupir_physio_120_label`) s'affichaient à la place du texte en français.

### Diagnostic de la Cause Racine

Après plusieurs tentatives de correction infructueuses, une analyse rigoureuse a révélé que la cause n'était pas un problème de logique dans le code, mais une **erreur de processus manuel**.

La stratégie initiale consistait à maintenir les traductions dans `locales/fr.json` et à les copier manuellement dans l'objet `frTranslations` du hook `hooks/useI18n.tsx`. À chaque mise à jour, ce processus de copier-coller était **incomplet** : le fichier était systématiquement tronqué, omettant une grande partie des clés, notamment celles ajoutées le plus récemment.

Cette erreur humaine, répétée à plusieurs reprises, est la cause unique et fondamentale de l'instabilité observée.

### Solution Définitive

La solution a consisté à abandonner l'idée d'une synchronisation manuelle et à adopter une approche plus robuste :

1.  **Intégration Complète et Statique** : Le contenu **intégral** du fichier `locales/fr.json` a été copié et intégré de manière définitive dans la constante `frTranslations` au sein du fichier `hooks/useI18n.tsx`.
2.  **Principe de Source Unique de Vérité (SSOT)** : Le hook `useI18n.tsx` est désormais la seule et unique source de vérité pour les traductions au moment de l'exécution. Le fichier `locales/fr.json` ne sert plus que de référence ou de sauvegarde, mais n'est pas utilisé par l'application en production.

Cette approche élimine tout risque de désynchronisation et garantit que 100% des traductions sont disponibles dès le chargement de l'application.

### Mesures Préventives et Leçons Apprises

1.  **Fiabiliser les Processus Manuels** : Pour toute opération manuelle critique (comme un copier-coller de grande taille), une étape de vérification systématique (ex: comparaison du nombre de lignes, `diff`) doit être mise en place.
2.  **Privilégier les Sources Uniques de Vérité** : L'architecture doit, autant que possible, éviter les situations où deux fichiers doivent être maintenus manuellement en synchronisation. L'intégration statique des traductions est un exemple de mise en pratique de ce principe.
3.  **Documenter les Décisions d'Architecture** : Les raisons derrière un choix technique, surtout s'il fait suite à un problème, doivent être documentées. L'architecture de l'internationalisation est désormais expliquée dans `docs/architecture.md`, avec un lien vers ce post-mortem.
