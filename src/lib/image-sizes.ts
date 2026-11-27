// Recommended upload size for each image field, matching how the site
// displays it (with 2x pixels for sharp screens). `flexible` means only the
// height matters (logos) so no crop warning is shown for the ratio.
export type ImageSizeKey = "page" | "category" | "product" | "service" | "project" | "gallery" | "clientLogo" | "logo" | "favicon";

export const imageSizes: Record<ImageSizeKey, { w: number; h: number; ratio: string; flexible?: boolean }> = {
  page: { w: 1920, h: 1080, ratio: "16:9" },
  category: { w: 1200, h: 1200, ratio: "1:1" },
  product: { w: 1200, h: 1200, ratio: "1:1" },
  service: { w: 1600, h: 900, ratio: "16:9" },
  project: { w: 1600, h: 900, ratio: "16:9" },
  gallery: { w: 1600, h: 1200, ratio: "4:3" },
  clientLogo: { w: 400, h: 200, ratio: "2:1", flexible: true },
  logo: { w: 600, h: 200, ratio: "3:1", flexible: true },
  favicon: { w: 512, h: 512, ratio: "1:1" },
};
