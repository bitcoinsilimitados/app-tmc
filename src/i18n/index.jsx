import React, { createContext, useCallback, useContext, useState } from "react";
import Cookies from "universal-cookie";
import en from "./locales/en.json";

const cookies = new Cookies();

export const LANG_COOKIE = "tmc_lang";
export const SOURCE_LANG = "es";
export const FALLBACK_LANG = "en";
export const SUPPORTED_LANGS = ["es", "en"];

const DICTIONARIES = { en };

function normalize(lang) {
  return (lang || "").toLowerCase().split(/[-_]/)[0];
}

export function detectLang() {
  const saved = normalize(cookies.get(LANG_COOKIE));
  if (SUPPORTED_LANGS.includes(saved)) return saved;

  if (typeof navigator !== "undefined") {
    const preferred = [].concat(
      navigator.languages || [],
      navigator.language || []
    );
    for (const candidate of preferred) {
      const code = normalize(candidate);
      if (SUPPORTED_LANGS.includes(code)) return code;
    }
  }

  return FALLBACK_LANG;
}

export function translate(lang, text, params) {
  let out = text;

  if (lang !== SOURCE_LANG && DICTIONARIES[lang]) {
    const entry = DICTIONARIES[lang][text];
    if (entry != null) out = entry;
  }

  if (params) {
    out = out.replace(/\{(\w+)\}/g, (match, key) =>
      params[key] != null ? String(params[key]) : match
    );
  }

  return out;
}

export const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectLang);

  const setLang = useCallback((next) => {
    const normalized = normalize(next);
    if (!SUPPORTED_LANGS.includes(normalized)) return;
    cookies.set(LANG_COOKIE, normalized, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    setLangState(normalized);
  }, []);

  const t = useCallback(
    (text, params) => translate(lang, text, params),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
