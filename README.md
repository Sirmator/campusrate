# 🎓 CampusRate

<p align="center">

**API REST permettant à la communauté étudiante du campus de consulter des endroits ou services et de publier des appréciations accompagnées d'une note.**

Projet réalisé dans le cadre du cours **420-514 — Techniques de l'informatique**.

</p>

---

<p align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge\&logo=nestjs\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge\&logo=swagger\&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge\&logo=postman\&logoColor=white)

</p>

---

## 🎯 Objectif

CampusRate offre une API professionnelle permettant de gérer deux ressources principales :

* 📍 **Places** — endroits évalués : espaces d'étude, bibliothèques, services alimentaires, etc.
* ⭐ **Reviews** — appréciations comprenant une note et un commentaire associés à une place précise.

---

## ✨ Fonctionnalités

* ➕ Créer, lister, consulter, modifier et supprimer des places
* ⭐ Créer, lister, consulter, modifier et supprimer des reviews
* 🔎 Filtrer les places par catégorie
* 📄 Paginer les résultats
* ✅ Valider strictement les entrées : types, formats, valeurs autorisées et propriétés interdites
* 📊 Recalculer automatiquement la note moyenne et le nombre de reviews d'une place
* ⚠️ Gérer uniformément les erreurs avec le format **Problem Details** (`application/problem+json`)
* 💾 Persister les données dans un fichier JSON local, conservé après les redémarrages
* 📚 Fournir une documentation interactive avec **Swagger/OpenAPI**

---

## 🛠️ Technologies

| Technologie                                 | Utilisation                              |
| ------------------------------------------- | ---------------------------------------- |
| **NestJS / TypeScript**                     | Framework et langage de développement    |
| **class-validator** / **class-transformer** | Validation et transformation des données |
| **@nestjs/swagger**                         | Documentation OpenAPI / Swagger          |
| **node:fs/promises**                        | Lecture et écriture du fichier JSON      |
| **Postman**                                 | Tests manuels de l'API                   |

---

## 🚀 Installation

### Prérequis

* **Node.js 18+**
* **npm**
* **Git**

### Installation du projet

```bash
git clone https://github.com/Sirmator/campusrate.git
cd campusrate
npm ci
```

---

## ⚙️ Configuration

Copiez `.env.example` vers `.env` et ajustez les valeurs au besoin :

```bash
cp .env.example .env
```

### Variables d'environnement

| Variable         | Description                                        | Exemple                  |
| ---------------- | -------------------------------------------------- | ------------------------ |
| `PORT`           | Port d'écoute du serveur                           | `3000`                   |
| `DATA_FILE_PATH` | Chemin du fichier JSON utilisé pour la persistance | `./data/campusrate.json` |

> [!WARNING]
> L'application refuse de démarrer si l'une de ces variables est absente.

---

## ▶️ Démarrage

Pour démarrer l'application en mode développement :

```bash
npm run start:dev
```

Le serveur démarre par défaut sur :

```text
http://localhost:3000
```

Toutes les routes de l'API utilisent le préfixe :

```text
/api/v1
```

---

## 🧹 Lint et compilation

### Vérification du code

```bash
npm run lint
```

### Compilation du projet

```bash
npm run build
```

---

## 📚 Documentation Swagger

Une fois le serveur démarré, la documentation interactive de l'API est disponible à l'adresse suivante :

**http://localhost:3000/api/docs**

Swagger permet notamment de :

* 📖 consulter les routes disponibles ;
* 📝 voir les paramètres et les corps de requête attendus ;
* 📤 consulter les réponses possibles ;
* 🧪 tester directement les endpoints de l'API.

---

# 🔌 Contrat général de l'API

## 🧠 Justification des choix de design

| Décision                   | Choix                                    | Justification                                                                                                                                                                                                                                                |
| -------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Nommage des ressources** | `places`, `reviews`                      | Noms en anglais, au pluriel et en minuscules, cohérents avec `placeId`, déjà présent et imposé dans le modèle de données.                                                                                                                                    |
| **Versionnement**          | `/api/v1/...`                            | Permet de versionner l'API directement dans l'URL et de faire évoluer éventuellement le contrat sans casser une version existante.                                                                                                                           |
| **Imbrication**            | Combinaison                              | Les reviews sont imbriquées lors de leur création et de leur listage, puisque le contexte de la place est nécessaire. Une review peut ensuite être consultée ou modifiée directement grâce à son identifiant, ce qui évite des chemins inutilement profonds. |
| **Codes de statut**        | `200`, `201`, `204`, `400`, `404`, `409` | Utilisation des codes HTTP appropriés selon le résultat de chaque opération. Voir le tableau des routes ci-dessous.                                                                                                                                          |

---

## 🛣️ Routes disponibles

| Méthode  | URI                          | Description                             | Succès | Erreurs      |
| -------- | ---------------------------- | --------------------------------------- | ------ | ------------ |
| `POST`   | `/api/v1/places`             | Créer une place                         | `201`  | `400`        |
| `GET`    | `/api/v1/places`             | Lister les places (filtre + pagination) | `200`  | `400`        |
| `GET`    | `/api/v1/places/:id`         | Consulter une place                     | `200`  | `404`        |
| `PATCH`  | `/api/v1/places/:id`         | Modifier partiellement une place        | `200`  | `400`, `404` |
| `DELETE` | `/api/v1/places/:id`         | Supprimer une place                     | `204`  | `404`, `409` |
| `POST`   | `/api/v1/places/:id/reviews` | Créer une review pour cette place       | `201`  | `400`, `404` |
| `GET`    | `/api/v1/places/:id/reviews` | Lister les reviews d'une place          | `200`  | `404`        |
| `GET`    | `/api/v1/reviews/:id`        | Consulter une review                    | `200`  | `404`        |
| `PATCH`  | `/api/v1/reviews/:id`        | Modifier partiellement une review       | `200`  | `400`, `404` |
| `DELETE` | `/api/v1/reviews/:id`        | Supprimer une review                    | `204`  | `404`        |

---

## ⚠️ Format des erreurs

Toutes les erreurs de l'API suivent le format **Problem Details** avec le type MIME :

```text
application/problem+json
```

Exemple :

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Place plc_xxxx introuvable",
  "instance": "/api/v1/places/plc_xxxx"
}
```

Ce format permet de retourner une structure d'erreur uniforme, peu importe l'endroit où l'erreur est produite dans l'API.

---

## 📄 Format de pagination

Les endpoints utilisant la pagination retournent les résultats dans la structure suivante :

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

---

## 🧪 Tests manuels

Une collection **Postman** couvrant les principaux scénarios est disponible dans :

```text
postman/CampusRate.postman_collection.json
```

Elle couvre notamment :

* ➕ Création
* 🔎 Consultation
* ✏️ Modification
* 🗑️ Suppression
* ❌ Erreurs de validation
* 🔍 Ressources inexistantes
* ⚠️ Conflits de suppression
* 🏷️ Filtrage
* 📄 Pagination
* 💾 Persistance après redémarrage

---

## 📁 Structure du projet

```text
src/
├── places/
│   ├── controller
│   ├── service
│   └── DTO
│
├── reviews/
│   ├── controller
│   ├── service
│   └── DTO
│
└── common/
    ├── filters/
    │   └── Filtre global d'exceptions (Problem Details)
    │
    └── persistence/
        └── Repository partagé pour le fichier JSON
```

---

# ⚠️ Limites connues

* 💾 Les données sont stockées dans un fichier JSON local. Cette approche n'est pas adaptée à un projet de grande envergure et n'offre pas les garanties de sécurité et de robustesse d'une véritable base de données.
* 🧪 Aucun test automatisé n'est actuellement présent. Les fonctionnalités doivent donc être testées manuellement avec Postman ou un autre outil de test d'API.
* 💽 Il n'y a actuellement aucun système de sauvegarde ou de récupération des données. Si le fichier JSON devient corrompu ou si une panne entraîne sa perte, les données peuvent être perdues.

---

# 🤖 IAGraphie

* **Share Link :**

---

<p align="center">
  <sub>CampusRate — Projet réalisé dans le cadre du cours 420-514</sub>
</p>
