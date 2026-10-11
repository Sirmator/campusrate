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
- Persistance des données dans MongoDB à l'aide de Mongoose.
- Validation stricte des entrées : types, formats, valeurs autorisées et rejet des propriétés inconnues.
- Gestion uniforme des erreurs au format Problem Details (`application/problem+json`).
- Ajout d'en-têtes de sécurité avec Helmet et configuration explicite de CORS.
- Documentation interactive de l'API avec Swagger/OpenAPI.

## 🛠️ Technologies

| Technologie | Utilisation |
|---|---|
| [NestJS](https://nestjs.com/) et TypeScript | Développement de l'API REST |
| [MongoDB](https://www.mongodb.com/) et Mongoose | Persistance des données |
| `class-validator` et `class-transformer` | Validation et transformation des données |
| `joi` | Validation de la configuration au démarrage |
| `helmet` | Ajout d'en-têtes de sécurité HTTP |
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

Les collections `places` et `reviews` sont créées automatiquement par MongoDB lors de leur première utilisation en écriture.

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

L'application refuse de démarrer si `MONGO_URI` est absente ou invalide.

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
| `POST` | `/api/v1/places` | Créer une place | `201` | `400` |
| `GET` | `/api/v1/places` | Lister les places avec filtrage et pagination | `200` | `400` |
| `GET` | `/api/v1/places/:id` | Consulter une place | `200` | `400`, `404` |
| `PATCH` | `/api/v1/places/:id` | Modifier partiellement une place | `200` | `400`, `404` |
| `DELETE` | `/api/v1/places/:id` | Supprimer une place | `204` | `400`, `404`, `409` |
| `POST` | `/api/v1/places/:placeId/reviews` | Créer une review pour une place | `201` | `400`, `404` |
| `GET` | `/api/v1/places/:placeId/reviews` | Lister les reviews d'une place | `200` | `400`, `404` |
| `GET` | `/api/v1/reviews/:id` | Consulter une review | `200` | `400`, `404` |
| `PATCH` | `/api/v1/reviews/:id` | Modifier partiellement une review | `200` | `400`, `404` |
| `DELETE` | `/api/v1/reviews/:id` | Supprimer une review | `204` | `400`, `404` |

**Règle métier :** une place qui possède encore des reviews ne peut pas être supprimée. L'API retourne alors une erreur `409 Conflict`.

### Changements par rapport au TP1

| Élément | TP1 | TP2 |
|---|---|---|
| Persistance | Fichier JSON | MongoDB |
| Format des identifiants | `plc_<uuid>` / `rev_<uuid>` | Identifiants MongoDB de 24 caractères hexadécimaux |
| Identifiant mal formé | `404` | `400` : le format est validé avant la recherche |

Les URI, les méthodes HTTP, les codes de succès et la structure des représentations JSON restent inchangés. Les identifiants sont traités comme des chaînes opaques par les clients.

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

Les erreurs internes ne divulguent ni pile d'exécution, ni chemin interne, ni détail technique provenant du pilote MongoDB.

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

Les filtres MongoDB sont construits à partir des champs autorisés et validés, plutôt que d'utiliser directement les objets fournis par le client. Cette approche contribue à prévenir les injections d'opérateurs MongoDB, par exemple `$ne`.

---

## 🔐 Sécurité HTTP

### Helmet

Helmet ajoute des en-têtes de sécurité HTTP aux réponses, notamment `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options` et `X-Frame-Options`, selon la configuration utilisée.

### CORS

CORS est configuré explicitement avec les paramètres suivants :

- **Origine autorisée :** `http://localhost:5173`
- **Méthodes :** `GET`, `POST`, `PATCH`, `DELETE`
- **En-têtes autorisés :** `Content-Type` et `Authorization`

L'origine configurée est une valeur de développement. Aucun frontend n'est actuellement associé au projet.

CORS contrôle l'accès des scripts exécutés dans les navigateurs aux réponses provenant d'une autre origine. Il ne constitue pas un mécanisme d'authentification et n'empêche pas, à lui seul, les requêtes envoyées avec Postman ou `curl`.

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

---

## 🧾 Options réalisées

| Code | Option | Points |
|---|---|---:|
| T1 | Explication du rôle de HTTPS dans le README | +1 |
| M3 | Justification du choix des références plutôt que de l'imbrication dans MongoDB | +2 |

Aucune autre option facultative n'est implantée.

---

## 🧪 Tests manuels

Une collection Postman contenant les scénarios de vérification se trouve dans le fichier suivant :

`postman/CampusRate.postman_collection.json`

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
- **Limitation de débit :** aucune mesure ne limite actuellement le nombre de requêtes.
- **Recalcul des statistiques :** le calcul de `averageRating` et de `reviewCount` relit les reviews de la place et n'est pas atomique. Des écritures simultanées peuvent entraîner des valeurs temporairement inexactes.
- **Suppression des places :** la vérification de l'absence de reviews avant la suppression n'est pas protégée par une transaction.
- **Configuration CORS :** l'origine autorisée est définie directement dans `main.ts` plutôt que dans une variable d'environnement.
- **Documentation Swagger :** l'interface est accessible sans restriction. En production, elle devrait être désactivée ou protégée si nécessaire.
- **Compte MongoDB :** le compte utilisé en développement possède des droits d'administration. En production, il faudrait utiliser un compte disposant uniquement des permissions nécessaires à la base de données de l'application.
- **Règles de validation :** les longueurs minimale et maximale de `description`, `authorName` et `comment`, ainsi que la limite de 50 résultats par page, sont des choix de conception.
- **Tests automatisés :** aucun test automatisé n'est actuellement configuré ; la vérification repose sur les scénarios manuels Postman.

<p align="center">
  <sub>CampusRate — Projet réalisé dans le cadre du cours 420-514</sub>
</p>
