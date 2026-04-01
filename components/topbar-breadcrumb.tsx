"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const sectionIds = [
  "projects-section",
  "experience-section",
  "contact-section",
  "resume-download",
  "appearance-settings",
  "latest-section",
];

const sectionLabels: Record<string, string> = {
  "projects-section": "selected work",
  "experience-section": "experience",
  "contact-section": "let's connect",
  "resume-download": "resume",
  "appearance-settings": "appearance",
  "latest-section": "recent commits",
};

export function TopbarBreadcrumb() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const routeName =
    pathname && pathname !== "/"
      ? pathname
          .split("/")
          .filter(Boolean)
          .map((segment) => decodeURIComponent(segment))
          .join("/")
      : "";

  useEffect(() => {
    function updateHash() {
      setHash(window.location.hash.replace(/^#/, ""));
    }

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const breadcrumbLabel =
    sectionLabels[hash] || sectionLabels[activeSection] || routeName;

  return (
    <nav aria-label="Breadcrumb" className="topbar-brand">
      <p className="site-title">
        <a href="/">~</a>
      </p>
      <span className="site-slash">/</span>
      {breadcrumbLabel ? <span className="site-route">{breadcrumbLabel}</span> : null}
      <span className="site-cursor" aria-hidden="true" />
    </nav>
  );
}
