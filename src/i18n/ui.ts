export type Locale = "es" | "en";

export interface UiLabels {
  nav: {
    home: string;
    about: string;
    method: string;
    projects: string;
    stack: string;
    experience: string;
    writing: string;
    contact: string;
  };
  buttons: {
    viewProjects: string;
    contact: string;
    readMore: string;
    viewCode: string;
    visitSite: string;
    sendEmail: string;
    switchLanguage: string;
    skipIntro: string;
  };
  aria: {
    openMenu: string;
    closeMenu: string;
    languageSwitch: string;
    skipToContent: string;
    sectionNav: string;
    mainNav: string;
    scrollDown: string;
  };
  languageSwitch: {
    label: string;
    es: string;
    en: string;
  };
}

export const ui: Record<Locale, UiLabels> = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      method: "Método",
      projects: "Proyectos",
      stack: "Stack",
      experience: "Experiencia",
      writing: "Writing",
      contact: "Contacto",
    },
    buttons: {
      viewProjects: "Ver proyectos",
      contact: "Hablemos",
      readMore: "Leer más",
      viewCode: "Ver código",
      visitSite: "Visitar sitio",
      sendEmail: "Enviar email",
      switchLanguage: "Cambiar idioma",
      skipIntro: "Saltar intro",
    },
    aria: {
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      languageSwitch: "Cambiar idioma",
      skipToContent: "Saltar al contenido",
      sectionNav: "Navegación de secciones",
      mainNav: "Principal",
      scrollDown: "Desplazarse hacia abajo",
    },
    languageSwitch: {
      label: "Idioma",
      es: "Español",
      en: "English",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      method: "Method",
      projects: "Projects",
      stack: "Stack",
      experience: "Experience",
      writing: "Writing",
      contact: "Contact",
    },
    buttons: {
      viewProjects: "View projects",
      contact: "Let's talk",
      readMore: "Read more",
      viewCode: "View code",
      visitSite: "Visit site",
      sendEmail: "Send email",
      switchLanguage: "Switch language",
      skipIntro: "Skip intro",
    },
    aria: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      languageSwitch: "Switch language",
      skipToContent: "Skip to content",
      sectionNav: "Section navigation",
      mainNav: "Main",
      scrollDown: "Scroll down",
    },
    languageSwitch: {
      label: "Language",
      es: "Español",
      en: "English",
    },
  },
};

export function getUi(locale: Locale): UiLabels {
  return ui[locale];
}

export default ui;
