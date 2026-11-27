// Declarative description of every translatable content type.
// The admin forms, the Translations Management module and the completion
// indicators are all generated from this single configuration, so a new
// content type only needs to be added here (plus its Prisma models).

import type { RouteName } from "./i18n";

export type FieldType = "text" | "textarea" | "longtext" | "slug" | "image" | "number" | "checkbox" | "select" | "relation" | "lines";

export type FieldDef = {
  key: string;
  type: FieldType;
  label: string; // key under admin.fields / admin.*
  options?: { value: string; label: string }[]; // label = messages path
  relation?: EntityKey;
  slugFrom?: string;
};

export type EntityKey =
  | "pages"
  | "categories"
  | "products"
  | "services"
  | "projectCategories"
  | "projects"
  | "clients"
  | "gallery"
  | "settings";

export type EntityConfig = {
  key: EntityKey;
  model: string; // prisma delegate name
  trModel: string; // prisma delegate name of the translation table
  idType: "string" | "int";
  titleField: string; // translation field used as display name
  baseFields: FieldDef[];
  trFields: FieldDef[];
  required: string[]; // translation fields needed for "complete"
  seo: boolean;
  route?: RouteName; // public detail route (uses translation `slug`)
  singleton?: boolean;
  creatable?: boolean;
};

const seoFields: FieldDef[] = [
  { key: "seoTitle", type: "text", label: "admin.seoTitle" },
  { key: "seoDescription", type: "textarea", label: "admin.seoDescription" },
];

const common: FieldDef[] = [
  { key: "published", type: "checkbox", label: "admin.visibleOnSite" },
  { key: "sortOrder", type: "number", label: "admin.order" },
];

export const entities: Record<EntityKey, EntityConfig> = {
  pages: {
    key: "pages",
    model: "page",
    trModel: "pageTranslation",
    idType: "string",
    titleField: "title",
    baseFields: [{ key: "image", type: "image", label: "admin.image" }, ...common],
    trFields: [
      { key: "title", type: "text", label: "admin.fields.title" },
      { key: "subtitle", type: "textarea", label: "admin.fields.subtitle" },
      { key: "content", type: "longtext", label: "admin.fields.content" },
      { key: "image", type: "image", label: "admin.imageOverride" },
      ...seoFields,
    ],
    required: ["title", "subtitle", "seoTitle", "seoDescription"],
    seo: true,
    creatable: false,
  },
  categories: {
    key: "categories",
    model: "productCategory",
    trModel: "productCategoryTranslation",
    idType: "string",
    titleField: "name",
    baseFields: [{ key: "image", type: "image", label: "admin.image" }, ...common],
    trFields: [
      { key: "name", type: "text", label: "admin.fields.name" },
      { key: "slug", type: "slug", label: "admin.slug", slugFrom: "name" },
      { key: "description", type: "textarea", label: "admin.fields.description" },
      { key: "image", type: "image", label: "admin.imageOverride" },
      ...seoFields,
    ],
    required: ["name", "slug", "description"],
    seo: true,
    route: "plantCategory",
    creatable: true,
  },
  products: {
    key: "products",
    model: "product",
    trModel: "productTranslation",
    idType: "string",
    titleField: "name",
    baseFields: [
      { key: "image", type: "image", label: "admin.image" },
      { key: "categoryId", type: "relation", label: "admin.fields.category", relation: "categories" },
      {
        key: "lightLevel",
        type: "select",
        label: "admin.fields.lightLevel",
        options: [
          { value: "FULL_SUN", label: "plants.lightLevel.FULL_SUN" },
          { value: "PARTIAL_SHADE", label: "plants.lightLevel.PARTIAL_SHADE" },
          { value: "SHADE", label: "plants.lightLevel.SHADE" },
        ],
      },
      {
        key: "watering",
        type: "select",
        label: "admin.fields.watering",
        options: [
          { value: "LOW", label: "plants.wateringLevel.LOW" },
          { value: "MEDIUM", label: "plants.wateringLevel.MEDIUM" },
          { value: "HIGH", label: "plants.wateringLevel.HIGH" },
        ],
      },
      {
        key: "placement",
        type: "select",
        label: "admin.fields.placement",
        options: [
          { value: "INDOOR", label: "plants.placementValue.INDOOR" },
          { value: "OUTDOOR", label: "plants.placementValue.OUTDOOR" },
          { value: "BOTH", label: "plants.placementValue.BOTH" },
        ],
      },
      { key: "height", type: "text", label: "admin.fields.height" },
      { key: "potSize", type: "text", label: "admin.fields.potSize" },
      { key: "price", type: "text", label: "admin.fields.price" },
      { key: "featured", type: "checkbox", label: "admin.featured" },
      ...common,
    ],
    trFields: [
      { key: "name", type: "text", label: "admin.fields.name" },
      { key: "slug", type: "slug", label: "admin.slug", slugFrom: "name" },
      { key: "shortDescription", type: "textarea", label: "admin.fields.shortDescription" },
      { key: "description", type: "longtext", label: "admin.fields.description" },
      { key: "careTips", type: "longtext", label: "admin.fields.careTips" },
      { key: "origin", type: "text", label: "admin.fields.origin" },
      { key: "image", type: "image", label: "admin.imageOverride" },
      ...seoFields,
    ],
    required: ["name", "slug", "shortDescription", "description"],
    seo: true,
    route: "product",
    creatable: true,
  },
  services: {
    key: "services",
    model: "service",
    trModel: "serviceTranslation",
    idType: "string",
    titleField: "name",
    baseFields: [
      { key: "image", type: "image", label: "admin.image" },
      {
        key: "icon",
        type: "select",
        label: "admin.fields.icon",
        options: ["design", "planting", "lawn", "irrigation", "maintenance", "terrace", "tree"].map((v) => ({ value: v, label: v })),
      },
      { key: "featured", type: "checkbox", label: "admin.featured" },
      ...common,
    ],
    trFields: [
      { key: "name", type: "text", label: "admin.fields.name" },
      { key: "slug", type: "slug", label: "admin.slug", slugFrom: "name" },
      { key: "shortDescription", type: "textarea", label: "admin.fields.shortDescription" },
      { key: "description", type: "longtext", label: "admin.fields.description" },
      { key: "image", type: "image", label: "admin.imageOverride" },
      ...seoFields,
    ],
    required: ["name", "slug", "shortDescription", "description"],
    seo: true,
    route: "service",
    creatable: true,
  },
  projectCategories: {
    key: "projectCategories",
    model: "projectCategory",
    trModel: "projectCategoryTranslation",
    idType: "string",
    titleField: "name",
    baseFields: [...common],
    trFields: [
      { key: "name", type: "text", label: "admin.fields.name" },
      { key: "slug", type: "slug", label: "admin.slug", slugFrom: "name" },
    ],
    required: ["name"],
    seo: false,
    creatable: true,
  },
  projects: {
    key: "projects",
    model: "project",
    trModel: "projectTranslation",
    idType: "string",
    titleField: "title",
    baseFields: [
      { key: "image", type: "image", label: "admin.image" },
      { key: "categoryId", type: "relation", label: "admin.fields.category", relation: "projectCategories" },
      { key: "clientId", type: "relation", label: "admin.fields.client", relation: "clients" },
      { key: "year", type: "number", label: "admin.fields.year" },
      { key: "featured", type: "checkbox", label: "admin.featured" },
      ...common,
    ],
    trFields: [
      { key: "title", type: "text", label: "admin.fields.title" },
      { key: "slug", type: "slug", label: "admin.slug", slugFrom: "title" },
      { key: "summary", type: "textarea", label: "admin.fields.summary" },
      { key: "description", type: "longtext", label: "admin.fields.description" },
      { key: "location", type: "text", label: "admin.fields.location" },
      { key: "image", type: "image", label: "admin.imageOverride" },
      ...seoFields,
    ],
    required: ["title", "slug", "summary", "description"],
    seo: true,
    route: "project",
    creatable: true,
  },
  clients: {
    key: "clients",
    model: "client",
    trModel: "clientTranslation",
    idType: "string",
    titleField: "name",
    baseFields: [
      { key: "logo", type: "image", label: "admin.fields.logo" },
      { key: "website", type: "text", label: "admin.fields.website" },
      ...common,
    ],
    trFields: [
      { key: "name", type: "text", label: "admin.fields.name" },
      { key: "description", type: "textarea", label: "admin.fields.description" },
    ],
    required: ["name", "description"],
    seo: false,
    creatable: true,
  },
  gallery: {
    key: "gallery",
    model: "galleryItem",
    trModel: "galleryItemTranslation",
    idType: "string",
    titleField: "title",
    baseFields: [
      { key: "image", type: "image", label: "admin.image" },
      { key: "projectId", type: "relation", label: "admin.fields.project", relation: "projects" },
      ...common,
    ],
    trFields: [
      { key: "title", type: "text", label: "admin.fields.title" },
      { key: "caption", type: "textarea", label: "admin.fields.caption" },
      { key: "alt", type: "text", label: "admin.fields.alt" },
      { key: "image", type: "image", label: "admin.imageOverride" },
    ],
    required: ["title", "caption"],
    seo: false,
    creatable: true,
  },
  settings: {
    key: "settings",
    model: "siteSettings",
    trModel: "siteSettingsTranslation",
    idType: "int",
    titleField: "siteName",
    singleton: true,
    baseFields: [
      { key: "logoUrl", type: "image", label: "admin.fields.logo" },
      { key: "faviconUrl", type: "image", label: "admin.fields.favicon" },
      { key: "phones", type: "lines", label: "admin.fields.phones" },
      { key: "email", type: "text", label: "admin.fields.contactEmail" },
      { key: "mapLink", type: "text", label: "admin.fields.mapLink" },
      { key: "mapEmbedUrl", type: "text", label: "admin.fields.mapEmbedUrl" },
      { key: "facebookUrl", type: "text", label: "admin.fields.facebookUrl" },
      { key: "instagramUrl", type: "text", label: "admin.fields.instagramUrl" },
      { key: "whatsapp", type: "text", label: "admin.fields.whatsapp" },
    ],
    trFields: [
      { key: "siteName", type: "text", label: "admin.fields.siteName" },
      { key: "tagline", type: "text", label: "admin.fields.tagline" },
      { key: "address", type: "textarea", label: "admin.fields.address" },
      { key: "openingHours", type: "text", label: "admin.fields.openingHours" },
      { key: "footerText", type: "textarea", label: "admin.fields.footerText" },
      ...seoFields,
    ],
    required: ["siteName", "tagline", "address", "openingHours", "footerText", "seoTitle", "seoDescription"],
    seo: true,
    creatable: false,
  },
};

export const entityOrder: EntityKey[] = [
  "pages",
  "categories",
  "products",
  "services",
  "projectCategories",
  "projects",
  "clients",
  "gallery",
  "settings",
];

export function isEntityKey(v: string): v is EntityKey {
  return v in entities;
}

export type TrState = "complete" | "draft" | "missing";

/** Completion state of one translation row. */
export function translationState(cfg: EntityConfig, tr: Record<string, unknown> | undefined | null): TrState {
  if (!tr) return "missing";
  const filled = cfg.required.every((f) => typeof tr[f] === "string" && (tr[f] as string).trim().length > 0);
  if (!filled) return "missing";
  return tr.status === "PUBLISHED" ? "complete" : "draft";
}
