"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { translations, Lang, TranslationKey } from "./i18n";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "es",
  toggleLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  // Persistencia con localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang;
    if (saved === "es" || saved === "en") setLang(saved);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "es" ? "en" : "es";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const t = (key: TranslationKey): string => translations[lang][key];

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);