# 🏥 MediAppoint WA | WhatsApp Smart Booking & CRM Platform

Plateforme SaaS B2B moderne de prise de rendez-vous intelligente avec confirmations et rappels automatiques par **WhatsApp** pour les cabinets médicaux, dentistes et professions libérales.

---

## 🚀 Démarrage Rapide (Quick Start)

### 1. Démarrer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur : **`http://localhost:3000`**

### 2. Pages Principales
* **Landing Page B2B :** `http://localhost:3000/`
* **Page de Réservation Patient (Live Demo) :** `http://localhost:3000/dr-amine-bennani`
* **Espace Cabinet & CRM (Secrétaire / Médecin) :** `http://localhost:3000/dashboard`

---

## 🛠️ Architecture & Fonctionnalités Clés

### 1. Prise de Rendez-vous Patient (`/[slug]`)
* Calcul en temps réel des créneaux horaires disponibles (`/api/clinics/[slug]/slots`).
* Détection automatique des collisions pour empêcher le double-booking.
* Envoi instantané du message de confirmation sur WhatsApp avec géolocalisation.

### 2. لوحة تحكم السكرتيرة والطبيب (`/dashboard`)
* KPIs en temps réel : Taux de confirmation WhatsApp, No-Shows, C.A estimé.
* Gestion des statuts en 1 clic : `Présent / Traité`, `Confirmé WA`, `No-Show`, `Annuler`.
* Prise de RDV manuelle ultra-rapide lors d'un appel téléphonique.
* **Simulateur de Webhook WhatsApp intégré** : Testez directement ce qui se passe quand un patient répond "OUI", "1", ou "ANNULER".

### 3. Moteur WhatsApp Cloud API (`/api/webhook/whatsapp` & `/api/whatsapp/send-reminder`)
* Supporte à la fois le mode **Simulation locale** (sans configuration requise) et le **Meta WhatsApp Cloud API réel**.

---

## 🗄️ Base de Données (Prisma + SQLite / PostgreSQL)

* **Réinitialiser / Re-seeder les données :**
```bash
npx prisma db push
node prisma/seed.js
```
* **Ouvrir Prisma Studio (Visualiser les tables) :**
```bash
npm run db:studio
```
