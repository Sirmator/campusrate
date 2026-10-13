<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Helmet-Security-000000?logo=helmet&logoColor=white" alt="Helmet" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white" alt="Postman" />
</p>

# 🎓 CampusRate

API REST permettant à la communauté étudiante de consulter les endroits et les services du campus, ainsi que de publier des appréciations accompagnées d'une note.

Projet réalisé dans le cadre du cours **420-514 — Techniques de l'informatique**. Le TP2 fait évoluer l'API du TP1 : la persistance dans un fichier JSON est remplacée par MongoDB, la validation des données est renforcée et des mesures de sécurité HTTP sont ajoutées.

---

## 🎯 Objectif

CampusRate gère deux ressources principales :

- **Places** : endroits et services évalués, comme les espaces d'étude, les bibliothèques et les services alimentaires.
- **Reviews** : appréciations comprenant une note et un commentaire associés à une place précise.

## ✨ Fonctionnalités

- Création, consultation, modification et suppression des places.
- Création, consultation, modification et suppression des reviews.
- Filtrage des places par catégorie et pagination des résultats.
- Recalcul automatique de la note moyenne et du nombre de reviews de chaque place.
- Statistiques par catégorie calculées par une agrégation MongoDB.
- Persistance des données dans MongoDB à l'aide de Mongoose.
- Validation stricte des entrées : types, formats, valeurs autorisées et rejet des propriétés inconnues.
- Gestion uniforme des erreurs au format Problem Details (`application/problem+json`).
- Sécurité HTTP : Helmet, CORS configurable selon l'environnement, limitation de débit et limite de taille du corps des requêtes.
- Documentation interactive de l'API avec Swagger/OpenAPI.

## 🛠️ Technologies

| Technologie | Utilisation |
|---|---|
| [NestJS](https://nestjs.com/) et TypeScript | Développement de l'API REST |
| [MongoDB](https://www.mongodb.com/) et Mongoose | Persistance des données |
| `class-validator` et `class-transformer` | Validation et transformation des données |
| `joi` | Validation de la configuration au démarrage |
| `helmet` | Ajout d'en-têtes de sécurité HTTP |
| `@nestjs/throttler` | Limitation de débit |
| `@nestjs/swagger` | Documentation OpenAPI |
| Postman | Tests manuels de l'API |

## 📋 Prérequis

- Node.js **22.22.3 ou une version ultérieure de la branche 22.x**, ou **24.15 ou une version ultérieure de la branche 24.x**.
- npm.
- Une base de données MongoDB accessible, hébergée sur MongoDB Atlas ou installée localement.

---

## 🚀 Installation

Cloner le dépôt, accéder au répertoire du projet et installer les dépendances :

```bash
git clone https://github.com/Sirmator/campusrate.git
cd campusrate
npm ci
```

## 🗄️ Configuration de MongoDB

### Avec MongoDB Atlas

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Créer un cluster gratuit de niveau M0.
3. Créer un utilisateur de base de données avec un nom d'utilisateur et un mot de passe.
4. Ajouter son adresse IP à la liste d'accès dans **Network Access**.
5. Dans **Connect → Drivers**, récupérer la chaîne de connexion.
6. Remplacer les valeurs fictives et préciser le nom de la base de données, par exemple `campusrate-dev`.

### Avec MongoDB en local

La chaîne de connexion peut prendre la forme suivante :

```text
mongodb://localhost:27017/campusrate-dev
```

Les collections `places` et `reviews`, ainsi que leurs index, sont créées automatiquement par MongoDB et Mongoose lors du premier démarrage et de la première écriture.

## ⚙️ Configuration des variables d'environnement

Copier le fichier d'exemple pour créer le fichier `.env` :

```bash
cp .env.example .env
```

Configurer ensuite les variables suivantes :

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port d'écoute du serveur, soit `3000` par défaut | `3000` |
| `MONGO_URI` | Chaîne de connexion à MongoDB, obligatoire | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>` |
| `NODE_ENV` | `development`, `production` ou `test` ; `development` par défaut | `development` |
| `CORS_ORIGINS` | Origines CORS autorisées, séparées par des virgules. Obligatoire en production | `http://localhost:5173` |
| `THROTTLE_TTL` | Durée de la fenêtre de limitation de débit, en millisecondes (`60000` par défaut) | `60000` |
| `THROTTLE_LIMIT` | Nombre maximal de requêtes par fenêtre et par adresse IP (`100` par défaut) | `100` |
| `BODY_LIMIT` | Taille maximale du corps JSON des requêtes (`10kb` par défaut) | `10kb` |

L'application refuse de démarrer si `MONGO_URI` est absente ou invalide, ou si `CORS_ORIGINS` est absente alors que `NODE_ENV=production`.

**Important :** le fichier `.env` peut contenir des informations sensibles, notamment le mot de passe de la base de données. Il ne doit jamais être ajouté au dépôt Git. Le fichier `.env.example` doit uniquement contenir des valeurs fictives ou des indications de configuration.

## ▶️ Démarrage

Lancer le serveur en mode développement :

```bash
npm run start:dev
```

Le serveur est accessible à l'adresse suivante :

`http://localhost:3000`

Toutes les routes de l'API utilisent le préfixe `/api/v1`.

## 🧹 Vérification et compilation

Exécuter les commandes suivantes pour vérifier le code et compiler le projet :

```bash
npm run lint
npm run build
```

## 📚 Documentation Swagger

Une fois le serveur démarré, la documentation interactive est disponible à l'adresse suivante :

[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 📐 Contrat général de l'API

### Justification des choix de conception

| Décision | Choix | Justification |
|---|---|---|
| Nommage des ressources | `places`, `reviews` | Noms anglais, au pluriel et en minuscules, cohérents avec le champ `placeId`. |
| Versionnement | Dans l'URL (`/api/v1/...`) | Conforme à l'approche de versionnement utilisée dans le cadre du cours. |
| Imbrication des ressources | Combinaison | Les reviews sont imbriquées dans les routes de création et de consultation d'une place, mais restent accessibles individuellement lorsque leur identifiant est connu. |
| Version de l'API après la migration vers MongoDB | `v1` conservée | Le changement de système de persistance est interne à l'application et ne justifie pas, à lui seul, une nouvelle version de l'API. |

### Routes disponibles

| Méthode | URI | Description | Succès | Erreurs |
|---|---|---|---|---|
| `POST` | `/api/v1/places` | Créer une place | `201` | `400`, `409` |
| `GET` | `/api/v1/places` | Lister les places avec filtrage et pagination | `200` | `400` |
| `GET` | `/api/v1/places/stats/categories` | Statistiques par catégorie (agrégation MongoDB) | `200` | |
| `GET` | `/api/v1/places/:id` | Consulter une place | `200` | `400`, `404` |
| `PATCH` | `/api/v1/places/:id` | Modifier partiellement une place | `200` | `400`, `404`, `409` |
| `DELETE` | `/api/v1/places/:id` | Supprimer une place | `204` | `400`, `404`, `409` |
| `POST` | `/api/v1/places/:placeId/reviews` | Créer une review pour une place | `201` | `400`, `404` |
| `GET` | `/api/v1/places/:placeId/reviews` | Lister les reviews d'une place | `200` | `400`, `404` |
| `GET` | `/api/v1/reviews/:id` | Consulter une review | `200` | `400`, `404` |
| `PATCH` | `/api/v1/reviews/:id` | Modifier partiellement une review | `200` | `400`, `404` |
| `DELETE` | `/api/v1/reviews/:id` | Supprimer une review | `204` | `400`, `404` |

**Règles métier :**

- Une place qui possède encore des reviews ne peut pas être supprimée : l'API retourne alors une erreur `409 Conflict`.
- Deux places ne peuvent pas avoir à la fois le même nom et la même adresse : un `POST` ou un `PATCH` qui créerait un doublon retourne `409 Conflict`.

Sur toutes les routes, les erreurs `413` (corps de requête trop volumineux) et `429` (trop de requêtes) peuvent aussi survenir.

### Changements par rapport au TP1

| Élément | TP1 | TP2 |
|---|---|---|
| Persistance | Fichier JSON | MongoDB |
| Format des identifiants | `plc_<uuid>` / `rev_<uuid>` | Identifiants MongoDB de 24 caractères hexadécimaux |
| Identifiant mal formé | `404` | `400` : le format est validé avant la recherche |

Les URI existantes, les méthodes HTTP, les codes de succès et la structure des représentations JSON restent inchangés. Les identifiants sont traités comme des chaînes opaques par les clients. La route de statistiques est un ajout et ne modifie aucune route existante.

### Pagination

Les résultats paginés suivent la structure suivante :

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

### Format des erreurs

Toutes les erreurs sont retournées au format **Problem Details**, avec le type de contenu `application/problem+json`.

Exemple de réponse `404 Not Found` :

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Place 671f1a2b3c4d5e6f7a8b9c0d introuvable",
  "instance": "/api/v1/places/671f1a2b3c4d5e6f7a8b9c0d"
}
```

Les erreurs internes et les erreurs MongoDB ne divulguent ni pile d'exécution, ni chemin interne, ni détail technique provenant du pilote.

---

## ✅ Validations principales

Un `ValidationPipe` global rejette les propriétés inconnues grâce aux options `whitelist` et `forbidNonWhitelisted`.

Un client ne peut donc pas imposer les champs `id`, `createdAt`, `updatedAt`, `averageRating` ou `reviewCount` dans les requêtes où ces propriétés ne sont pas autorisées. Ces champs sont gérés par le serveur et leur présence non autorisée entraîne une réponse `400 Bad Request`.

| Ressource | Champ | Règle de validation |
|---|---|---|
| Place | `name`, `address` | Chaînes de caractères obligatoires |
| Place | `description` | Chaîne obligatoire, 500 caractères maximum |
| Place | `category` | Valeur obligatoire parmi `STUDY_SPACE`, `LIBRARY`, `FOOD_SERVICE`, `SPORTS`, `STUDENT_SERVICE`, `COMPUTER_LAB` et `OTHER` |
| Place | `services` | Tableau facultatif, sans doublons et vide par défaut |
| Place | `status` | Valeur parmi `ACTIVE`, `TEMPORARILY_CLOSED` et `INACTIVE` ; `ACTIVE` par défaut |
| Review | `authorName` | Chaîne de 2 à 100 caractères |
| Review | `rating` | Entier compris entre 1 et 5 |
| Review | `comment` | Chaîne de 10 à 1 000 caractères |
| Requête | `category` | Filtre exact dont la valeur est contrôlée |
| Requête | `page` / `limit` | Entiers ; `page` supérieur ou égal à 1 et `limit` compris entre 1 et 50 |
| Chemin | `id`, `placeId` | Identifiants MongoDB valides |
| Corps | Taille | Limitée par `BODY_LIMIT` (10 Ko par défaut) ; au-delà, `413` |

Les filtres MongoDB sont construits à partir des champs autorisés et validés, plutôt que d'utiliser directement les objets fournis par le client. Cette approche contribue à prévenir les injections d'opérateurs MongoDB, par exemple `$ne`.

---

## 🔐 Sécurité HTTP

### Helmet

Helmet ajoute des en-têtes de sécurité HTTP aux réponses, notamment `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options` et `X-Frame-Options`, selon la configuration utilisée.

### CORS

CORS est configuré explicitement :

- **Origines autorisées :** lues dans la variable `CORS_ORIGINS` (liste séparée par des virgules). En développement, la valeur par défaut est `http://localhost:5173`.
- **En production :** `CORS_ORIGINS` est obligatoire. L'application refuse de démarrer si elle est absente.
- **Méthodes :** `GET`, `POST`, `PATCH`, `DELETE`.
- **En-têtes autorisés :** `Content-Type` et `Authorization`.

L'origine par défaut est une valeur de développement. Aucun frontend n'est actuellement associé au projet.

CORS contrôle l'accès des scripts exécutés dans les navigateurs aux réponses provenant d'une autre origine. Il ne constitue pas un mécanisme d'authentification et n'empêche pas, à lui seul, les requêtes envoyées avec Postman ou `curl`.

### Limitation de débit

`@nestjs/throttler` limite le nombre de requêtes par adresse IP : 100 par minute par défaut, configurable avec `THROTTLE_LIMIT` et `THROTTLE_TTL`. Au-delà, l'API répond `429 Too Many Requests` au format Problem Details, avec un en-tête `Retry-After`.

### Taille du corps des requêtes

Le corps JSON est limité à `BODY_LIMIT` (10 Ko par défaut). Au-delà, l'API répond `413 Payload Too Large` au format Problem Details.

---

## 🔒 HTTPS

HTTPS chiffre les échanges entre le client et le serveur à l'aide de TLS, ce qui contribue à protéger les données contre les attaques de type « homme du milieu » (*man-in-the-middle*).

Dans CampusRate, les requêtes peuvent contenir des commentaires et des notes publiés par les utilisateurs. En production, HTTPS doit être configuré afin de protéger les communications entre les clients et l'API.

En développement local, l'application utilise HTTP pour simplifier les tests. La connexion à MongoDB doit également être protégée : avec MongoDB Atlas, la chaîne `mongodb+srv://` permet généralement au pilote MongoDB d'utiliser TLS par défaut, sauf configuration contraire.

---

## 🗂️ Modélisation MongoDB : références plutôt qu'imbrication

Les places et les reviews sont stockées dans deux collections MongoDB distinctes. Chaque review contient un champ `placeId` qui référence la place associée, plutôt que d'être directement intégrée au document de cette place.

Ce choix s'explique par les raisons suivantes :

- Une review possède son propre cycle de vie : elle peut être créée, modifiée et supprimée indépendamment de la place à laquelle elle est associée.
- Une review peut être consultée, modifiée et supprimée directement à partir de son propre identifiant.
- Cette séparation respecte le contrat HTTP établi dans le cadre du TP1.

## 📇 Index MongoDB

| Collection | Index | Justification |
|---|---|---|
| `reviews` | `placeId` | Accélère `GET /places/:placeId/reviews`, la requête la plus fréquente sur cette collection. |
| `places` | `name` + `address` (unique) | Empêche deux places identiques. L'unicité est garantie par MongoDB même si deux requêtes arrivent en même temps, ce qu'une simple vérification dans le service ne peut pas assurer. |

Une violation de l'index unique est traduite en `409 Conflict` au format Problem Details, sans détail du pilote MongoDB. L'unicité est sensible à la casse : « Salle A » et « salle a » sont deux places distinctes.

## 📊 Agrégation MongoDB : statistiques par catégorie

`GET /api/v1/places/stats/categories` retourne, pour chaque catégorie, le nombre de places, le nombre total de reviews et la moyenne des notes moyennes :

```json
[
  { "category": "LIBRARY", "placeCount": 1, "reviewCount": 1, "averageRating": 4 }
]
```

Le calcul est effectué par MongoDB (`$group`, `$project`, `$sort`). Le pipeline est défini dans le code et ne contient aucune donnée provenant du client.

`averageRating` est la moyenne des notes moyennes des places notées, arrondie à deux décimales. Ce n'est pas une moyenne pondérée par le nombre de reviews. Elle vaut `null` si aucune place de la catégorie n'est notée.

---

## 🧾 Options réalisées

| Code | Option | Points |
|---|---|---:|
| T1 | Explication du rôle de HTTPS dans le README | +1 |
| M3 | Justification du choix des références plutôt que de l'imbrication dans MongoDB | +2 |
| H4 | CORS configuré selon l'environnement | +2 |
| H1 | Limitation de débit | +4 |
| M2 | Agrégation MongoDB (`GET /places/stats/categories`) | +4 |
| H2 | Limite de taille du corps des requêtes et réponse `413` | +2 |
| M1 | Index unique, index sur `placeId` et gestion de la duplication (`409`) | +6 |

Aucune autre option facultative n'est implantée.

---

## 🧪 Tests manuels

Une collection Postman contenant les scénarios de vérification se trouve dans le fichier suivant :

`postman/CampusRate.postman_collection.json`

Les scénarios de vérification sont numérotés de #1 à #8. Les requêtes qui démontrent les options sont préfixées `OPT`.

Pour utiliser la collection :

1. Importer le fichier dans Postman.
2. Vérifier que la variable `baseUrl` vaut `http://localhost:3000/api/v1`.
3. Envoyer la requête #1, puis copier l'`id` retourné dans la variable de collection `placeId`.
4. Envoyer les requêtes qui utilisent `{{placeId}}`.

Les requêtes `OPT` de limitation de débit et de taille du corps demandent une préparation particulière : pour obtenir un `429`, démarrer le serveur avec `THROTTLE_LIMIT` à une valeur basse, par exemple `5`.

---

## 📁 Structure du projet

```text
src/
  config/       - Configuration typée de l'application et de MongoDB
  database/     - Enregistrement des schémas Mongoose
  places/       - Contrôleur, service, repository, schéma et DTO des places
  reviews/      - Contrôleurs, service, repository, schéma et DTO des reviews
  common/
    filters/    - Filtre global d'exceptions (Problem Details)
    pipes/      - Validation du format des identifiants MongoDB
    dto/        - DTO partagés, dont ceux associés à Problem Details
```

---

## ⚠️ Limites connues

- **Authentification et autorisation :** aucune n'est implémentée. Toute personne ayant accès à l'API peut potentiellement créer, modifier ou supprimer des données.
- **Limitation de débit :** le comptage se fait par adresse IP et en mémoire. Il ne serait pas partagé entre plusieurs instances du serveur.
- **Taille du corps :** la limite ne s'applique qu'au corps JSON.
- **Recalcul des statistiques :** le calcul de `averageRating` et de `reviewCount` relit les reviews de la place et n'est pas atomique. Des écritures simultanées peuvent entraîner des valeurs temporairement inexactes.
- **Suppression des places :** la vérification de l'absence de reviews avant la suppression n'est pas protégée par une transaction.
- **Statistiques par catégorie :** la moyenne est calculée à partir des notes moyennes des places, sans pondération par le nombre de reviews.
- **Unicité des places :** la contrainte `name` + `address` est sensible à la casse et aux espaces.
- **Documentation Swagger :** les réponses `413` et `429` ne sont pas documentées route par route. L'interface est accessible sans restriction : en production, elle devrait être désactivée ou protégée.
- **Compte MongoDB :** le compte utilisé en développement possède des droits d'administration. En production, il faudrait utiliser un compte disposant uniquement des permissions nécessaires à la base de données de l'application.
- **Règles de validation :** les longueurs minimale et maximale de `description`, `authorName` et `comment`, ainsi que la limite de 50 résultats par page, sont des choix de conception.
- **Tests automatisés :** aucun test automatisé n'est actuellement configuré ; la vérification repose sur les scénarios manuels Postman.

<p align="center">
  <sub>CampusRate — Projet réalisé dans le cadre du cours 420-514</sub>
</p>
