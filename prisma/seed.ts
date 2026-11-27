/* eslint-disable no-console */
// Starter content in French, English, Italian and Arabic.
// Run with `npm run db:seed`. Content is only inserted into an empty database
// (or when SEED_FORCE=1, which first deletes existing content).
// Projects, clients and gallery entries are illustrative examples meant to be
// replaced from the admin with the nursery's real work and photos.

import { PrismaClient, type LightLevel, type Placement, type WateringLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
type L = "fr" | "en" | "it" | "ar";
const LOCALES: L[] = ["fr", "en", "it", "ar"];
type Tr = Record<L, Record<string, string>>;

const P = "/images/placeholders/";

function rows(t: Tr) {
  return LOCALES.map((locale) => ({ locale, ...t[locale], status: "PUBLISHED" as const, approved: true }));
}

// ---------------------------------------------------------------- settings
const settingsTr: Tr = {
  fr: {
    siteName: "Pépinière Yasmine Gardens",
    tagline: "Pépinière & aménagement paysager",
    address: "Route de Tunis Km 18\n8040 Bouargoub / Belli, Nabeul, Tunisie",
    openingHours: "Tous les jours, du lundi au dimanche, de 9h00 à 17h00",
    footerText:
      "Pépinière et société d'aménagement paysager à Bouargoub / Belli (Nabeul), spécialisée dans la production et la vente de plantes d'intérieur et d'extérieur, de plantes ornementales et dans l'aménagement d'espaces verts.",
    seoTitle: "Pépinière Yasmine Gardens | Plantes et aménagement paysager à Nabeul",
    seoDescription:
      "Pépinière à Bouargoub (Nabeul) : plantes d'intérieur et d'extérieur, plantes ornementales, création et entretien de jardins et d'espaces verts. Ouvert 7j/7 de 9h à 17h.",
  },
  en: {
    siteName: "Yasmine Gardens Nursery",
    tagline: "Plant nursery & landscaping",
    address: "Route de Tunis, Km 18\n8040 Bouargoub / Belli, Nabeul, Tunisia",
    openingHours: "Every day, Monday to Sunday, 9:00 am to 5:00 pm",
    footerText:
      "Plant nursery and landscaping company in Bouargoub / Belli (Nabeul), specialising in growing and selling indoor and outdoor plants and ornamental plants, and in creating green spaces.",
    seoTitle: "Yasmine Gardens Nursery | Plants and landscaping in Nabeul, Tunisia",
    seoDescription:
      "Plant nursery in Bouargoub (Nabeul, Tunisia): indoor and outdoor plants, ornamental plants, garden design and green space maintenance. Open daily, 9 am to 5 pm.",
  },
  it: {
    siteName: "Vivaio Yasmine Gardens",
    tagline: "Vivaio e progettazione del verde",
    address: "Route de Tunis Km 18\n8040 Bouargoub / Belli, Nabeul, Tunisia",
    openingHours: "Tutti i giorni, dal lunedì alla domenica, dalle 9:00 alle 17:00",
    footerText:
      "Vivaio e impresa di progettazione del verde a Bouargoub / Belli (Nabeul), specializzata nella produzione e vendita di piante da interno e da esterno, piante ornamentali e nella realizzazione di spazi verdi.",
    seoTitle: "Vivaio Yasmine Gardens | Piante e giardini a Nabeul, Tunisia",
    seoDescription:
      "Vivaio a Bouargoub (Nabeul, Tunisia): piante da interno e da esterno, piante ornamentali, progettazione e manutenzione di giardini. Aperto tutti i giorni dalle 9 alle 17.",
  },
  ar: {
    siteName: "مشتل ياسمين غاردنز",
    tagline: "مشتل وتنسيق حدائق",
    address: "طريق تونس كلم 18\n8040 بوعرقوب / بلّي، نابل، تونس",
    openingHours: "يوميًا من الاثنين إلى الأحد، من الساعة 9:00 صباحًا إلى 5:00 مساءً",
    footerText:
      "مشتل وشركة لتنسيق الحدائق في بوعرقوب / بلّي (ولاية نابل)، مختص في إنتاج وبيع النباتات الداخلية والخارجية ونباتات الزينة، وفي تهيئة المساحات الخضراء.",
    seoTitle: "مشتل ياسمين غاردنز | نباتات وتنسيق حدائق في نابل",
    seoDescription:
      "مشتل في بوعرقوب (نابل): نباتات داخلية وخارجية، نباتات زينة، تصميم وصيانة الحدائق والمساحات الخضراء. مفتوح يوميًا من 9 صباحًا إلى 5 مساءً.",
  },
};

// ---------------------------------------------------------------- pages
const pages: { key: string; image?: string; tr: Tr }[] = [
  {
    key: "home",
    image: P + "hero.svg",
    tr: {
      fr: {
        title: "Des plantes cultivées avec passion, des jardins pensés pour durer",
        subtitle:
          "Pépinière et paysagiste à Bouargoub, Yasmine Gardens produit et vend plantes d'intérieur, d'extérieur et ornementales, et crée vos espaces verts de A à Z.",
        content:
          "Installée sur la route de Tunis, au cœur du Cap Bon, la Pépinière Yasmine Gardens cultive une large gamme de plantes adaptées au climat méditerranéen.\n\nParticuliers, architectes, hôtels ou collectivités : nous vous accompagnons dans le choix de vos végétaux et réalisons vos projets d'aménagement paysager, de la conception à l'entretien.",
        seoTitle: "Pépinière Yasmine Gardens | Plantes et aménagement paysager à Nabeul",
        seoDescription:
          "Pépinière et paysagiste à Bouargoub (Nabeul) : plantes d'intérieur et d'extérieur, plantes ornementales, création et entretien d'espaces verts.",
      },
      en: {
        title: "Plants grown with passion, gardens designed to last",
        subtitle:
          "A plant nursery and landscaper in Bouargoub, Yasmine Gardens grows and sells indoor, outdoor and ornamental plants, and creates your green spaces from start to finish.",
        content:
          "Located on the Tunis road, in the heart of Cap Bon, Yasmine Gardens Nursery grows a wide range of plants suited to the Mediterranean climate.\n\nHomeowners, architects, hotels or local authorities: we help you choose your plants and carry out your landscaping projects, from design to maintenance.",
        seoTitle: "Yasmine Gardens Nursery | Plants and landscaping in Nabeul, Tunisia",
        seoDescription:
          "Plant nursery and landscaper in Bouargoub (Nabeul, Tunisia): indoor and outdoor plants, ornamental plants, green space design and maintenance.",
      },
      it: {
        title: "Piante coltivate con passione, giardini pensati per durare",
        subtitle:
          "Vivaio e paesaggista a Bouargoub, Yasmine Gardens produce e vende piante da interno, da esterno e ornamentali, e realizza i tuoi spazi verdi dall'inizio alla fine.",
        content:
          "Situato sulla strada per Tunisi, nel cuore di Cap Bon, il Vivaio Yasmine Gardens coltiva un'ampia gamma di piante adatte al clima mediterraneo.\n\nPrivati, architetti, hotel o enti pubblici: ti accompagniamo nella scelta delle piante e realizziamo i tuoi progetti di sistemazione del verde, dalla progettazione alla manutenzione.",
        seoTitle: "Vivaio Yasmine Gardens | Piante e progettazione giardini a Nabeul",
        seoDescription:
          "Vivaio e paesaggista a Bouargoub (Nabeul, Tunisia): piante da interno e da esterno, piante ornamentali, progettazione e manutenzione del verde.",
      },
      ar: {
        title: "نباتات نزرعها بشغف، وحدائق مصمّمة لتدوم",
        subtitle:
          "مشتل ومنسّق حدائق في بوعرقوب، ينتج مشتل ياسمين غاردنز ويبيع النباتات الداخلية والخارجية ونباتات الزينة، وينجز مساحاتكم الخضراء من الألف إلى الياء.",
        content:
          "يقع مشتل ياسمين غاردنز على طريق تونس في قلب الوطن القبلي، ويزرع تشكيلة واسعة من النباتات الملائمة للمناخ المتوسطي.\n\nأفرادًا كنتم أو مهندسين معماريين أو نزلًا أو بلديات: نرافقكم في اختيار نباتاتكم وننجز مشاريع تنسيق الحدائق من التصميم إلى الصيانة.",
        seoTitle: "مشتل ياسمين غاردنز | نباتات وتنسيق حدائق في نابل",
        seoDescription:
          "مشتل ومنسّق حدائق في بوعرقوب (نابل): نباتات داخلية وخارجية، نباتات زينة، تصميم وصيانة المساحات الخضراء.",
      },
    },
  },
  {
    key: "about",
    image: P + "nursery.svg",
    tr: {
      fr: {
        title: "Une pépinière ancrée dans le Cap Bon",
        subtitle: "Producteur de plantes et paysagiste à Bouargoub / Belli, au service des jardins de toute la Tunisie.",
        content:
          "La Pépinière Yasmine Gardens est une pépinière et société d'aménagement paysager située à Bouargoub / Belli, dans le gouvernorat de Nabeul.\n\nNous sommes spécialisés dans la production et la vente de plantes d'intérieur et d'extérieur, de plantes ornementales, ainsi que dans l'aménagement d'espaces verts.\n\n### Notre savoir-faire\n\n- Production et acclimatation de plantes sur notre site\n- Conseil personnalisé pour particuliers et professionnels\n- Conception et réalisation de jardins, terrasses et espaces verts\n- Entretien régulier de vos aménagements\n\nNotre pépinière vous accueille tous les jours, du lundi au dimanche, de 9h00 à 17h00, sur la route de Tunis, au kilomètre 18.",
        seoTitle: "À propos de la Pépinière Yasmine Gardens",
        seoDescription: "Découvrez la Pépinière Yasmine Gardens, producteur de plantes et paysagiste à Bouargoub / Belli, gouvernorat de Nabeul.",
      },
      en: {
        title: "A nursery rooted in Cap Bon",
        subtitle: "Plant grower and landscaper in Bouargoub / Belli, serving gardens all over Tunisia.",
        content:
          "Yasmine Gardens Nursery is a plant nursery and landscaping company located in Bouargoub / Belli, in the governorate of Nabeul.\n\nWe specialise in growing and selling indoor and outdoor plants and ornamental plants, and in creating green spaces.\n\n### Our expertise\n\n- Growing and acclimatising plants on our own site\n- Tailored advice for homeowners and professionals\n- Design and installation of gardens, terraces and green spaces\n- Regular maintenance of your landscaping\n\nOur nursery welcomes you every day, Monday to Sunday, from 9:00 am to 5:00 pm, on the Tunis road at kilometre 18.",
        seoTitle: "About Yasmine Gardens Nursery",
        seoDescription: "Discover Yasmine Gardens Nursery, plant grower and landscaper in Bouargoub / Belli, governorate of Nabeul, Tunisia.",
      },
      it: {
        title: "Un vivaio radicato a Cap Bon",
        subtitle: "Produttore di piante e paesaggista a Bouargoub / Belli, al servizio dei giardini di tutta la Tunisia.",
        content:
          "Il Vivaio Yasmine Gardens è un vivaio e un'impresa di progettazione del verde situato a Bouargoub / Belli, nel governatorato di Nabeul.\n\nSiamo specializzati nella produzione e vendita di piante da interno e da esterno e di piante ornamentali, oltre che nella realizzazione di spazi verdi.\n\n### Il nostro know-how\n\n- Produzione e acclimatazione delle piante nel nostro vivaio\n- Consulenza personalizzata per privati e professionisti\n- Progettazione e realizzazione di giardini, terrazze e spazi verdi\n- Manutenzione periodica delle vostre sistemazioni\n\nIl nostro vivaio vi accoglie tutti i giorni, dal lunedì alla domenica, dalle 9:00 alle 17:00, sulla strada per Tunisi al chilometro 18.",
        seoTitle: "Chi siamo | Vivaio Yasmine Gardens",
        seoDescription: "Scopri il Vivaio Yasmine Gardens, produttore di piante e paesaggista a Bouargoub / Belli, governatorato di Nabeul.",
      },
      ar: {
        title: "مشتل متجذّر في الوطن القبلي",
        subtitle: "منتج للنباتات ومنسّق حدائق في بوعرقوب / بلّي، في خدمة الحدائق في كامل تونس.",
        content:
          "مشتل ياسمين غاردنز هو مشتل وشركة لتنسيق الحدائق يقع في بوعرقوب / بلّي بولاية نابل.\n\nنحن مختصون في إنتاج وبيع النباتات الداخلية والخارجية ونباتات الزينة، وكذلك في تهيئة المساحات الخضراء.\n\n### خبرتنا\n\n- إنتاج النباتات وأقلمتها في مشتلنا\n- نصائح مخصّصة للأفراد والمهنيين\n- تصميم وإنجاز الحدائق والشرفات والمساحات الخضراء\n- صيانة دورية لمساحاتكم الخضراء\n\nيستقبلكم مشتلنا يوميًا من الاثنين إلى الأحد، من الساعة 9:00 إلى 17:00، على طريق تونس عند الكيلومتر 18.",
        seoTitle: "من نحن | مشتل ياسمين غاردنز",
        seoDescription: "تعرّف على مشتل ياسمين غاردنز، منتج النباتات ومنسّق الحدائق في بوعرقوب / بلّي بولاية نابل.",
      },
    },
  },
  ...(
    [
      ["plants", "leaf.svg",
        ["Nos plantes", "Plantes d'intérieur et d'extérieur, arbres, palmiers et plantes ornementales produits dans notre pépinière.", "Catalogue de plantes | Pépinière Yasmine Gardens", "Plantes d'intérieur, d'extérieur, arbres, palmiers, cactus et plantes ornementales à Bouargoub, Nabeul."],
        ["Our plants", "Indoor and outdoor plants, trees, palms and ornamental plants grown in our nursery.", "Plant catalogue | Yasmine Gardens Nursery", "Indoor and outdoor plants, trees, palms, cacti and ornamental plants in Bouargoub, Nabeul, Tunisia."],
        ["Le nostre piante", "Piante da interno e da esterno, alberi, palme e piante ornamentali coltivate nel nostro vivaio.", "Catalogo piante | Vivaio Yasmine Gardens", "Piante da interno e da esterno, alberi, palme, cactus e piante ornamentali a Bouargoub, Nabeul."],
        ["نباتاتنا", "نباتات داخلية وخارجية، أشجار، نخيل ونباتات زينة من إنتاج مشتلنا.", "كتالوج النباتات | مشتل ياسمين غاردنز", "نباتات داخلية وخارجية، أشجار، نخيل، صبّار ونباتات زينة في بوعرقوب، نابل."]],
      ["landscaping", "garden1.svg",
        ["Aménagement paysager", "Conception, création et entretien de jardins et d'espaces verts pour particuliers et professionnels.", "Aménagement paysager à Nabeul | Yasmine Gardens", "Création de jardins, engazonnement, arrosage automatique et entretien d'espaces verts dans le Cap Bon et partout en Tunisie."],
        ["Landscaping", "Design, creation and maintenance of gardens and green spaces for homeowners and businesses.", "Landscaping in Nabeul | Yasmine Gardens", "Garden design, lawns, automatic irrigation and green space maintenance in Cap Bon and across Tunisia."],
        ["Progettazione giardini", "Progettazione, realizzazione e manutenzione di giardini e spazi verdi per privati e aziende.", "Progettazione giardini a Nabeul | Yasmine Gardens", "Realizzazione di giardini, prati, irrigazione automatica e manutenzione del verde a Cap Bon e in tutta la Tunisia."],
        ["تنسيق الحدائق", "تصميم وإنجاز وصيانة الحدائق والمساحات الخضراء للأفراد والمؤسسات.", "تنسيق الحدائق في نابل | ياسمين غاردنز", "تصميم الحدائق، زراعة العشب، الري الآلي وصيانة المساحات الخضراء في الوطن القبلي وكامل تونس."]],
      ["projects", "garden2.svg",
        ["Nos réalisations", "Une sélection de jardins et d'espaces verts conçus et réalisés par nos équipes.", "Réalisations | Pépinière Yasmine Gardens", "Découvrez des jardins de villas, d'hôtels et d'espaces publics aménagés par Yasmine Gardens."],
        ["Our projects", "A selection of gardens and green spaces designed and built by our teams.", "Projects | Yasmine Gardens Nursery", "Discover villa, hotel and public space gardens landscaped by Yasmine Gardens."],
        ["Le nostre realizzazioni", "Una selezione di giardini e spazi verdi progettati e realizzati dalle nostre squadre.", "Realizzazioni | Vivaio Yasmine Gardens", "Scopri giardini di ville, hotel e spazi pubblici realizzati da Yasmine Gardens."],
        ["إنجازاتنا", "مجموعة مختارة من الحدائق والمساحات الخضراء التي صممتها وأنجزتها فرقنا.", "إنجازاتنا | مشتل ياسمين غاردنز", "اكتشف حدائق الفيلات والنزل والفضاءات العامة التي أنجزها ياسمين غاردنز."]],
      ["gallery", "nursery.svg",
        ["Galerie", "Nos plantes, notre pépinière et nos aménagements en images.", "Galerie photos | Pépinière Yasmine Gardens", "Photos de nos plantes, de notre pépinière à Bouargoub et de nos jardins."],
        ["Gallery", "Our plants, our nursery and our landscaping work in pictures.", "Photo gallery | Yasmine Gardens Nursery", "Photos of our plants, our nursery in Bouargoub and our gardens."],
        ["Galleria", "Le nostre piante, il nostro vivaio e i nostri giardini in immagini.", "Galleria fotografica | Vivaio Yasmine Gardens", "Foto delle nostre piante, del nostro vivaio a Bouargoub e dei nostri giardini."],
        ["معرض الصور", "نباتاتنا ومشتلنا وأعمال تنسيق الحدائق بالصور.", "معرض الصور | مشتل ياسمين غاردنز", "صور نباتاتنا ومشتلنا في بوعرقوب وحدائقنا."]],
      ["contact", "",
        ["Contactez-nous", "Une question, une demande de devis ? Écrivez-nous ou passez nous voir à la pépinière.", "Contact | Pépinière Yasmine Gardens", "Route de Tunis Km 18, Bouargoub. Tél. +216 26 980 445. Ouvert tous les jours de 9h à 17h."],
        ["Contact us", "A question or a quote request? Write to us or come and see us at the nursery.", "Contact | Yasmine Gardens Nursery", "Route de Tunis Km 18, Bouargoub, Tunisia. Phone +216 26 980 445. Open daily, 9 am to 5 pm."],
        ["Contattaci", "Una domanda o una richiesta di preventivo? Scrivici o vieni a trovarci al vivaio.", "Contatti | Vivaio Yasmine Gardens", "Route de Tunis Km 18, Bouargoub, Tunisia. Tel. +216 26 980 445. Aperto tutti i giorni dalle 9 alle 17."],
        ["اتصل بنا", "لديك سؤال أو طلب عرض سعر؟ راسلنا أو تفضّل بزيارتنا في المشتل.", "اتصل بنا | مشتل ياسمين غاردنز", "طريق تونس كلم 18، بوعرقوب. الهاتف 445 980 26 216+. مفتوح يوميًا من 9 صباحًا إلى 5 مساءً."]],
    ] as [string, string, string[], string[], string[], string[]][]
  ).map(([key, image, fr, en, it, ar]) => ({
    key,
    image: image ? P + image : undefined,
    tr: Object.fromEntries(
      ([["fr", fr], ["en", en], ["it", it], ["ar", ar]] as [L, string[]][]).map(([l, [title, subtitle, seoTitle, seoDescription]]) => [l, { title, subtitle, seoTitle, seoDescription }]),
    ) as unknown as Tr,
  })),
];

// ---------------------------------------------------------------- categories
// [key, image, fr name/slug/desc, en, it, ar]
const categories: { key: string; image: string; tr: Tr }[] = [
  ["indoor", "indoor.svg",
    ["Plantes d'intérieur", "plantes-interieur", "Plantes vertes et fleuries pour embellir maisons, bureaux et halls d'hôtel."],
    ["Indoor plants", "indoor-plants", "Green and flowering plants to brighten homes, offices and hotel lobbies."],
    ["Piante da interno", "piante-da-interno", "Piante verdi e fiorite per abbellire case, uffici e hall di hotel."],
    ["نباتات داخلية", "نباتات-داخلية", "نباتات خضراء ومزهرة لتزيين المنازل والمكاتب وبهو النزل."]],
  ["outdoor", "outdoor.svg",
    ["Plantes d'extérieur", "plantes-exterieur", "Arbustes, haies et plantes robustes pour jardins, terrasses et espaces publics."],
    ["Outdoor plants", "outdoor-plants", "Shrubs, hedges and hardy plants for gardens, terraces and public spaces."],
    ["Piante da esterno", "piante-da-esterno", "Arbusti, siepi e piante resistenti per giardini, terrazze e spazi pubblici."],
    ["نباتات خارجية", "نباتات-خارجية", "شجيرات وأسيجة ونباتات متينة للحدائق والشرفات والفضاءات العامة."]],
  ["trees", "olive.svg",
    ["Arbres & oliviers", "arbres-oliviers", "Oliviers, arbres d'ombrage et arbres fruitiers, jeunes ou adultes."],
    ["Trees & olive trees", "trees-olive-trees", "Olive trees, shade trees and fruit trees, young or mature."],
    ["Alberi e ulivi", "alberi-e-ulivi", "Ulivi, alberi da ombra e alberi da frutto, giovani o adulti."],
    ["أشجار وزياتين", "أشجار-وزياتين", "أشجار زيتون وأشجار ظل وأشجار مثمرة، صغيرة أو كبيرة."]],
  ["palms", "palm.svg",
    ["Palmiers", "palmiers", "Palmiers méditerranéens et exotiques pour une ambiance unique."],
    ["Palm trees", "palm-trees", "Mediterranean and exotic palms for a unique atmosphere."],
    ["Palme", "palme", "Palme mediterranee ed esotiche per un'atmosfera unica."],
    ["النخيل", "النخيل", "نخيل متوسطي واستوائي لأجواء مميزة."]],
  ["ornamental", "flowers.svg",
    ["Plantes ornementales & fleuries", "plantes-ornementales", "Plantes à fleurs et grimpantes pour colorer vos espaces toute l'année."],
    ["Ornamental & flowering plants", "ornamental-plants", "Flowering and climbing plants to colour your spaces all year round."],
    ["Piante ornamentali e fiorite", "piante-ornamentali", "Piante da fiore e rampicanti per colorare i tuoi spazi tutto l'anno."],
    ["نباتات الزينة والمزهرة", "نباتات-الزينة", "نباتات مزهرة ومتسلقة تضفي ألوانًا على مساحاتكم طوال السنة."]],
  ["succulents", "cactus.svg",
    ["Cactus & succulentes", "cactus-succulentes", "Plantes économes en eau, idéales pour les jardins secs et les rocailles."],
    ["Cacti & succulents", "cacti-succulents", "Water-wise plants, ideal for dry gardens and rockeries."],
    ["Cactus e succulente", "cactus-e-succulente", "Piante che richiedono poca acqua, ideali per giardini aridi e rocciosi."],
    ["الصبّار والنباتات العصارية", "الصبار-والعصاريات", "نباتات قليلة الاستهلاك للماء، مثالية للحدائق الجافة والصخرية."]],
].map(([key, image, fr, en, it, ar]) => ({
  key: key as string,
  image: P + (image as string),
  tr: Object.fromEntries(
    ([["fr", fr], ["en", en], ["it", it], ["ar", ar]] as [L, string[]][]).map(([l, [name, slug, description]]) => [l, { name, slug, description }]),
  ) as unknown as Tr,
}));

// ---------------------------------------------------------------- products
type ProductSeed = {
  cat: string;
  image: string;
  light: LightLevel;
  water: WateringLevel;
  place: Placement;
  height: string;
  pot: string;
  featured?: boolean;
  tr: Tr;
};

function product(
  cat: string,
  image: string,
  light: LightLevel,
  water: WateringLevel,
  place: Placement,
  height: string,
  pot: string,
  featured: boolean,
  data: Record<L, [string, string, string, string, string, string]>, // name, slug, short, description, care, origin
): ProductSeed {
  const tr = Object.fromEntries(
    LOCALES.map((l) => {
      const [name, slug, shortDescription, description, careTips, origin] = data[l];
      return [l, { name, slug, shortDescription, description, careTips, origin, seoTitle: name, seoDescription: shortDescription }];
    }),
  ) as unknown as Tr;
  return { cat, image: P + image, light, water, place, height, pot, featured, tr };
}

const products: ProductSeed[] = [
  product("trees", "olive.svg", "FULL_SUN", "LOW", "OUTDOOR", "1,5 – 3 m", "Ø 40 cm", true, {
    fr: ["Olivier", "olivier", "L'arbre emblématique de la Méditerranée, rustique et élégant.", "L'olivier (Olea europaea) apporte caractère et authenticité à tous les jardins. Très résistant à la sécheresse et à la chaleur, il s'adapte parfaitement au climat tunisien.\n\nNous proposons des sujets jeunes ainsi que des oliviers adultes pour un effet immédiat.", "- Plantez en plein soleil, dans un sol bien drainé\n- Arrosez régulièrement la première année, puis seulement en été\n- Taillez légèrement en fin d'hiver", "Bassin méditerranéen"],
    en: ["Olive tree", "olive-tree", "The iconic Mediterranean tree, hardy and elegant.", "The olive tree (Olea europaea) brings character and authenticity to any garden. Highly resistant to drought and heat, it is perfectly suited to the Tunisian climate.\n\nWe offer young trees as well as mature olive trees for an instant effect.", "- Plant in full sun, in well-drained soil\n- Water regularly in the first year, then only in summer\n- Prune lightly at the end of winter", "Mediterranean basin"],
    it: ["Ulivo", "ulivo", "L'albero simbolo del Mediterraneo, rustico ed elegante.", "L'ulivo (Olea europaea) dona carattere e autenticità a ogni giardino. Molto resistente alla siccità e al caldo, si adatta perfettamente al clima tunisino.\n\nProponiamo piante giovani e ulivi adulti per un effetto immediato.", "- Pianta in pieno sole, in un terreno ben drenato\n- Irriga regolarmente il primo anno, poi solo d'estate\n- Pota leggermente a fine inverno", "Bacino del Mediterraneo"],
    ar: ["شجرة الزيتون", "شجرة-الزيتون", "الشجرة الرمز للبحر الأبيض المتوسط، متينة وأنيقة.", "تضفي شجرة الزيتون (Olea europaea) طابعًا أصيلًا على كل حديقة. وهي شديدة المقاومة للجفاف والحرارة، وتتأقلم تمامًا مع المناخ التونسي.\n\nنوفّر شتلات صغيرة وأشجار زيتون كبيرة لنتيجة فورية.", "- ازرعها في الشمس الكاملة وفي تربة جيدة التصريف\n- اسقها بانتظام في السنة الأولى، ثم في الصيف فقط\n- قلّمها تقليمًا خفيفًا في آخر الشتاء", "حوض البحر الأبيض المتوسط"],
  }),
  product("indoor", "indoor.svg", "PARTIAL_SHADE", "MEDIUM", "INDOOR", "0,8 – 1,5 m", "Ø 24 cm", true, {
    fr: ["Monstera deliciosa", "monstera-deliciosa", "Grandes feuilles découpées pour une touche tropicale en intérieur.", "Le Monstera, aussi appelé « faux philodendron », séduit par ses grandes feuilles brillantes et ajourées. Facile à vivre, il apporte instantanément une ambiance jungle à votre intérieur.", "- Lumière vive mais sans soleil direct\n- Arrosez quand le terreau est sec en surface\n- Dépoussiérez les feuilles avec un chiffon humide", "Amérique centrale"],
    en: ["Monstera deliciosa", "monstera-deliciosa", "Large split leaves for a tropical touch indoors.", "Monstera, also known as the Swiss cheese plant, wins hearts with its large, glossy, perforated leaves. Easy to care for, it instantly brings a jungle feel to your home.", "- Bright light but no direct sun\n- Water when the top of the soil is dry\n- Dust the leaves with a damp cloth", "Central America"],
    it: ["Monstera deliciosa", "monstera-deliciosa", "Grandi foglie frastagliate per un tocco tropicale in casa.", "La Monstera conquista con le sue grandi foglie lucide e forate. Facile da curare, porta subito un'atmosfera da giungla nei tuoi interni.", "- Luce intensa ma senza sole diretto\n- Annaffia quando il terriccio è asciutto in superficie\n- Spolvera le foglie con un panno umido", "America centrale"],
    ar: ["مونستيرا", "مونستيرا", "أوراق كبيرة مشقوقة تضفي لمسة استوائية على الداخل.", "تتميّز المونستيرا بأوراقها الكبيرة اللامعة والمثقّبة. سهلة العناية، وتمنح منزلك أجواء الغابة الاستوائية على الفور.", "- ضوء ساطع دون شمس مباشرة\n- اسقها عندما يجف سطح التربة\n- امسح الأوراق بقطعة قماش مبللة", "أمريكا الوسطى"],
  }),
  product("indoor", "indoor.svg", "PARTIAL_SHADE", "MEDIUM", "INDOOR", "1 – 1,8 m", "Ø 27 cm", false, {
    fr: ["Ficus lyrata", "ficus-lyrata", "Le ficus aux feuilles en forme de lyre, très décoratif.", "Le Ficus lyrata est l'une des plantes d'intérieur les plus prisées des décorateurs. Son port élancé et ses grandes feuilles ondulées structurent élégamment un salon ou un bureau.", "- Placez-le près d'une fenêtre lumineuse\n- Évitez les courants d'air et les déplacements fréquents\n- Arrosage modéré, sans excès", "Afrique de l'Ouest"],
    en: ["Fiddle-leaf fig", "fiddle-leaf-fig", "The highly decorative fig with lyre-shaped leaves.", "The fiddle-leaf fig (Ficus lyrata) is one of the indoor plants most loved by interior designers. Its slender shape and large wavy leaves elegantly frame a living room or office.", "- Place it near a bright window\n- Avoid draughts and frequent moves\n- Moderate watering, never too much", "West Africa"],
    it: ["Ficus lyrata", "ficus-lyrata", "Il ficus dalle foglie a forma di lira, molto decorativo.", "Il Ficus lyrata è una delle piante da interno più amate dagli arredatori. Il portamento slanciato e le grandi foglie ondulate arredano con eleganza un soggiorno o un ufficio.", "- Mettilo vicino a una finestra luminosa\n- Evita le correnti d'aria e gli spostamenti frequenti\n- Annaffiature moderate, senza eccessi", "Africa occidentale"],
    ar: ["فيكس ليراتا", "فيكس-ليراتا", "فيكس بأوراق على شكل قيثارة، مزخرف جدًا.", "يُعدّ فيكس ليراتا من أكثر النباتات الداخلية رواجًا لدى مصممي الديكور. قوامه الممشوق وأوراقه الكبيرة المتموّجة يزيّنان الصالون أو المكتب بأناقة.", "- ضعه قرب نافذة مضيئة\n- تجنّب تيارات الهواء ونقله باستمرار\n- ري معتدل دون إفراط", "غرب إفريقيا"],
  }),
  product("indoor", "leaf.svg", "SHADE", "LOW", "INDOOR", "0,5 – 1 m", "Ø 19 cm", false, {
    fr: ["Sansevieria", "sansevieria", "Plante quasi indestructible qui purifie l'air.", "La Sansevieria, ou « langue de belle-mère », tolère la faible lumière et les oublis d'arrosage. Ses feuilles dressées apportent une touche graphique et contemporaine.", "- Supporte la mi-ombre comme la lumière vive\n- Arrosez peu : tous les 15 jours en été, une fois par mois en hiver", "Afrique tropicale"],
    en: ["Snake plant", "snake-plant", "An almost indestructible plant that purifies the air.", "The snake plant (Sansevieria) tolerates low light and forgotten waterings. Its upright leaves add a graphic, contemporary touch.", "- Tolerates partial shade as well as bright light\n- Water sparingly: every two weeks in summer, once a month in winter", "Tropical Africa"],
    it: ["Sansevieria", "sansevieria", "Pianta quasi indistruttibile che purifica l'aria.", "La Sansevieria, detta anche « lingua di suocera », tollera la poca luce e le annaffiature dimenticate. Le sue foglie erette aggiungono un tocco grafico e contemporaneo.", "- Sopporta sia la mezz'ombra sia la luce intensa\n- Annaffia poco: ogni 15 giorni d'estate, una volta al mese d'inverno", "Africa tropicale"],
    ar: ["سانسيفيريا", "سانسيفيريا", "نبتة شبه لا تُقهر تنقّي الهواء.", "تتحمّل السانسيفيريا الإضاءة الضعيفة ونسيان الري. وتضفي أوراقها المنتصبة لمسة عصرية أنيقة.", "- تتحمّل الظل الجزئي والضوء الساطع\n- اسقها قليلًا: كل 15 يومًا صيفًا ومرة في الشهر شتاءً", "إفريقيا الاستوائية"],
  }),
  product("palms", "palm.svg", "FULL_SUN", "MEDIUM", "OUTDOOR", "2 – 5 m", "Motte / Root ball", true, {
    fr: ["Palmier Washingtonia", "palmier-washingtonia", "Palmier élancé à croissance rapide, idéal pour les allées.", "Le Washingtonia robusta est un palmier très résistant, apprécié pour sa silhouette élancée et ses grandes palmes en éventail. Il structure les allées, entrées de villas et abords de piscines.", "- Plein soleil\n- Arrosage régulier les deux premières années\n- Retirez les palmes sèches", "Mexique, Californie"],
    en: ["Washingtonia palm", "washingtonia-palm", "A tall, fast-growing palm, ideal for driveways.", "Washingtonia robusta is a very hardy palm, valued for its slender silhouette and large fan-shaped fronds. It frames driveways, villa entrances and pool surroundings.", "- Full sun\n- Regular watering for the first two years\n- Remove dry fronds", "Mexico, California"],
    it: ["Palma Washingtonia", "palma-washingtonia", "Palma slanciata a crescita rapida, ideale per i viali.", "La Washingtonia robusta è una palma molto resistente, apprezzata per la sagoma slanciata e le grandi foglie a ventaglio. Valorizza viali, ingressi di ville e bordi piscina.", "- Pieno sole\n- Irrigazione regolare nei primi due anni\n- Elimina le foglie secche", "Messico, California"],
    ar: ["نخلة واشنطونيا", "نخلة-واشنطونيا", "نخلة ممشوقة سريعة النمو، مثالية للممرات.", "نخلة واشنطونيا روبوستا شديدة المقاومة، وتُقدَّر لقوامها الممشوق وسعفها الكبير على شكل مروحة. تزيّن الممرات ومداخل الفيلات ومحيط المسابح.", "- شمس كاملة\n- ري منتظم خلال السنتين الأوليين\n- أزل السعف اليابس", "المكسيك، كاليفورنيا"],
  }),
  product("palms", "palm.svg", "FULL_SUN", "LOW", "BOTH", "0,6 – 1,5 m", "Ø 30 cm", false, {
    fr: ["Palmier nain (Chamaerops)", "palmier-nain", "Petit palmier méditerranéen, parfait en pot ou en massif.", "Le Chamaerops humilis est le seul palmier originaire d'Afrique du Nord. Compact et très rustique, il convient aux terrasses, aux massifs et aux jardins secs.", "- Soleil ou mi-ombre\n- Très résistant à la sécheresse une fois installé", "Afrique du Nord"],
    en: ["Dwarf fan palm", "dwarf-fan-palm", "A small Mediterranean palm, perfect in pots or beds.", "Chamaerops humilis is the only palm native to North Africa. Compact and very hardy, it suits terraces, flower beds and dry gardens.", "- Sun or partial shade\n- Very drought-tolerant once established", "North Africa"],
    it: ["Palma nana (Chamaerops)", "palma-nana", "Piccola palma mediterranea, perfetta in vaso o in aiuola.", "Il Chamaerops humilis è l'unica palma originaria del Nord Africa. Compatto e molto rustico, è adatto a terrazze, aiuole e giardini aridi.", "- Sole o mezz'ombra\n- Molto resistente alla siccità una volta attecchito", "Nord Africa"],
    ar: ["الدوم (النخلة القزمة)", "الدوم", "نخلة متوسطية صغيرة، مثالية في الأصيص أو في الأحواض.", "الدوم (Chamaerops humilis) هو النخيل الوحيد الأصيل في شمال إفريقيا. مدمج وشديد التحمّل، يناسب الشرفات والأحواض والحدائق الجافة.", "- شمس أو ظل جزئي\n- يقاوم الجفاف جيدًا بعد تثبّته", "شمال إفريقيا"],
  }),
  product("ornamental", "flowers.svg", "FULL_SUN", "LOW", "OUTDOOR", "1 – 2 m", "Ø 25 cm", true, {
    fr: ["Bougainvillier", "bougainvillier", "Grimpante généreuse aux couleurs éclatantes tout l'été.", "Le bougainvillier habille murs, pergolas et clôtures de bractées fuchsia, orange, blanches ou violettes. Il adore la chaleur et fleurit abondamment de mai à novembre.", "- Plein soleil, contre un mur chaud\n- Arrosage modéré : trop d'eau réduit la floraison\n- Taille de formation au printemps", "Amérique du Sud"],
    en: ["Bougainvillea", "bougainvillea", "A generous climber with vibrant colours all summer.", "Bougainvillea covers walls, pergolas and fences with fuchsia, orange, white or purple bracts. It loves heat and flowers profusely from May to November.", "- Full sun, against a warm wall\n- Moderate watering: too much water reduces flowering\n- Shape-prune in spring", "South America"],
    it: ["Bouganvillea", "bouganvillea", "Rampicante generosa dai colori vivaci per tutta l'estate.", "La bouganvillea riveste muri, pergolati e recinzioni di brattee fucsia, arancioni, bianche o viola. Ama il caldo e fiorisce abbondantemente da maggio a novembre.", "- Pieno sole, contro un muro caldo\n- Irrigazione moderata: troppa acqua riduce la fioritura\n- Potatura di formazione in primavera", "America del Sud"],
    ar: ["الجهنمية (بوغنفيليا)", "الجهنمية", "نبتة متسلقة سخية بألوان زاهية طوال الصيف.", "تكسو الجهنمية الجدران والعرائش والأسيجة بأوراق ملوّنة فوشيا أو برتقالية أو بيضاء أو بنفسجية. تحب الحرارة وتزهر بغزارة من ماي إلى نوفمبر.", "- شمس كاملة، بجانب جدار دافئ\n- ري معتدل: الإفراط في الماء يقلّل الإزهار\n- تقليم تشكيلي في الربيع", "أمريكا الجنوبية"],
  }),
  product("ornamental", "flowers.svg", "FULL_SUN", "MEDIUM", "OUTDOOR", "1 – 3 m", "Ø 22 cm", false, {
    fr: ["Jasmin", "jasmin", "Le parfum emblématique des soirées tunisiennes.", "Le jasmin (Jasminum officinale et J. sambac) est indissociable de la culture tunisienne. Ses petites fleurs blanches très parfumées embaument terrasses et jardins du printemps à l'automne.", "- Soleil ou mi-ombre\n- Palissez-le sur un treillage ou une pergola\n- Arrosage régulier en été", "Asie"],
    en: ["Jasmine", "jasmine", "The iconic scent of Tunisian summer evenings.", "Jasmine (Jasminum officinale and J. sambac) is inseparable from Tunisian culture. Its small, highly fragrant white flowers perfume terraces and gardens from spring to autumn.", "- Sun or partial shade\n- Train it on a trellis or pergola\n- Regular watering in summer", "Asia"],
    it: ["Gelsomino", "gelsomino", "Il profumo simbolo delle serate tunisine.", "Il gelsomino (Jasminum officinale e J. sambac) è inseparabile dalla cultura tunisina. I suoi piccoli fiori bianchi molto profumati inebriano terrazze e giardini dalla primavera all'autunno.", "- Sole o mezz'ombra\n- Fallo arrampicare su un graticcio o un pergolato\n- Irrigazione regolare d'estate", "Asia"],
    ar: ["الياسمين", "الياسمين", "العطر الرمز لسهرات الصيف التونسية.", "الياسمين (Jasminum officinale و J. sambac) جزء لا يتجزأ من الثقافة التونسية. تعطّر أزهاره البيضاء الصغيرة الشرفات والحدائق من الربيع إلى الخريف.", "- شمس أو ظل جزئي\n- ثبّته على شبكة أو عريشة\n- ري منتظم في الصيف", "آسيا"],
  }),
  product("outdoor", "outdoor.svg", "FULL_SUN", "LOW", "OUTDOOR", "1 – 2,5 m", "Ø 25 cm", false, {
    fr: ["Laurier-rose", "laurier-rose", "Arbuste fleuri très résistant, idéal en haie.", "Le laurier-rose (Nerium oleander) fleurit généreusement tout l'été en blanc, rose ou rouge. Il résiste à la chaleur, au vent et aux embruns, ce qui en fait un allié des jardins côtiers.", "- Plein soleil\n- Peu d'arrosage une fois installé\n- Attention : plante toxique en cas d'ingestion", "Bassin méditerranéen"],
    en: ["Oleander", "oleander", "A very hardy flowering shrub, ideal for hedges.", "Oleander (Nerium oleander) flowers generously all summer in white, pink or red. It withstands heat, wind and sea spray, making it a great ally for coastal gardens.", "- Full sun\n- Little watering once established\n- Caution: toxic if ingested", "Mediterranean basin"],
    it: ["Oleandro", "oleandro", "Arbusto fiorito molto resistente, ideale per siepi.", "L'oleandro (Nerium oleander) fiorisce generosamente per tutta l'estate in bianco, rosa o rosso. Resiste al caldo, al vento e alla salsedine: un alleato dei giardini costieri.", "- Pieno sole\n- Poche annaffiature una volta attecchito\n- Attenzione: pianta tossica se ingerita", "Bacino del Mediterraneo"],
    ar: ["الدفلى", "الدفلى", "شجيرة مزهرة شديدة التحمّل، مثالية كسياج.", "تزهر الدفلى (Nerium oleander) بسخاء طوال الصيف بالأبيض أو الوردي أو الأحمر. تقاوم الحرارة والرياح ورذاذ البحر، ما يجعلها حليفة الحدائق الساحلية.", "- شمس كاملة\n- ري قليل بعد تثبّتها\n- تنبيه: نبتة سامة عند البلع", "حوض البحر الأبيض المتوسط"],
  }),
  product("trees", "citrus.svg", "FULL_SUN", "MEDIUM", "OUTDOOR", "1,2 – 2 m", "Ø 35 cm", true, {
    fr: ["Citronnier", "citronnier", "Arbre fruitier parfumé, en pleine terre ou en grand bac.", "Le citronnier offre un feuillage persistant, une floraison très parfumée et des fruits presque toute l'année. Les agrumes du Cap Bon sont réputés : un incontournable pour les jardins tunisiens.", "- Plein soleil, à l'abri du vent\n- Arrosages réguliers, sans détremper le sol\n- Apport d'engrais pour agrumes au printemps", "Asie du Sud-Est"],
    en: ["Lemon tree", "lemon-tree", "A fragrant fruit tree, in the ground or in a large planter.", "The lemon tree offers evergreen foliage, highly fragrant blossom and fruit almost all year round. Cap Bon citrus is renowned: a must for Tunisian gardens.", "- Full sun, sheltered from the wind\n- Regular watering without waterlogging\n- Feed with citrus fertiliser in spring", "Southeast Asia"],
    it: ["Limone", "limone", "Albero da frutto profumato, in piena terra o in grande vaso.", "Il limone offre fogliame persistente, una fioritura molto profumata e frutti quasi tutto l'anno. Gli agrumi di Cap Bon sono rinomati: un must per i giardini tunisini.", "- Pieno sole, al riparo dal vento\n- Annaffiature regolari senza ristagni\n- Concime per agrumi in primavera", "Sud-est asiatico"],
    ar: ["شجرة الليمون", "شجرة-الليمون", "شجرة مثمرة عطرة، في الأرض أو في حوض كبير.", "تتميز شجرة الليمون بأوراق دائمة الخضرة وأزهار عطرة وثمار على مدار السنة تقريبًا. وقوارص الوطن القبلي مشهورة: لا غنى عنها في الحدائق التونسية.", "- شمس كاملة، بعيدًا عن الرياح\n- ري منتظم دون إغراق التربة\n- سماد خاص بالقوارص في الربيع", "جنوب شرق آسيا"],
  }),
  product("succulents", "cactus.svg", "FULL_SUN", "LOW", "BOTH", "0,3 – 1 m", "Ø 20 cm", false, {
    fr: ["Agave americana", "agave-americana", "Succulente sculpturale pour jardins secs et rocailles.", "L'agave forme une rosette spectaculaire de feuilles charnues bleutées. Elle ne demande presque aucun entretien et apporte une forte présence graphique aux jardins méditerranéens.", "- Plein soleil, sol très drainant\n- Arrosage exceptionnel en été uniquement", "Mexique"],
    en: ["Agave americana", "agave-americana", "A sculptural succulent for dry gardens and rockeries.", "Agave forms a spectacular rosette of fleshy blue-grey leaves. It needs almost no maintenance and gives Mediterranean gardens a strong graphic presence.", "- Full sun, very free-draining soil\n- Occasional watering in summer only", "Mexico"],
    it: ["Agave americana", "agave-americana", "Succulenta scultorea per giardini aridi e rocciosi.", "L'agave forma una spettacolare rosetta di foglie carnose blu-grigie. Non richiede quasi manutenzione e dona una forte presenza grafica ai giardini mediterranei.", "- Pieno sole, terreno molto drenante\n- Annaffiature occasionali solo d'estate", "Messico"],
    ar: ["الصبّار الأمريكي (أغاف)", "أغاف", "نبتة عصارية منحوتة للحدائق الجافة والصخرية.", "يكوّن الأغاف وريدة مدهشة من الأوراق اللحمية المائلة إلى الزرقة. لا يحتاج تقريبًا إلى أي صيانة ويضفي حضورًا مميزًا على الحدائق المتوسطية.", "- شمس كاملة وتربة جيدة التصريف\n- ري استثنائي في الصيف فقط", "المكسيك"],
  }),
  product("succulents", "cactus.svg", "FULL_SUN", "LOW", "BOTH", "0,3 – 0,6 m", "Ø 17 cm", false, {
    fr: ["Aloe vera", "aloe-vera", "Plante succulente décorative aux vertus apaisantes.", "L'aloe vera est une plante facile qui se plaît aussi bien en pot sur une terrasse qu'en rocaille. Ses feuilles charnues renferment un gel apprécié pour ses vertus apaisantes.", "- Soleil ou forte lumière\n- Laissez sécher le substrat entre deux arrosages", "Péninsule arabique"],
    en: ["Aloe vera", "aloe-vera", "A decorative succulent with soothing properties.", "Aloe vera is an easy plant that thrives in a pot on a terrace as well as in a rockery. Its fleshy leaves contain a gel valued for its soothing properties.", "- Sun or bright light\n- Let the soil dry out between waterings", "Arabian Peninsula"],
    it: ["Aloe vera", "aloe-vera", "Succulenta decorativa dalle proprietà lenitive.", "L'aloe vera è una pianta facile che sta bene sia in vaso su un terrazzo sia in un giardino roccioso. Le sue foglie carnose contengono un gel apprezzato per le proprietà lenitive.", "- Sole o luce intensa\n- Lascia asciugare il terriccio tra un'annaffiatura e l'altra", "Penisola arabica"],
    ar: ["الصبّار (ألوفيرا)", "ألوفيرا", "نبتة عصارية مزخرفة ذات خصائص مهدّئة.", "الألوفيرا نبتة سهلة تنمو جيدًا في أصيص على الشرفة أو في حديقة صخرية. تحتوي أوراقها اللحمية على هلام معروف بخصائصه المهدّئة.", "- شمس أو ضوء قوي\n- اترك التربة تجف بين كل سقيتين", "شبه الجزيرة العربية"],
  }),
];

// ---------------------------------------------------------------- services
type SvcSeed = { icon: string; image: string; tr: Tr };
function svc(icon: string, image: string, data: Record<L, [string, string, string, string]>): SvcSeed {
  return {
    icon,
    image: P + image,
    tr: Object.fromEntries(
      LOCALES.map((l) => {
        const [name, slug, shortDescription, description] = data[l];
        return [l, { name, slug, shortDescription, description, seoTitle: name, seoDescription: shortDescription }];
      }),
    ) as unknown as Tr,
  };
}

const services: SvcSeed[] = [
  svc("design", "design.svg", {
    fr: ["Conception de jardins", "conception-jardins", "Étude, plans et choix des végétaux adaptés à votre terrain et à votre budget.", "Chaque projet commence par une visite de votre terrain et l'écoute de vos envies. Nous étudions l'exposition, le sol et l'usage des espaces pour vous proposer un plan d'aménagement et une palette végétale adaptée.\n\n- Relevé et analyse du site\n- Plan d'aménagement et visuels\n- Sélection des plantes et des matériaux\n- Devis détaillé"],
    en: ["Garden design", "garden-design", "Study, plans and plant selection suited to your site and budget.", "Every project starts with a visit to your site and listening to your wishes. We study sun exposure, soil and how the spaces will be used, then propose a landscape plan and a suitable planting palette.\n\n- Site survey and analysis\n- Landscape plan and visuals\n- Selection of plants and materials\n- Detailed quote"],
    it: ["Progettazione di giardini", "progettazione-giardini", "Studio, progetto e scelta delle piante adatte al tuo terreno e al tuo budget.", "Ogni progetto inizia con un sopralluogo e l'ascolto dei tuoi desideri. Studiamo esposizione, terreno e uso degli spazi per proporti un progetto e una selezione di piante su misura.\n\n- Rilievo e analisi del sito\n- Progetto e immagini\n- Scelta di piante e materiali\n- Preventivo dettagliato"],
    ar: ["تصميم الحدائق", "تصميم-الحدائق", "دراسة ومخططات واختيار النباتات الملائمة لأرضكم وميزانيتكم.", "يبدأ كل مشروع بزيارة أرضكم والاستماع إلى رغباتكم. ندرس التعرض للشمس ونوع التربة واستعمال الفضاءات لنقترح عليكم مخطط تهيئة ومجموعة نباتات ملائمة.\n\n- معاينة الموقع وتحليله\n- مخطط التهيئة وتصوّرات مرئية\n- اختيار النباتات والمواد\n- عرض سعر مفصّل"],
  }),
  svc("planting", "garden1.svg", {
    fr: ["Création d'espaces verts", "creation-espaces-verts", "Réalisation complète de jardins, massifs, haies et plantations.", "Nos équipes réalisent l'ensemble des travaux : préparation du sol, apport de terre végétale, plantation d'arbres, d'arbustes et de massifs, pose de paillage et d'allées.\n\nNous utilisons en priorité les plantes produites dans notre pépinière, déjà acclimatées au climat local."],
    en: ["Green space creation", "green-space-creation", "Complete installation of gardens, beds, hedges and plantings.", "Our teams carry out all the work: soil preparation, topsoil supply, planting of trees, shrubs and beds, mulching and paths.\n\nWe primarily use plants grown in our own nursery, already acclimatised to the local climate."],
    it: ["Realizzazione di spazi verdi", "realizzazione-spazi-verdi", "Realizzazione completa di giardini, aiuole, siepi e piantumazioni.", "Le nostre squadre eseguono tutti i lavori: preparazione del terreno, apporto di terra vegetale, messa a dimora di alberi, arbusti e aiuole, pacciamatura e vialetti.\n\nUtilizziamo in primo luogo le piante prodotte nel nostro vivaio, già acclimatate al clima locale."],
    ar: ["تهيئة المساحات الخضراء", "تهيئة-المساحات-الخضراء", "إنجاز متكامل للحدائق والأحواض والأسيجة والغراسات.", "تتولى فرقنا جميع الأشغال: تهيئة التربة، جلب التربة الزراعية، غراسة الأشجار والشجيرات والأحواض، وضع الغطاء العضوي وتهيئة الممرات.\n\nنستعمل بالأساس نباتات من إنتاج مشتلنا، متأقلمة مسبقًا مع المناخ المحلي."],
  }),
  svc("lawn", "lawn.svg", {
    fr: ["Engazonnement", "engazonnement", "Pose de gazon en rouleau ou semis pour une pelouse dense et durable.", "Nous préparons le sol, installons l'arrosage et posons un gazon adapté à l'usage et à l'ensoleillement : gazon en rouleau pour un résultat immédiat ou semis pour les grandes surfaces.\n\nNous vous conseillons des variétés résistantes à la chaleur et économes en eau."],
    en: ["Lawn installation", "lawn-installation", "Turf or seeded lawns for a dense, long-lasting grass cover.", "We prepare the soil, install irrigation and lay a lawn suited to use and sun exposure: rolled turf for an instant result or seeding for large areas.\n\nWe recommend heat-resistant, water-wise varieties."],
    it: ["Realizzazione di prati", "realizzazione-prati", "Prato a rotoli o seminato per un tappeto erboso fitto e duraturo.", "Prepariamo il terreno, installiamo l'irrigazione e realizziamo un prato adatto all'uso e all'esposizione: a rotoli per un risultato immediato o seminato per le grandi superfici.\n\nTi consigliamo varietà resistenti al caldo e a basso consumo d'acqua."],
    ar: ["زراعة العشب", "زراعة-العشب", "تركيب العشب الجاهز أو البذر للحصول على مرج كثيف ودائم.", "نهيّئ التربة ونركّب شبكة الري ونزرع عشبًا ملائمًا للاستعمال وللتعرض للشمس: عشب جاهز للحصول على نتيجة فورية أو بذر للمساحات الكبيرة.\n\nننصحكم بأصناف تقاوم الحرارة وتقتصد في الماء."],
  }),
  svc("irrigation", "irrigation.svg", {
    fr: ["Arrosage automatique", "arrosage-automatique", "Systèmes goutte-à-goutte et asperseurs pour économiser l'eau.", "Un arrosage bien conçu, c'est un jardin en bonne santé et une facture d'eau maîtrisée. Nous concevons et installons des réseaux goutte-à-goutte, tuyères et asperseurs, avec programmateur.\n\n- Étude des besoins en eau\n- Installation et réglage\n- Maintenance et mise en route saisonnière"],
    en: ["Automatic irrigation", "automatic-irrigation", "Drip and sprinkler systems that save water.", "Well-designed irrigation means a healthy garden and a controlled water bill. We design and install drip, spray and sprinkler networks with timers.\n\n- Water requirement study\n- Installation and adjustment\n- Maintenance and seasonal start-up"],
    it: ["Irrigazione automatica", "irrigazione-automatica", "Impianti a goccia e irrigatori per risparmiare acqua.", "Un'irrigazione ben progettata significa un giardino in salute e consumi d'acqua sotto controllo. Progettiamo e installiamo impianti a goccia, spruzzatori e irrigatori con programmatore.\n\n- Studio del fabbisogno idrico\n- Installazione e regolazione\n- Manutenzione e avvio stagionale"],
    ar: ["الري الآلي", "الري-الآلي", "أنظمة الري قطرة قطرة والرشاشات لاقتصاد الماء.", "الري المدروس يعني حديقة سليمة وفاتورة ماء تحت السيطرة. نصمّم ونركّب شبكات الري قطرة قطرة والرشاشات مع مبرمج آلي.\n\n- دراسة الحاجيات من الماء\n- التركيب والضبط\n- الصيانة والتشغيل الموسمي"],
  }),
  svc("maintenance", "maintenance.svg", {
    fr: ["Entretien des espaces verts", "entretien-espaces-verts", "Tonte, taille, désherbage et soins réguliers de vos jardins.", "Nous proposons des contrats d'entretien ponctuels ou annuels pour particuliers, résidences, hôtels et entreprises : tonte, taille des haies et des arbres, désherbage, fertilisation et traitements.\n\nUn interlocuteur unique suit votre jardin toute l'année."],
    en: ["Green space maintenance", "green-space-maintenance", "Mowing, pruning, weeding and regular care of your gardens.", "We offer one-off or annual maintenance contracts for homeowners, residences, hotels and businesses: mowing, hedge and tree pruning, weeding, fertilising and treatments.\n\nA single contact looks after your garden all year round."],
    it: ["Manutenzione del verde", "manutenzione-verde", "Taglio dell'erba, potature, diserbo e cure regolari dei tuoi giardini.", "Offriamo contratti di manutenzione occasionali o annuali per privati, residence, hotel e aziende: taglio del prato, potatura di siepi e alberi, diserbo, concimazione e trattamenti.\n\nUn unico referente segue il tuo giardino tutto l'anno."],
    ar: ["صيانة المساحات الخضراء", "صيانة-المساحات-الخضراء", "جزّ العشب والتقليم وإزالة الأعشاب والعناية المنتظمة بحدائقكم.", "نقترح عقود صيانة ظرفية أو سنوية للأفراد والإقامات والنزل والمؤسسات: جزّ العشب، تقليم الأسيجة والأشجار، إزالة الأعشاب الضارة، التسميد والمداواة.\n\nمخاطب واحد يتابع حديقتكم طوال السنة."],
  }),
  svc("terrace", "terrace.svg", {
    fr: ["Terrasses & jardins en pots", "terrasses-jardins-pots", "Aménagement de terrasses, balcons et patios avec bacs et plantes.", "Même sans jardin, profitez de la nature : nous aménageons terrasses, balcons, toits et patios avec des bacs, des jardinières et des plantes adaptées à la culture en pot et au vent."],
    en: ["Terraces & container gardens", "terraces-container-gardens", "Landscaping of terraces, balconies and patios with planters and plants.", "Even without a garden, enjoy nature: we landscape terraces, balconies, rooftops and patios with planters, window boxes and plants suited to container growing and wind."],
    it: ["Terrazze e giardini in vaso", "terrazze-giardini-in-vaso", "Allestimento di terrazze, balconi e patii con vasi e piante.", "Anche senza giardino, goditi la natura: allestiamo terrazze, balconi, tetti e patii con vasi, fioriere e piante adatte alla coltivazione in contenitore e al vento."],
    ar: ["الشرفات وحدائق الأصص", "الشرفات-وحدائق-الأصص", "تهيئة الشرفات والبلكونات والأفنية بالأحواض والنباتات.", "حتى بدون حديقة، استمتعوا بالطبيعة: نهيّئ الشرفات والبلكونات والأسطح والأفنية بأحواض ونباتات ملائمة للزراعة في الأصص ومقاومة للرياح."],
  }),
];

// ---------------------------------------------------------------- project categories
const projectCats: Tr[] = [
  { fr: { name: "Villas & résidences", slug: "villas-residences" }, en: { name: "Villas & residences", slug: "villas-residences" }, it: { name: "Ville e residenze", slug: "ville-residenze" }, ar: { name: "فيلات وإقامات", slug: "فيلات-وإقامات" } },
  { fr: { name: "Hôtels & tourisme", slug: "hotels-tourisme" }, en: { name: "Hotels & tourism", slug: "hotels-tourism" }, it: { name: "Hotel e turismo", slug: "hotel-turismo" }, ar: { name: "نزل وسياحة", slug: "نزل-وسياحة" } },
  { fr: { name: "Entreprises & espaces publics", slug: "entreprises-espaces-publics" }, en: { name: "Businesses & public spaces", slug: "businesses-public-spaces" }, it: { name: "Aziende e spazi pubblici", slug: "aziende-spazi-pubblici" }, ar: { name: "مؤسسات وفضاءات عامة", slug: "مؤسسات-وفضاءات-عامة" } },
];

// ---------------------------------------------------------------- clients (examples)
const clients: Tr[] = [
  { fr: { name: "Hôtel en bord de mer", description: "Création et entretien des jardins d'un hôtel de la côte de Hammamet." }, en: { name: "Seaside hotel", description: "Creation and maintenance of the gardens of a hotel on the Hammamet coast." }, it: { name: "Hotel sul mare", description: "Realizzazione e manutenzione dei giardini di un hotel sulla costa di Hammamet." }, ar: { name: "نزل على شاطئ البحر", description: "تهيئة وصيانة حدائق نزل على ساحل الحمامات." } },
  { fr: { name: "Résidence privée", description: "Aménagement paysager complet d'une résidence de villas à Nabeul." }, en: { name: "Private residence", description: "Complete landscaping of a villa residence in Nabeul." }, it: { name: "Residenza privata", description: "Sistemazione completa del verde di un complesso di ville a Nabeul." }, ar: { name: "إقامة خاصة", description: "تنسيق متكامل لحدائق إقامة فيلات في نابل." } },
  { fr: { name: "Siège d'entreprise", description: "Plantes d'intérieur et espaces verts pour un siège social du Grand Tunis." }, en: { name: "Company headquarters", description: "Indoor plants and green spaces for a head office in Greater Tunis." }, it: { name: "Sede aziendale", description: "Piante da interno e spazi verdi per una sede aziendale della Grande Tunisi." }, ar: { name: "مقر مؤسسة", description: "نباتات داخلية ومساحات خضراء لمقر اجتماعي في تونس الكبرى." } },
  { fr: { name: "Municipalité", description: "Plantation d'alignements d'arbres et de ronds-points fleuris." }, en: { name: "Municipality", description: "Planting of tree-lined avenues and flowered roundabouts." }, it: { name: "Comune", description: "Piantumazione di viali alberati e rotatorie fiorite." }, ar: { name: "بلدية", description: "غراسة صفوف من الأشجار وتزيين المفترقات بالأزهار." } },
];

// ---------------------------------------------------------------- projects (examples)
type ProjSeed = { cat: number; client: number; year: number; image: string; tr: Tr };
function proj(cat: number, client: number, year: number, image: string, data: Record<L, [string, string, string, string, string]>): ProjSeed {
  return {
    cat,
    client,
    year,
    image: P + image,
    tr: Object.fromEntries(
      LOCALES.map((l) => {
        const [title, slug, summary, description, location] = data[l];
        return [l, { title, slug, summary, description, location, seoTitle: title, seoDescription: summary }];
      }),
    ) as unknown as Tr,
  };
}

const projects: ProjSeed[] = [
  proj(0, 1, 2024, "garden1.svg", {
    fr: ["Jardin méditerranéen d'une villa", "jardin-mediterraneen-villa", "Oliviers, lavandes et allées en pierre pour un jardin sobre et économe en eau.", "Pour cette villa, nous avons imaginé un jardin méditerranéen inspiré des paysages du Cap Bon : oliviers adultes, massifs de lavandes et de romarins, allées en pierre naturelle.\n\nUn réseau goutte-à-goutte assure un arrosage précis et économe.", "Nabeul"],
    en: ["Mediterranean villa garden", "mediterranean-villa-garden", "Olive trees, lavender and stone paths for a simple, water-wise garden.", "For this villa, we designed a Mediterranean garden inspired by the landscapes of Cap Bon: mature olive trees, beds of lavender and rosemary, natural stone paths.\n\nA drip system provides precise, water-saving irrigation.", "Nabeul"],
    it: ["Giardino mediterraneo di una villa", "giardino-mediterraneo-villa", "Ulivi, lavande e vialetti in pietra per un giardino sobrio e a basso consumo d'acqua.", "Per questa villa abbiamo immaginato un giardino mediterraneo ispirato ai paesaggi di Cap Bon: ulivi adulti, aiuole di lavanda e rosmarino, vialetti in pietra naturale.\n\nUn impianto a goccia garantisce un'irrigazione precisa ed economica.", "Nabeul"],
    ar: ["حديقة متوسطية لفيلا", "حديقة-متوسطية-لفيلا", "أشجار زيتون وخزامى وممرات حجرية لحديقة بسيطة مقتصدة في الماء.", "صمّمنا لهذه الفيلا حديقة متوسطية مستوحاة من مناظر الوطن القبلي: أشجار زيتون كبيرة، أحواض من الخزامى وإكليل الجبل، وممرات من الحجر الطبيعي.\n\nتضمن شبكة ري قطرة قطرة سقيًا دقيقًا ومقتصدًا.", "نابل"],
  }),
  proj(1, 0, 2023, "garden2.svg", {
    fr: ["Jardins d'un hôtel balnéaire", "jardins-hotel-balneaire", "Palmiers, bougainvilliers et pelouses autour de la piscine d'un hôtel.", "Aménagement des abords de la piscine et des espaces de détente d'un hôtel : plantation de palmiers Washingtonia, massifs fleuris de bougainvilliers et de lauriers-roses, engazonnement et arrosage automatique.\n\nNos équipes assurent aujourd'hui l'entretien des jardins tout au long de l'année.", "Hammamet"],
    en: ["Seaside hotel gardens", "seaside-hotel-gardens", "Palms, bougainvillea and lawns around a hotel swimming pool.", "Landscaping of the pool area and relaxation spaces of a hotel: planting of Washingtonia palms, flowering beds of bougainvillea and oleander, lawns and automatic irrigation.\n\nOur teams now maintain the gardens all year round.", "Hammamet"],
    it: ["Giardini di un hotel sul mare", "giardini-hotel-sul-mare", "Palme, bouganvillee e prati intorno alla piscina di un hotel.", "Sistemazione dell'area piscina e degli spazi relax di un hotel: messa a dimora di palme Washingtonia, aiuole fiorite di bouganvillea e oleandri, prati e irrigazione automatica.\n\nOggi le nostre squadre curano la manutenzione dei giardini tutto l'anno.", "Hammamet"],
    ar: ["حدائق نزل شاطئي", "حدائق-نزل-شاطئي", "نخيل وجهنمية ومروج حول مسبح نزل.", "تهيئة محيط المسبح وفضاءات الاستراحة في نزل: غراسة نخيل واشنطونيا، أحواض مزهرة من الجهنمية والدفلى، زراعة العشب والري الآلي.\n\nتتولى فرقنا اليوم صيانة الحدائق على مدار السنة.", "الحمامات"],
  }),
  proj(2, 2, 2024, "garden3.svg", {
    fr: ["Espaces verts d'un siège social", "espaces-verts-siege-social", "Plantes d'intérieur, patio végétalisé et parking ombragé.", "Pour ce siège d'entreprise, nous avons végétalisé l'accueil et les bureaux avec des plantes d'intérieur, créé un patio planté pour les collaborateurs et ombragé le parking par une rangée d'arbres.", "Grand Tunis"],
    en: ["Head office green spaces", "head-office-green-spaces", "Indoor plants, a planted patio and a shaded car park.", "For this company headquarters, we greened the reception and offices with indoor plants, created a planted patio for staff and shaded the car park with a row of trees.", "Greater Tunis"],
    it: ["Spazi verdi di una sede aziendale", "spazi-verdi-sede-aziendale", "Piante da interno, patio verde e parcheggio ombreggiato.", "Per questa sede aziendale abbiamo arredato con piante da interno l'accoglienza e gli uffici, creato un patio verde per i collaboratori e ombreggiato il parcheggio con un filare di alberi.", "Grande Tunisi"],
    ar: ["مساحات خضراء لمقر اجتماعي", "مساحات-خضراء-لمقر-اجتماعي", "نباتات داخلية وفناء مخضرّ ومأوى سيارات مظلّل.", "زيّنا لهذا المقر الاجتماعي فضاء الاستقبال والمكاتب بنباتات داخلية، وأنشأنا فناءً مغروسًا للموظفين، وظلّلنا مأوى السيارات بصف من الأشجار.", "تونس الكبرى"],
  }),
  proj(0, 1, 2022, "garden4.svg", {
    fr: ["Jardin sec et rocaille", "jardin-sec-rocaille", "Cactus, agaves et graminées pour un jardin presque sans arrosage.", "Sur un terrain en pente très ensoleillé, nous avons créé un jardin sec mêlant rochers, cactus, agaves, aloès et plantes aromatiques. Le résultat : un jardin spectaculaire qui ne demande presque pas d'eau.", "Korba"],
    en: ["Dry garden and rockery", "dry-garden-rockery", "Cacti, agaves and grasses for a garden that needs almost no watering.", "On a very sunny sloping plot, we created a dry garden combining rocks, cacti, agaves, aloes and aromatic plants. The result: a striking garden that needs hardly any water.", "Korba"],
    it: ["Giardino arido e roccioso", "giardino-arido-roccioso", "Cactus, agavi e graminacee per un giardino quasi senza irrigazione.", "Su un terreno in pendenza molto soleggiato abbiamo creato un giardino arido che unisce rocce, cactus, agavi, aloe e piante aromatiche. Il risultato: un giardino spettacolare che non richiede quasi acqua.", "Korba"],
    ar: ["حديقة جافة وصخرية", "حديقة-جافة-وصخرية", "صبّار وأغاف وأعشاب لحديقة لا تكاد تحتاج إلى سقي.", "على قطعة أرض منحدرة ومشمسة جدًا، أنشأنا حديقة جافة تجمع بين الصخور والصبّار والأغاف والألوفيرا والنباتات العطرية. والنتيجة حديقة لافتة لا تكاد تحتاج إلى الماء.", "قربة"],
  }),
];

// ---------------------------------------------------------------- gallery
const gallery: { image: string; project?: number; tr: Tr }[] = [
  ["nursery.svg", undefined, ["Notre pépinière", "Des milliers de plantes cultivées à Bouargoub."], ["Our nursery", "Thousands of plants grown in Bouargoub."], ["Il nostro vivaio", "Migliaia di piante coltivate a Bouargoub."], ["مشتلنا", "آلاف النباتات المزروعة في بوعرقوب."]],
  ["olive.svg", undefined, ["Oliviers adultes", "Des sujets adultes pour un effet immédiat."], ["Mature olive trees", "Mature trees for an instant effect."], ["Ulivi adulti", "Piante adulte per un effetto immediato."], ["أشجار زيتون كبيرة", "أشجار كبيرة لنتيجة فورية."]],
  ["garden1.svg", 0, ["Allée méditerranéenne", "Pierre naturelle, lavandes et oliviers."], ["Mediterranean path", "Natural stone, lavender and olive trees."], ["Vialetto mediterraneo", "Pietra naturale, lavande e ulivi."], ["ممر متوسطي", "حجر طبيعي وخزامى وأشجار زيتون."]],
  ["garden2.svg", 1, ["Bord de piscine", "Palmiers et massifs fleuris autour d'une piscine d'hôtel."], ["Poolside", "Palms and flower beds around a hotel pool."], ["Bordo piscina", "Palme e aiuole fiorite intorno alla piscina di un hotel."], ["حافة المسبح", "نخيل وأحواض مزهرة حول مسبح نزل."]],
  ["flowers.svg", undefined, ["Plantes fleuries", "Couleurs et parfums toute l'année."], ["Flowering plants", "Colour and fragrance all year round."], ["Piante fiorite", "Colori e profumi tutto l'anno."], ["نباتات مزهرة", "ألوان وعطور طوال السنة."]],
  ["indoor.svg", undefined, ["Plantes d'intérieur", "Une sélection pour la maison et le bureau."], ["Indoor plants", "A selection for home and office."], ["Piante da interno", "Una selezione per la casa e l'ufficio."], ["نباتات داخلية", "تشكيلة للمنزل والمكتب."]],
  ["garden4.svg", 3, ["Jardin sec", "Cactus et agaves sur une rocaille ensoleillée."], ["Dry garden", "Cacti and agaves on a sunny rockery."], ["Giardino arido", "Cactus e agavi su un giardino roccioso soleggiato."], ["حديقة جافة", "صبّار وأغاف على صخور مشمسة."]],
  ["lawn.svg", undefined, ["Pose de gazon", "Une pelouse dense et uniforme."], ["Lawn laying", "A dense, even lawn."], ["Posa del prato", "Un prato fitto e uniforme."], ["تركيب العشب", "مرج كثيف ومتجانس."]],
  ["palm.svg", undefined, ["Palmiers", "Washingtonia et palmiers nains."], ["Palm trees", "Washingtonia and dwarf fan palms."], ["Palme", "Washingtonia e palme nane."], ["النخيل", "واشنطونيا ودوم."]],
].map(([image, project, fr, en, it, ar]) => ({
  image: P + (image as string),
  project: project as number | undefined,
  tr: Object.fromEntries(
    ([["fr", fr], ["en", en], ["it", it], ["ar", ar]] as [L, string[]][]).map(([l, [title, caption]]) => [l, { title, caption, alt: title }]),
  ) as unknown as Tr,
}));

// ---------------------------------------------------------------- run
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set: no administrator created.");
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({ where: { email }, update: {}, create: { email, passwordHash, name: "Administrateur" } });
  console.log(`Administrator ready: ${email}`);
}

async function main() {
  await ensureAdmin();

  const force = process.env.SEED_FORCE === "1";
  const existing = await prisma.page.count();
  if (existing > 0 && !force) {
    console.log("Content already present: skipping (set SEED_FORCE=1 to reset).");
    return;
  }
  if (force) {
    await prisma.$transaction([
      prisma.galleryItem.deleteMany(),
      prisma.project.deleteMany(),
      prisma.client.deleteMany(),
      prisma.projectCategory.deleteMany(),
      prisma.service.deleteMany(),
      prisma.product.deleteMany(),
      prisma.productCategory.deleteMany(),
      prisma.page.deleteMany(),
      prisma.siteSettings.deleteMany(),
    ]);
  }

  await prisma.siteSettings.create({
    data: {
      id: 1,
      logoUrl: null,
      phones: ["+216 26 980 445", "+216 72 204 105", "+216 26 980 448"],
      email: "pepiniere.yasmine@gnet.tn",
      mapLink: "https://www.google.com/maps/search/?api=1&query=HH4P%2BG6X%20Bouargoub",
      translations: { create: rows(settingsTr) },
    },
  });

  for (const [i, p] of pages.entries()) {
    await prisma.page.create({ data: { key: p.key, image: p.image, sortOrder: i, translations: { create: rows(p.tr) } } });
  }

  const catIds: Record<string, string> = {};
  for (const [i, c] of categories.entries()) {
    const created = await prisma.productCategory.create({ data: { image: c.image, sortOrder: i, translations: { create: rows(c.tr) } } });
    catIds[c.key] = created.id;
  }

  for (const [i, p] of products.entries()) {
    await prisma.product.create({
      data: {
        categoryId: catIds[p.cat],
        image: p.image,
        lightLevel: p.light,
        watering: p.water,
        placement: p.place,
        height: p.height,
        potSize: p.pot,
        featured: !!p.featured,
        sortOrder: i,
        translations: { create: rows(p.tr) },
      },
    });
  }

  for (const [i, s] of services.entries()) {
    await prisma.service.create({ data: { icon: s.icon, image: s.image, sortOrder: i, translations: { create: rows(s.tr) } } });
  }

  const pcIds: string[] = [];
  for (const [i, c] of projectCats.entries()) {
    pcIds.push((await prisma.projectCategory.create({ data: { sortOrder: i, translations: { create: rows(c) } } })).id);
  }

  const clientIds: string[] = [];
  for (const [i, c] of clients.entries()) {
    clientIds.push((await prisma.client.create({ data: { sortOrder: i, translations: { create: rows(c) } } })).id);
  }

  const projectIds: string[] = [];
  for (const [i, p] of projects.entries()) {
    projectIds.push(
      (
        await prisma.project.create({
          data: { categoryId: pcIds[p.cat], clientId: clientIds[p.client], year: p.year, image: p.image, featured: i < 3, sortOrder: i, translations: { create: rows(p.tr) } },
        })
      ).id,
    );
  }

  for (const [i, g] of gallery.entries()) {
    await prisma.galleryItem.create({
      data: { image: g.image, projectId: g.project !== undefined ? projectIds[g.project] : null, sortOrder: i, translations: { create: rows(g.tr) } },
    });
  }

  console.log("Starter content created in FR, EN, IT and AR.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
