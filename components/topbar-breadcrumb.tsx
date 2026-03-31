"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function TopbarBreadcrumb() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
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

  const breadcrumbLabel = hash || routeName;

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
