# CampusRate

API REST permettant à la communauté étudiante du campus de consulter des endroits ou services et de publier des appréciations accompagnées d'une note.

Projet réalisé dans le cadre du cours 420-514 (Techniques de l'informatique).

## Objectif

CampusRate offre une API professionnelle pour gérer deux ressources principales :
- **Places** (endroits évalués) : espaces d'étude, bibliothèques, services alimentaires, etc.
- **Reviews** (appréciations) : notes et commentaires associés à un place précis.

## Fonctionnalités

- Créer, lister, consulter, modifier et supprimer des places
- Créer, lister, consulter, modifier et supprimer des reviews
- Filtrage des places par catégorie et pagination des résultats
- Validation stricte des entrées (types, formats, valeurs autorisées, propriétés interdites)
- Recalcul automatique de la note moyenne et du nombre de reviews d'un place
- Gestion uniforme des erreurs au format Problem Details (`application/problem+json`)
- Persistance des données dans un fichier JSON local, survivant aux redémarrages
- Documentation interactive Swagger/OpenAPI

## Technologies

- [NestJS](https://nestjs.com/) (TypeScript)
- `class-validator` / `class-transformer` pour la validation
- `@nestjs/swagger` pour la documentation OpenAPI
- `node:fs/promises` pour la persistance JSON
- Postman pour les tests manuels

## Installation

Prérequis : Node.js 18+ et npm.

```bash
git clone https://github.com/Sirmator/campusrate.git
cd campusrate
npm ci
```

## Configuration

Copie `.env.example` vers `.env` et ajuste les valeurs si besoin :

```bash
cp .env.example .env
```

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port d'écoute du serveur | `3000` |
| `DATA_FILE_PATH` | Chemin du fichier JSON de persistance | `./data/campusrate.json` |

L'application refuse de démarrer si une de ces variables est absente.

## Démarrage

```bash
npm run start:dev
```

Le serveur démarre sur `http://localhost:3000`, avec le préfixe `/api/v1` sur toutes les routes.

## Lint et compilation

```bash
npm run lint
npm run build
```

## Documentation Swagger

Une fois le serveur démarré, la documentation interactive est disponible sur :

**http://localhost:3000/api/docs**

## Contrat général de l'API

### Justification des choix de design

| Décision | Choix | Justification |
|---|---|---|
| Nommage des ressources | `places`, `reviews` | Anglais, pluriel, minuscule ; cohérent avec `placeId` déjà présent dans le modèle de données |
| Versionnement | Dans l'URL (`/api/v1/...`) | Recommandation retenue pour les APIs REST publiques et documentées |
| Imbrication | Combinaison | Imbriqué pour la création et le listage (le contexte du place est nécessaire) ; indépendant une fois l'id de la review connu — évite les chemins trop profonds tout en exprimant la relation réelle |
| Codes de statut | Standards REST (200/201/204/400/404/409) | Voir tableau des routes ci-dessous |

### Routes disponibles

| Méthode | URI | Description | Succès | Erreurs |
|---|---|---|---|---|
| `POST` | `/api/v1/places` | Créer un place | `201` | `400` |
| `GET` | `/api/v1/places` | Lister les places (filtre + pagination) | `200` | `400` |
| `GET` | `/api/v1/places/:id` | Consulter un place | `200` | `404` |
| `PATCH` | `/api/v1/places/:id` | Modifier partiellement un place | `200` | `400`, `404` |
| `DELETE` | `/api/v1/places/:id` | Supprimer un place | `204` | `404`, `409` |
| `POST` | `/api/v1/places/:id/reviews` | Créer une review pour ce place | `201` | `400`, `404` |
| `GET` | `/api/v1/places/:id/reviews` | Lister les reviews d'un place | `200` | `404` |
| `GET` | `/api/v1/reviews/:id` | Consulter une review | `200` | `404` |
| `PATCH` | `/api/v1/reviews/:id` | Modifier partiellement une review | `200` | `400`, `404` |
| `DELETE` | `/api/v1/reviews/:id` | Supprimer une review | `204` | `404` |

### Format des erreurs

Toutes les erreurs suivent le format Problem Details :

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Place plc_xxxx introuvable",
  "instance": "/api/v1/places/plc_xxxx"
}
```

### Format de pagination

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

## Tests manuels

Une collection Postman couvrant les scénarios principaux (création, consultation, modification, suppression, erreurs de validation, ressource inexistante, conflit de suppression, filtre, pagination, persistance après redémarrage) se trouve dans `postman/CampusRate.postman_collection.json`.

## Structure du projet
