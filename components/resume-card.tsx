"use client";

import { useEffect, useState } from "react";

export function ResumeCard() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <article className="info-card info-card--resume-rail">
        <div className="anchor-highlight" id="resume-download" />
        <p className="eyebrow">Resume</p>
        <button
          className="resume-link resume-link--rail"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span className="resume-link__icon resume-link__icon--eye" aria-hidden="true">
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="2.75"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <span className="resume-link__copy">
            <strong>Preview Resume</strong>
          </span>
        </button>
        <a
          className="resume-link resume-link--rail"
          download="Arnav_Mabrukar_Resume.pdf"
          href="/Arnav_Mabrukar_Resume.pdf"
          rel="noreferrer"
          target="_blank"
        >
          <span className="resume-link__icon resume-link__icon--download" aria-hidden="true">
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M12 4v10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M8.5 10.5 12 14l3.5-3.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M5 18h14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <span className="resume-link__copy">
            <strong>Download Resume</strong>
          </span>
        </a>
      </article>

      {isOpen ? (
        <div
          aria-label="Resume preview"
          className="resume-modal"
          onClick={() => setIsOpen(false)}
          role="dialog"
        >
          <div
            className="resume-modal__panel"
            onClick={(event) => event.stopPropagation()}
            role="document"
          >
            <div className="resume-modal__header">
              <p className="eyebrow">Resume Preview</p>
              <button
                aria-label="Close resume preview"
                className="resume-modal__close"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <iframe
              className="resume-modal__frame"
              src="/Arnav_Mabrukar_Resume.pdf"
              title="Arnav Mabrukar resume"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
