import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const PhoneIcon = (p: P) => (
  <svg {...base(p)}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
);
export const MailIcon = (p: P) => (
  <svg {...base(p)}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
);
export const PinIcon = (p: P) => (
  <svg {...base(p)}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
export const GlobeIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const ChevronDown = (p: P) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
/** Points to the reading direction's "forward"; flipped automatically in RTL. */
export const ArrowForward = ({ className = "", ...p }: P) => (
  <svg {...base(p)} className={`rtl:-scale-x-100 ${className}`}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowBack = ({ className = "", ...p }: P) => (
  <svg {...base(p)} className={`rtl:-scale-x-100 ${className}`}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
export const SunIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const DropIcon = (p: P) => (
  <svg {...base(p)}><path d="M12 2.7s-6 6.6-6 11.3a6 6 0 0 0 12 0c0-4.7-6-11.3-6-11.3z" /></svg>
);
export const HomeIcon = (p: P) => (
  <svg {...base(p)}><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
);
export const RulerIcon = (p: P) => (
  <svg {...base(p)}><path d="M12 2v20M8 6h4M8 10h4M8 14h4M8 18h4" /></svg>
);
export const PotIcon = (p: P) => (
  <svg {...base(p)}><path d="M5 10h14l-1.5 10a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7z" /><path d="M12 10V6m0 0c0-2 1.5-4 4-4 0 2.5-1.8 4-4 4zm0 0C12 4 10.5 2 8 2c0 2.5 1.8 4 4 4z" /></svg>
);
export const TagIcon = (p: P) => (
  <svg {...base(p)}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z" /><circle cx="7" cy="7" r="1.5" /></svg>
);
export const LeafIcon = (p: P) => (
  <svg {...base(p)}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" /><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" /></svg>
);
export const StarIcon = (p: P) => (
  <svg {...base(p)}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
);
export const UsersIcon = (p: P) => (
  <svg {...base(p)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>
);
export const KeyIcon = (p: P) => (
  <svg {...base(p)}><path d="M9 12l2 2 4-4" /><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z" /></svg>
);
export const FacebookIcon = (p: P) => (
  <svg {...base(p)}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
export const InstagramIcon = (p: P) => (
  <svg {...base(p)}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" /></svg>
);

const serviceIcons: Record<string, (p: P) => React.ReactElement> = {
  design: (p) => (<svg {...base(p)}><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><circle cx="11" cy="11" r="2" /></svg>),
  planting: (p) => <LeafIcon {...p} />,
  lawn: (p) => (<svg {...base(p)}><path d="M2 22h20M5 22c0-6 1-9 3-12M10 22c0-5 .5-8 2-11M15 22c0-4 1-7 3-9M19 22c0-3 .5-5 2-6" /></svg>),
  irrigation: (p) => <DropIcon {...p} />,
  maintenance: (p) => (<svg {...base(p)}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" /></svg>),
  terrace: (p) => <HomeIcon {...p} />,
  tree: (p) => (<svg {...base(p)}><path d="M12 22v-6M12 16a6 6 0 0 0 6-6 6 6 0 0 0-6-8 6 6 0 0 0-6 8 6 6 0 0 0 6 6z" /></svg>),
};

export function ServiceIcon({ icon, ...p }: P & { icon?: string | null }) {
  const I = serviceIcons[icon ?? ""] ?? serviceIcons.planting;
  return <I {...p} />;
}
