# Exercices Excel et Word

[![Lien vers l'application](https://img.shields.io/badge/Visiter_l'Application-ProfLambda.github.io-blue?style=for-the-badge&logo=github)](https://ProfLambda.github.io/exercices)

Une application web statique prête à l'emploi conçue pour permettre aux étudiants (notamment en secrétariat médical) de pratiquer et de valider leurs compétences sur **Microsoft Excel** et **Microsoft Word**.

## 💡 Présentation

Ce projet propose un parcours d'exercices pratiques allant des bases aux fonctions avancées de la bureautique. L'interface offre une expérience utilisateur fluide, esthétique et moderne avec la centralisation de toutes les ressources nécessaires à la résolution de cas concrets.

**Fonctionnalités clés :**
- **Catalogue d'exercices** : Liste complète des exercices filtrables par logiciel (Excel ou Word).
- **Suivi de progression** : Les exercices terminés sont mémorisés localement dans le navigateur (LocalStorage) avec une barre de progression globale.
- **Ressources intégrées** : Téléchargement direct des fichiers de travail `.csv` ou `.xlsx` et des ressources nécessaires.
- **Correction visuelle** : Aperçu du résultat final attendu pour vérifier son propre travail.
- **Cours et Tutoriels** : Liens rapides vers la documentation officielle de Microsoft liée aux compétences requises par l'exercice.
- **Mode Sombre** : Support complet du mode clair et du mode sombre (Dark Mode) pour le confort visuel.

## 🚀 Utilisation et Déploiement

Ce projet est fourni sous forme de **fichiers statiques pré-générés** (situés dans le dossier `dist/`). Il ne nécessite aucun serveur Node.js ni compilation.

Pour utiliser ou déployer cette application :

1. **Récupérez le contenu** de ce dossier (fichiers `.html`, dossier `assets/` regroupant CSS, JS, polices, et le dossier `data/` contenant les exercices).
2. **Hébergez** ces fichiers sur n'importe quel serveur web classique (Apache, Nginx, espace perso fourni par un hébergeur), ou sur un service gratuit comme **GitHub Pages**, Netlify, etc.
3. Les liens sont configurés de manière rélative, l'application fonctionnera parfaitement même si elle est déployée dans un sous-dossier (ex: `https://votre-site.com/exercices/`).

## 📁 Structure des Données (Exercices)

Les exercices sont prêts à l'emploi et stockés dans le dossier `data/exercices/` :
- `index.json` contient la liste de tous les exercices disponibles avec leurs descriptions.
- Chaque exercice a son propre dossier (ex: `excel/01/`) contenant un fichier `exercice.json` détaillé avec le contexte, les tâches, des liens vers les fichiers de ressources associés, et l'image du résultat attendu.
  
---
*Développé pour l'apprentissage et la pratique de la bureautique.*
