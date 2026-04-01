export function ResumeCard() {
  return (
    <article className="info-card info-card--resume-rail">
      <div className="anchor-highlight" id="resume-download" />
      <p className="eyebrow">Resume</p>
      <a
        className="resume-link resume-link--rail"
        href="/Arnav_Mabrukar_Resume.pdf"
        rel="noreferrer"
        target="_blank"
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
      </a>
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
  );
}
