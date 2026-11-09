export type Locale = "es" | "en";

export interface Seo {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  twitterCard?: "summary" | "summary_large_image";
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Navigation {
  items: NavLink[];
  cta?: NavLink;
}

export interface HeroCta {
  label: string;
  href: string;
}

export interface Hero {
  kicker?: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: HeroCta;
  ctaSecondary?: HeroCta;
  badges?: string[];
  scrollLabel?: string;
}

export interface Kpi {
  value: string;
  label: string;
}

export interface AboutImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface About {
  tag?: string;
  title: string;
  body: string;
  image?: AboutImage;
  kpis: Kpi[];
}

export interface MethodItem {
  title: string;
  description: string;
}

export interface Method {
  tag?: string;
  title: string;
  intro?: string;
  items: MethodItem[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  tag?: string;
  category?: string;
  role: string;
  period?: string;
  problem: string;
  decision: string;
  result: string;
  stack: string[];
  links?: ProjectLink[];
  featured?: boolean;
  image?: AboutImage;
}

export interface ProjectsSection {
  tag?: string;
  title: string;
  intro?: string;
  items: Project[];
}

export interface StackGroup {
  title: string;
  items: string[];
}

export interface Stack {
  tag?: string;
  title: string;
  intro?: string;
  groups: StackGroup[];
}

export interface ExperienceItem {
  company: string;
  location?: string;
  period: string;
  role: string;
  description?: string;
  highlights?: string[];
}

export interface EducationItem {
  institution: string;
  location?: string;
  period: string;
  degree: string;
  details?: string[];
}

export interface Experience {
  tag?: string;
  title: string;
  intro?: string;
  items: ExperienceItem[];
  education?: EducationItem[];
}

export interface Writing {
  tag?: string;
  title: string;
  name: string;
  description: string;
  href: string;
  cta?: string;
}

export interface ContactLink {
  label: string;
  href: string;
  icon?: string;
}

export interface Contact {
  tag?: string;
  title: string;
  body?: string;
  email: string;
  links: ContactLink[];
}

export interface Footer {
  text?: string;
  copyright?: string;
}

export interface SiteContent {
  locale: Locale;
  seo: Seo;
  nav: Navigation;
  hero: Hero;
  about: About;
  method: Method;
  projects: ProjectsSection;
  stack: Stack;
  experience: Experience;
  writing: Writing;
  contact: Contact;
  footer: Footer;
}
