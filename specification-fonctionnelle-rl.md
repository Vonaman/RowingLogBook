# Spécification fonctionnelle et technique

Cahier de sortie d'aviron — Rowing Logbook

---

## Table des matières

1. [Contexte et objectifs](#1-contexte-et-objectifs)
2. [Périmètre du MVP](#2-périmètre-du-mvp)
3. [Acteurs et rôles](#3-acteurs-et-rôles)
4. [Fonctionnalités détaillées](#4-fonctionnalités-détaillées)
   - 4.1 [Application mobile — Rameurs](#41-application-mobile--rameurs)
   - 4.2 [Application web — Administration](#42-application-web--administration)
   - 4.3 [Fonctionnalités transversales](#43-fonctionnalités-transversales)
5. [Règles métier](#5-règles-métier)
6. [Architecture technique](#6-architecture-technique)
7. [Modèle de données](#7-modèle-de-données)
8. [Sécurité et authentification](#8-sécurité-et-authentification)
9. [Notifications](#9-notifications)
10. [Conservation des données](#10-conservation-des-données)
11. [Hors périmètre MVP (V2)](#11-hors-périmètre-mvp-v2)

---

## 1. Contexte et objectifs

Dans les clubs d'aviron, les rameurs ont l'obligation réglementaire de s'inscrire sur un **cahier de sortie** avant chaque mise à l'eau. Ce cahier permet de :

- Assurer la **sécurité** des pratiquants (savoir qui est sur l'eau, avec quel bateau, depuis combien de temps)
- Suivre l'**utilisation des bateaux** (maintenance, disponibilité)
- Constituer un **historique des activités** du club

L'objectif de ce projet est de **dématérialiser ce cahier** sous la forme de deux applications complémentaires :

- Une **application mobile** à destination des rameurs, pour saisir et clôturer leurs sorties
- Une **application web d'administration** à destination du staff du club, pour gérer les données de référence et superviser les sorties

---

## 2. Périmètre du MVP

Le MVP (Minimum Viable Product) couvre les fonctionnalités essentielles suivantes :

| Fonctionnalité | Application | Inclus MVP |
|---|---|---|
| Authentification | Mobile + Web | ✅ |
| Créer une sortie | Mobile | ✅ |
| Clôturer une sortie | Mobile + Web | ✅ |
| Consulter les sorties en cours | Mobile + Web | ✅ |
| Historique des sorties | Mobile + Web | ✅ |
| Gestion des membres | Web | ✅ |
| Gestion des bateaux | Web | ✅ |
| Alertes de sécurité (3h) | Mobile + Web | ✅ |
| Statistiques avancées | Web | ✅ |
| Export des données | Web | ✅ |
| Mode hors-ligne | Mobile | ❌ (V2) |
| Carte / tracé GPS | Mobile | ❌ (V2) |
| Gestion des parcours prédéfinis | Web | ❌ (V2) |

---

## 3. Acteurs et rôles

### 3.1 Rameur (`ROLE_ROWER`)

Membre du club pratiquant l'aviron. Il peut :
- Se connecter à l'application mobile
- Créer et clôturer ses propres sorties
- Consulter les sorties en cours et l'historique

### 3.2 Staff (`ROLE_STAFF`)

Membre du club ayant des responsabilités d'encadrement (entraîneur, responsable sécurité, etc.). Il peut :
- Effectuer toutes les actions d'un rameur
- Recevoir les alertes de sécurité
- Clôturer n'importe quelle sortie depuis l'application web
- Consulter l'ensemble des statistiques

### 3.3 Administrateur (`ROLE_ADMIN`)

Gestionnaire du club. Il peut :
- Effectuer toutes les actions du staff
- Gérer les membres (CRUD)
- Gérer les bateaux (CRUD)
- Accéder à l'ensemble des fonctionnalités de l'application web d'administration

> **Note** : Un utilisateur ne peut avoir qu'un seul rôle à la fois. La hiérarchie est : `ADMIN > STAFF > ROWER`.

---

## 4. Fonctionnalités détaillées

### 4.1 Application mobile — Rameurs

#### 4.1.1 Authentification

- **Connexion** : saisie de l'adresse email et du mot de passe
- Maintien de la session (token JWT stocké localement)
- Déconnexion manuelle
- Mot de passe oublié (envoi d'un email de réinitialisation)

#### 4.1.2 Tableau de bord

- Liste des **sorties en cours** (bateaux actuellement sur l'eau)
  - Affichage : nom du bateau, responsable, heure de départ, durée écoulée
  - Mise en évidence visuelle des sorties dépassant 2h30 (proche du seuil d'alerte)
- Bouton d'accès rapide **"Nouvelle sortie"**

#### 4.1.3 Créer une sortie

Formulaire de création avec les champs suivants :

| Champ | Type | Obligatoire | Détail |
|---|---|---|---|
| Bateau | Sélection | ✅ | Liste des bateaux disponibles uniquement |
| Heure de départ | Date/heure | ✅ | Pré-remplie avec l'heure actuelle, modifiable |
| Distance prévue | Nombre (km) | ✅ | Valeur décimale |
| Parcours | Texte libre | ❌ | Description libre de l'itinéraire |
| Équipage | Multi-sélection | ❌ | Sélection parmi les membres actifs du club |
| Remarques | Texte libre | ❌ | Observations avant départ |

**Règles de validation :**
- Le bateau sélectionné ne doit pas avoir de sortie en cours au moment de la création
- L'heure de départ ne peut pas être dans le futur
- Le rameur créant la sortie est automatiquement désigné **responsable de la sortie**

#### 4.1.4 Clôturer une sortie

Accessible depuis la liste des sorties en cours, uniquement pour les sorties dont l'utilisateur est **responsable**.

| Champ | Type | Obligatoire | Détail |
|---|---|---|---|
| Heure de retour | Date/heure | ✅ | Pré-remplie avec l'heure actuelle, modifiable |
| Distance réelle | Nombre (km) | ✅ | Pré-remplie avec la distance prévue, modifiable |
| Remarques | Texte libre | ❌ | Observations après la sortie (avarie, incident, etc.) |

**Règles de validation :**
- L'heure de retour doit être postérieure à l'heure de départ
- La clôture libère immédiatement le bateau

#### 4.1.5 Historique des sorties

- Liste paginée de toutes les sorties passées (toutes sorties confondues, pas uniquement les siennes)
- Filtres disponibles : date, bateau, rameur
- Tri par défaut : date décroissante
- Détail d'une sortie : tous les champs de la sortie, équipage complet, remarques

---

### 4.2 Application web — Administration

#### 4.2.1 Authentification

- Connexion via email + mot de passe (même système que l'app mobile)
- Accès réservé aux utilisateurs avec le rôle `STAFF` ou `ADMIN`

#### 4.2.2 Tableau de bord

- Vue en temps réel des **sorties en cours**
  - Tableau avec : bateau, responsable, équipage, heure de départ, durée, parcours, distance prévue
  - Mise en évidence des sorties dépassant 3h (alerte active)
- Indicateurs clés du jour :
  - Nombre de sorties en cours
  - Nombre de sorties clôturées dans la journée
  - Bateaux disponibles / total

#### 4.2.3 Gestion des sorties

- **Liste complète** des sorties (en cours + historique)
  - Filtres : date, bateau, rameur, statut (en cours / clôturée)
  - Tri par toutes les colonnes
  - Pagination
- **Clôturer une sortie** (pour toute sortie en cours, quel que soit le responsable)
  - Mêmes champs que la clôture mobile
  - Action réservée au `STAFF` et `ADMIN`
- **Détail d'une sortie** : vue complète de tous les champs
- **Export** des sorties filtrées en CSV

#### 4.2.4 Gestion des membres

> Accessible uniquement aux `ADMIN`

- **Liste des membres** : nom, prénom, email, rôle, statut (actif/inactif), date d'inscription
- **Créer un membre** :

| Champ | Type | Obligatoire |
|---|---|---|
| Prénom | Texte | ✅ |
| Nom | Texte | ✅ |
| Email | Email | ✅ |
| Rôle | Sélection (`ROWER`, `STAFF`, `ADMIN`) | ✅ |
| Statut | Actif / Inactif | ✅ |

  - Un email d'invitation est envoyé au nouveau membre pour définir son mot de passe
- **Modifier un membre** : tous les champs modifiables sauf l'email
- **Désactiver / Réactiver un membre** : un membre inactif ne peut plus se connecter
- **Supprimer un membre** : suppression logique uniquement (les sorties associées sont conservées)

#### 4.2.5 Gestion des bateaux

> Accessible uniquement aux `ADMIN`

- **Liste des bateaux** : nom, type, nombre de places, état, statut (disponible / sorti / hors service)
- **Créer un bateau** :

| Champ | Type | Obligatoire | Détail |
|---|---|---|---|
| Nom | Texte | ✅ | Nom usuel du bateau dans le club |
| Type | Sélection | ✅ | Ex. : skiff, double, quatre, huit, kayak... |
| Nombre de places | Entier | ✅ | |
| État | Sélection | ✅ | Bon état / À surveiller / En maintenance |
| Notes | Texte libre | ❌ | Informations complémentaires |

- **Modifier un bateau** : tous les champs modifiables
- **Mettre hors service** : le bateau n'apparaît plus dans la liste de sélection de l'app mobile
- **Historique des sorties** par bateau

#### 4.2.6 Statistiques

- **Par période** (semaine, mois, année, personnalisée) :
  - Nombre total de sorties
  - Distance totale parcourue
  - Durée totale sur l'eau
- **Par rameur** :
  - Nombre de sorties
  - Distance totale
  - Classement des rameurs les plus actifs
- **Par bateau** :
  - Taux d'utilisation
  - Nombre de sorties
  - Distance totale

---

### 4.3 Fonctionnalités transversales

#### 4.3.1 Alertes de sécurité

- Un job automatique vérifie toutes les **15 minutes** les sorties en cours
- Si une sortie dépasse **3 heures** sans être clôturée :
  - Un **email** est envoyé au **responsable de la sortie**
  - Un **email** est envoyé à tous les membres avec le rôle **`STAFF`** et **`ADMIN`**
  - Une **notification in-app** (badge) est créée pour les mêmes destinataires
- L'alerte est **répétée toutes les 30 minutes** tant que la sortie n'est pas clôturée
- Un **historique des alertes** est conservé (date, sortie concernée, destinataires)

#### 4.3.2 Remarques

- Les remarques saisies lors d'une sortie (avant départ ou à la clôture) sont **visibles par tous les membres connectés**
- Elles apparaissent dans le détail de la sortie (app mobile et web)

---

## 5. Règles métier

| # | Règle |
|---|---|
| RG-01 | Un bateau ne peut pas avoir deux sorties en cours simultanément |
| RG-02 | L'heure de départ ne peut pas être dans le futur |
| RG-03 | L'heure de retour doit être strictement postérieure à l'heure de départ |
| RG-04 | Seul le responsable d'une sortie peut la clôturer depuis l'app mobile |
| RG-05 | Un membre du staff ou un admin peut clôturer n'importe quelle sortie depuis l'app web |
| RG-06 | Un membre inactif ne peut pas se connecter ni être sélectionné dans un équipage |
| RG-07 | Un bateau hors service ne peut pas être sélectionné pour une nouvelle sortie |
| RG-08 | Une alerte est déclenchée si une sortie dépasse 3 heures sans clôture |
| RG-09 | Les alertes sont répétées toutes les 30 minutes jusqu'à clôture de la sortie |
| RG-10 | La suppression d'un membre est logique : ses sorties passées sont conservées |
| RG-11 | Les données de sortie sont conservées 10 ans minimum |

---

## 6. Architecture technique

### 6.1 Vue d'ensemble

```
┌─────────────────────┐     ┌──────────────────────┐
│   App Mobile        │     │   App Web Admin      │
│   (React Native)    │     │   (Angular)          │
└────────┬────────────┘     └──────────┬───────────┘
         │                             │
         │         HTTPS / REST API    │
         └──────────────┬──────────────┘
                        │
               ┌────────▼────────┐
               │   Backend API   │
               │  (Spring Boot)  │
               └────────┬────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
       ┌──────▼──────┐     ┌──────▼──────┐
       │ PostgreSQL  │     │    SMTP     │
       │ (données)   │     │  (emails)   │
       └─────────────┘     └─────────────┘
```

### 6.2 Backend — Spring Boot

- **Langage** : Java 25
- **Framework** : Spring Boot 4
- **API** : REST (JSON)
- **Authentification** : Spring Security + JWT (stateless)
- **ORM** : Spring Data JPA / Hibernate
- **Base de données** : PostgreSQL 16
- **Migrations** : Flyway
- **Scheduler** : Spring `@Scheduled` pour les alertes de sécurité
- **Emails** : Spring Mail (SMTP)
- **Notifications in-app** : stockées en base de données, exposées via l'API REST
- **Documentation API** : OpenAPI 3 / Swagger UI

### 6.3 Application web — Angular

- **Framework** : Angular 20+
- **Langage** : TypeScript
- **UI** : Angular Material
- **Gestion d'état** : services RxJS
- **Authentification** : Intercepteur HTTP pour injection du token JWT

### 6.4 Application mobile — React Native

- **Framework** : React Native (Expo)
- **Langage** : TypeScript
- **Navigation** : React Navigation
- **Gestion d'état** : Zustand (léger, adapté au mobile)
- **Notifications in-app** : polling régulier de l'API pour récupérer les alertes non lues
- **Stockage local** : AsyncStorage (token JWT)

### 6.5 Infrastructure (recommandation)

| Composant | Solution recommandée |
|---|---|
| Hébergement backend | Railway / Render / VPS |
| Base de données | PostgreSQL managé (Supabase, Railway) |
| App mobile | Expo EAS Build (iOS + Android) |
| App web | Vercel / Netlify |
| Emails | Resend / SendGrid (free tier) |

---

## 7. Modèle de données

### 7.1 Entité `Member` (Membre)

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | Nom |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Adresse email (identifiant de connexion) |
| `password_hash` | VARCHAR(255) | NOT NULL | Mot de passe hashé (bcrypt) |
| `role` | ENUM | NOT NULL | `ROWER`, `STAFF`, `ADMIN` |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Statut du compte |
| `created_at` | TIMESTAMP | NOT NULL | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | Date de dernière modification |
| `deleted_at` | TIMESTAMP | NULLABLE | Date de suppression logique |

### 7.2 Entité `Boat` (Bateau)

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Nom du bateau |
| `type` | VARCHAR(50) | NOT NULL | Type (skiff, double, quatre, huit...) |
| `capacity` | INTEGER | NOT NULL | Nombre de places |
| `condition` | ENUM | NOT NULL | `GOOD`, `WATCH`, `MAINTENANCE` |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Disponible à la sélection |
| `notes` | TEXT | NULLABLE | Notes libres |
| `created_at` | TIMESTAMP | NOT NULL | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | Date de dernière modification |

### 7.3 Entité `Session` (Sortie)

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `boat_id` | UUID | FK → Boat, NOT NULL | Bateau utilisé |
| `responsible_id` | UUID | FK → Member, NOT NULL | Rameur responsable |
| `departure_time` | TIMESTAMP | NOT NULL | Heure de départ |
| `return_time` | TIMESTAMP | NULLABLE | Heure de retour (NULL = en cours) |
| `planned_distance_km` | DECIMAL(6,2) | NOT NULL | Distance prévue en km |
| `actual_distance_km` | DECIMAL(6,2) | NULLABLE | Distance réelle en km |
| `route` | TEXT | NULLABLE | Description libre du parcours |
| `pre_remarks` | TEXT | NULLABLE | Remarques avant départ |
| `post_remarks` | TEXT | NULLABLE | Remarques après retour |
| `status` | ENUM | NOT NULL | `IN_PROGRESS`, `COMPLETED` |
| `created_at` | TIMESTAMP | NOT NULL | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | Date de dernière modification |

### 7.4 Entité `SessionCrew` (Équipage)

Table de jointure entre une sortie et ses membres d'équipage.

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `session_id` | UUID | FK → Session, NOT NULL | Sortie |
| `member_id` | UUID | FK → Member, NOT NULL | Membre de l'équipage |
| PK | — | (`session_id`, `member_id`) | Clé primaire composite |

### 7.5 Entité `Alert` (Alerte)

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `session_id` | UUID | FK → Session, NOT NULL | Sortie concernée |
| `member_id` | UUID | FK → Member, NOT NULL | Destinataire de l'alerte |
| `sent_at` | TIMESTAMP | NOT NULL | Date et heure d'envoi |
| `is_read` | BOOLEAN | NOT NULL, DEFAULT FALSE | Lu dans l'app (notification in-app) |
| `channel` | ENUM | NOT NULL | `IN_APP`, `EMAIL` |

---

## 8. Sécurité et authentification

### 8.1 Mécanisme

- Authentification par **email + mot de passe**
- Génération d'un **token JWT** signé côté serveur (HS256)
- Le token est inclus dans chaque requête via le header `Authorization: Bearer <token>`
- Durée de validité du token : **24 heures**
- Renouvellement via un **refresh token** (durée : 30 jours)

### 8.2 Hashage des mots de passe

- Algorithme : **bcrypt** (facteur de coût : 12)

### 8.3 Invitation d'un nouveau membre

1. L'administrateur crée le compte avec email et rôle
2. Un email est envoyé au nouveau membre avec un **lien de définition de mot de passe** (token à usage unique, valide 48h)
3. Le membre définit son mot de passe et peut se connecter

### 8.4 Réinitialisation du mot de passe

1. Le membre saisit son email sur l'écran "Mot de passe oublié"
2. Un email est envoyé avec un **lien de réinitialisation** (token à usage unique, valide 1h)
3. Le membre définit un nouveau mot de passe

### 8.5 Contrôle d'accès

| Endpoint | `ROWER` | `STAFF` | `ADMIN` |
|---|---|---|---|
| Créer une sortie | ✅ | ✅ | ✅ |
| Clôturer sa propre sortie | ✅ | ✅ | ✅ |
| Clôturer n'importe quelle sortie | ❌ | ✅ | ✅ |
| Consulter les sorties | ✅ | ✅ | ✅ |
| Gérer les membres | ❌ | ❌ | ✅ |
| Gérer les bateaux | ❌ | ❌ | ✅ |
| Consulter les statistiques | ✅ | ✅ | ✅ |
| Exporter les données | ❌ | ✅ | ✅ |
| Recevoir les alertes de sécurité | ❌ | ✅ | ✅ |

---

## 9. Notifications

### 9.1 Alerte de sécurité (sortie > 3h)

- **Déclencheur** : job planifié toutes les 15 minutes
- **Condition** : `status = IN_PROGRESS` ET `departure_time < NOW() - 3 heures`
- **Destinataires** :
  - Responsable de la sortie
  - Tous les membres avec rôle `STAFF` ou `ADMIN`
- **Canaux** :
  - **Email (SMTP)** : envoi immédiat à chaque déclenchement
  - **Notification in-app** : une entrée `Alert` est créée en base pour chaque destinataire, visible au prochain chargement de l'application (badge sur l'icône de cloche)
- **Répétition** : toutes les 30 minutes tant que la sortie n'est pas clôturée
- **Contenu** :
  - Sujet email : `⚠️ Sortie non clôturée — [Nom du bateau]`
  - Corps : `La sortie de [Prénom Nom] avec le bateau [Nom du bateau] dure depuis [durée]. Veuillez vérifier.`

### 9.2 Email d'invitation

- **Déclencheur** : création d'un nouveau membre par un admin
- **Destinataire** : le nouveau membre
- **Contenu** : lien de définition de mot de passe (valide 48h)

### 9.3 Email de réinitialisation de mot de passe

- **Déclencheur** : demande de réinitialisation
- **Destinataire** : le membre concerné
- **Contenu** : lien de réinitialisation (valide 1h)

---

## 10. Conservation des données

- Les données de sortie sont conservées **10 ans minimum**
- La suppression des membres est **logique** (champ `deleted_at`) : les sorties associées restent intactes et consultables
- Les sorties de plus de **3 ans** sont considérées comme archivées et non affichées par défaut dans les listes (accessibles via un filtre "Archives")
- **Conformité RGPD** :
  - Un membre peut demander la suppression de ses données personnelles (nom, email)
  - En cas de demande, les données personnelles sont **anonymisées** (pas supprimées) pour conserver l'intégrité des historiques de sortie
  - Les données anonymisées remplacent le nom par `Membre supprimé`

---

## 11. Hors périmètre MVP (V2)

Les fonctionnalités suivantes sont identifiées mais **exclues du MVP** :

| Fonctionnalité | Justification |
|---|---|
| Mode hors-ligne (PWA/offline) | Complexité technique, non critique pour le MVP |
| Tracé GPS du parcours | Nécessite une intégration cartographique (Mapbox, Google Maps) |
| Gestion de parcours prédéfinis | Remplacé par le champ texte libre dans le MVP |
| Import en masse de membres | Peut être fait manuellement au démarrage |
| Application iOS / Android native | Couvert par React Native (Expo) |
| Tableau de bord multi-clubs | Architecture multi-tenant non prévue dans le MVP |
| Intégration avec la FFAviron | API fédérale non documentée publiquement |
