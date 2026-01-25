# Roadmap Stratégique - StopAndZen

Ce document définit les étapes clés pour transformer StopAndZen d'une application de micro-rituels locale en une plateforme de bien-être immersive, monétisée et à la pointe de la technologie.

---

## 🚀 Vision
Devenir le leader des micro-interventions de santé mentale en offrant l'expérience la plus immersive et personnalisée du marché, générant une valeur perçue élevée justifiant un modèle Premium.

---

## 🛠️ Phase 1 : Consolidation & Cloud (Le Socle)
*Objectif : Fiabiliser l'application et sécuriser les données utilisateur pour préparer la vente.*

- [ ] **Migration Supabase Auth** : Inscription/Connexion (Email, Google, Apple) pour lier les données à un compte réel.
- [ ] **Cloud Database** : Migration du `localStorage` vers des tables Supabase (Sessions, Badges, Favoris).
- [ ] **Externalisation i18n** : Stockage des fichiers `fr.json`, `en.json`, `es.json` sur Supabase pour des mises à jour sans déploiement code.
- [ ] **Multi-langue dynamique** : Détection automatique de la langue du navigateur et sélecteur manuel dans les paramètres.

---

## 🎧 Phase 2 : Immersion Sensorielle (La Valeur Perçue)
*Objectif : Créer un "effet wow" immédiat dès le premier rituel gratuit.*

- [ ] **Audio-Guidance Multi-langue** :
    - Intégration d'un système de lecture audio synchronisé avec le chronomètre.
    - Support des fichiers MP3 spécifiques par langue dans `constants.ts`.
    - Sélecteur de mode avant le départ : "Silence / Musique seule / Guidance vocale".
- [ ] **Refonte UI "High-End"** :
    - Adoption d'un design full Glassmorphism (effets de flou et de transparence avancés).
    - Transitions fluides entre les écrans pour supprimer l'effet "site web".
- [ ] **Audio Spatial** : Utilisation de fréquences binaurales dynamiques pour augmenter l'impact neurologique des rituels.

---

## 💰 Phase 3 : Monétisation & Conversion (Le Moteur)
*Objectif : Activer les revenus rapidement.*

- [ ] **Intégration Paiement (Stripe / Paddle)** :
    - Mise en place d'un tunnel d'abonnement sécurisé.
    - Modèles : Abonnement mensuel / Pass "Lifetime" (accès à vie).
- [ ] **Paywall Stratégique** :
    - Accès gratuit limité à 5 rituels "découverte".
    - Verrouillage des parcours de 7 jours et des rituels avancés.
    - Verrouillage du coaching IA dans le journal.
- [ ] **Système de Cadeau (Gifting)** : Possibilité d'acheter et d'offrir un accès Premium à un tiers.

---

## ✨ Phase 4 : L'Exceptionnel (Le Facteur "Minpivot")
*Objectif : Rendre l'application indispensable et unique au monde.*

- [ ] **Gemini Live Coaching** :
    - Remplacement de la saisie texte du journal par une conversation vocale avec l'IA.
    - Analyse de la voix pour détecter le niveau de stress résiduel.
- [ ] **Biométrie par Caméra (Web-PPG)** :
    - Estimation du rythme cardiaque via la caméra du smartphone (mesure des micro-variations de couleur du visage).
    - Rapport "Preuve d'Efficacité" : comparaison BPM avant/après rituel.
- [ ] **Rituels Génératifs** : Création de méditations uniques par l'IA basées sur l'humeur précise du check-in, lues par une voix neuronale naturelle.

---

## 📈 Suivi des KPIs
1.  **Retention D1/D7** : Pourcentage d'utilisateurs revenant après 1 et 7 jours.
2.  **Taux de Conversion** : Pourcentage d'utilisateurs gratuits passant au Premium.
3.  **Temps Moyen de Pratique** : Indicateur de l'engagement et de l'immersion.
