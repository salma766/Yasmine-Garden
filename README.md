# Pépinière Yasmine Gardens : site web et portail d'administration

Site multilingue (français, anglais, italien, arabe avec mise en page RTL complète) et portail d'administration pour la Pépinière Yasmine Gardens, Bouargoub / Belli, Nabeul.

## Technologies

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (propriétés logiques `start/end` pour le RTL)
- **PostgreSQL** + **Prisma** (une table de traductions par type de contenu)
- **Vercel Blob** pour les images et le logo envoyés depuis l'admin
- **Claude** (API Anthropic) pour l'assistant de traduction, facultatif

## Fonctionnalités

### Site public
- URL par langue : `/fr/`, `/en/`, `/it/`, `/ar/`, avec des segments traduits (`/fr/plantes`, `/en/plants`, `/it/piante`, `/ar/النباتات`) et des slugs traduits pour chaque plante, service, projet et catégorie.
- Sélecteur de langue dans la barre de navigation : il garde la page en cours quand une traduction existe et mémorise le choix du visiteur (cookie). La première visite sur `/` utilise ce cookie, sinon la langue du navigateur, sinon le français.
- Arabe en RTL au niveau de la mise en page (`<html dir="rtl">`) : navigation, menus, cartes, formulaires et icônes directionnelles inversés, police Cairo.
- Pages : accueil, à propos, catalogue de plantes avec catégories et fiche technique, aménagement paysager, réalisations, galerie (visionneuse), contact (formulaire, horaires, téléphones, carte).
- SEO : titre et méta-description par langue, balises `hreflang` + `x-default`, URL canoniques, Open Graph, `sitemap.xml` couvrant les 4 langues, `robots.txt`.

### Portail d'administration (`/admin`)
- Interface elle-même disponible en FR / EN / IT / AR (RTL en arabe).
- Tableau de bord avec le pourcentage de traductions complètes par langue et la liste des traductions manquantes.
- **Gestion des traductions** : tableau de tous les contenus × 4 langues, filtres par type, par langue et « manquantes uniquement ».
- Éditeur pour chaque page, plante, catégorie, service, projet, client, élément de galerie et pour les paramètres du site, avec un onglet par langue :
  - enregistrement indépendant de chaque langue ;
  - statut Brouillon / Publié par langue ;
  - champs SEO par langue ;
  - image propre à une langue (sinon l'image commune est utilisée) ;
  - aperçu de la langue sur le site (le contenu non publié est visible en aperçu uniquement pour l'admin connecté).
- **Assistant de traduction IA** : génère une proposition depuis une autre langue. Elle reste en brouillon jusqu'à ce que l'admin l'approuve. Une traduction déjà approuvée n'est jamais remplacée automatiquement.
- **Textes de l'interface** : modification des libellés (menus, boutons, formulaires, messages) dans chaque langue.
- **Paramètres du site** : logo (un emplacement provisoire s'affiche tant qu'aucun logo n'est envoyé), favicon, téléphones, e-mail, réseaux sociaux, adresse et horaires traduits.
- Messages reçus via le formulaire de contact.
- **Utilisateurs** : nombre illimité de comptes, avec deux rôles. **Éditeur** : tout le contenu, les traductions, les paramètres et les messages. **Administrateur** : tout cela, plus la gestion des utilisateurs. Il reste toujours au moins un administrateur.
- **Mon compte** : chacun peut changer son nom et son mot de passe.

## Tailles d'images conseillées

L'admin affiche la taille conseillée à côté de chaque champ image et vérifie la photo envoyée (trop petite, ou proportions différentes qui entraîneront un recadrage).

| Contenu | Taille (px) | Format |
|---|---|---|
| Pages (bandeau d'accueil, à propos…) | 1920 × 1080 | 16:9, sujet au centre |
| Catégories de plantes, plantes | 1200 × 1200 | carré, sujet au centre |
| Services, réalisations, catégories de projets | 1600 × 900 | 16:9 |
| Galerie | 1600 × 1200 | 4:3 (portrait accepté) |
| Logos des clients | 400 × 200 | PNG transparent |
| Logo du site | 600 × 200 | PNG ou SVG transparent |
| Favicon | 512 × 512 | PNG carré |

## Mise en ligne sur Vercel

1. Sur [vercel.com](https://vercel.com), **Add New → Project** et importez le dépôt GitHub `salma766/Yasmine-Garden`.
2. Avant le premier déploiement, dans l'onglet **Storage** du projet :
   - ajoutez une base **Neon (Postgres)** : elle crée `DATABASE_URL` et `DATABASE_URL_UNPOOLED` ;
   - ajoutez un **Blob store** : il crée `BLOB_READ_WRITE_TOKEN` (nécessaire pour envoyer le logo et les photos).
3. Dans **Settings → Environment Variables**, ajoutez :
   - `AUTH_SECRET` : une longue chaîne aléatoire (par exemple le résultat de `openssl rand -base64 32`) ;
   - `ADMIN_EMAIL` et `ADMIN_PASSWORD` : le compte administrateur créé au premier déploiement ;
   - `NEXT_PUBLIC_SITE_URL` : l'adresse publique du site (par exemple `https://yasmine-gardens.vercel.app`, puis votre nom de domaine) ;
   - `ANTHROPIC_API_KEY` (facultatif) : active l'assistant de traduction IA.
4. Déployez. La commande `vercel-build` crée les tables, ajoute le contenu de départ dans les 4 langues (seulement si la base est vide) et l'administrateur, puis construit le site.
5. Connectez-vous sur `https://<votre-site>/admin` et envoyez le logo dans **Paramètres du site**.

> Les réalisations, clients et photos de la galerie fournis au départ sont des **exemples** (avec des illustrations provisoires). Remplacez-les depuis l'admin par vos vrais projets et vos photos.

## Développement local

```bash
cp .env.example .env      # puis renseignez DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run db:migrate        # crée les tables
npm run db:seed           # contenu de départ + compte admin
npm run dev               # http://localhost:3000
```

Sans `BLOB_READ_WRITE_TOKEN`, les images envoyées en local sont enregistrées dans `public/uploads`.

## Architecture multilingue

- `src/lib/i18n.ts` : langues, sens d'écriture, segments d'URL traduits, construction des liens.
- `src/middleware.ts` : redirection vers la langue préférée, réécriture des URL traduites, mémorisation de la langue.
- `src/messages/{fr,en,it,ar}.ts` : textes de l'interface. TypeScript refuse la compilation s'il manque une clé dans une langue.
- `prisma/schema.prisma` : chaque contenu a une ligne de base (images, ordre, données techniques) et une ligne par langue dans sa table `…Translation`, reliées par `entityId`. Le site n'est pas dupliqué quatre fois.
- `src/lib/entities.ts` : description de chaque type de contenu. Les formulaires de l'admin, le module de traductions et les indicateurs de complétude en sont générés.
