# Application de Chat en Temps Réel

## 🛠 Stack Technique

### Frontend
- **React** - Framework 
- **TypeScript** - Support du typage statique
- **Socket.IO Client** - Communication en temps réel
- **TailwindCSS** - Styling
- **Vite** - Build tool et serveur de développement
- **React Router** - Gestion du routage (en mode déclaratif)
- **Axios** - Client HTTP

> Tous les elements affichés sur le frontend ne sont pas fonctionnel (ajout de piece jointe message, appel vidéo / audio)

### Backend
- **NestJS** - Framework backend Node.js
- **MongoDB** - Base de données
- **Mongoose** - ODM
- **Socket.IO** - Communication bidirectionnelle en temps réel
- **JWT** - Authentification

## ✨ Fonctionnalités

### Authentification
- Inscription des utilisateurs
- Connexion sécurisée
- Gestion des sessions avec JWT

### Gestion des Utilisateurs
- Recherche d'utilisateurs par pseudo
- Profils utilisateurs

### Messagerie
- Création de conversations (2 à 10 participants)
- Messages en temps réel
- Accusés de réception
- Indicateur "est en train d'écrire"
- Interface utilisateur réactive

### Architecture
- Pattern Repository
- Architecture modulaire permettant le changement facile de système de stockage
- Possible support du sharding MongoDB (si beaucoup de message)

## 🚀 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- Docker et Docker Compose
- npm ou yarn

### Installation et démarrage

1. Configuration des variables d'environnement
```bash
 cp .env.example .env
```
2. Lancement avec Docker Compose (backend)
> Pas nécessaire de faire de `npm install` (cf `backend/Dockerfile`)
```bash
docker-compose up -d
```
3. Installation des dépendances Frontend (dans le dossier frontend)

```bash
cd frontend npm install npm run dev
```

## 🔧 Configuration

### Ports par défaut
- Frontend: 5173
- Backend: 3000
- MongoDB: 27017

### Variables d'environnement importantes
- `MONGODB_URI`: URI de connexion MongoDB
- `JWT_SECRET`: Clé secrète pour la génération des tokens JWT
- `PORT`: Port du serveur backend

## 📦 Structure du Projet

```
├── frontend/ # Application React 
├── backend/ # Serveur NestJS 
└── docker-compose.yml # Configuration Docker
```

## 💡 Points Forts
- Architecture évolutive (possiblement sharding mongo)
- Pattern Repository pour une meilleure maintenabilité
- Communication en temps réel 
- Interface utilisateur
- Séparation claire des responsabilités (modularité nest)
