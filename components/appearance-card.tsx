"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type Accent = "peach" | "pink" | "blue";

const accents: Array<{ key: Accent; label: string }> = [
  { key: "peach", label: "Peach" },
  { key: "pink", label: "Pink" },
  { key: "blue", label: "Blue" },
];

export function AppearanceCard() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("peach");

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.dataset.theme === "light" ? "light" : "dark");

    const nextAccent =
      root.dataset.accent === "pink" || root.dataset.accent === "blue"
        ? root.dataset.accent
        : "peach";
    setAccent(nextAccent);
  }, []);

  function applyTheme(nextTheme: Theme) {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  function applyAccent(nextAccent: Accent) {
    document.documentElement.dataset.accent = nextAccent;
    localStorage.setItem("accent", nextAccent);
    setAccent(nextAccent);
  }

  return (
    <article className="info-card info-card--appearance">
      <div className="anchor-highlight" id="appearance-settings" />
      <p className="eyebrow">Appearance</p>
      <div className="appearance-group">
        <span className="appearance-label">Theme</span>
        <div className="appearance-toggle">
          <button
            className={theme === "dark" ? "is-active" : ""}
            onClick={() => applyTheme("dark")}
            type="button"
          >
            Dark
          </button>
          <button
            className={theme === "light" ? "is-active" : ""}
            onClick={() => applyTheme("light")}
            type="button"
          >
            Light
          </button>
        </div>
      </div>

      <div className="appearance-group">
        <span className="appearance-label">Accent</span>
        <div className="appearance-swatches">
          {accents.map((item) => (
            <button
              aria-label={`Use ${item.label} accent`}
              className={accent === item.key ? "is-active" : ""}
              data-accent-swatch={item.key}
              key={item.key}
              onClick={() => applyAccent(item.key)}
              type="button"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
