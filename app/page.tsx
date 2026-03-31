import Image from "next/image";
import Script from "next/script";
import { AppearanceCard } from "@/components/appearance-card";
import { TopbarBreadcrumb } from "@/components/topbar-breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";

type FeaturedProject = {
  title: string;
  summary: string;
  meta: string;
  tags: string[];
  accent: string;
  href?: string;
};

const featuredWorkFallback: FeaturedProject[] = [
  {
    title: "NJ Trip Planner",
    summary:
      "Built an AI-powered travel app that won Best Transportation Hack at HackRU by combining NJ Transit data, ChatGPT, and a React Native mobile experience.",
    meta: "HackRU / Full-Stack Developer / 2023",
    tags: ["react native", "django", "openai", "google maps"],
    accent: "trip",
  },
  {
    title: "AI Financial Advisor",
    summary:
      "Developed a finance-focused AI app using Capital One Nessie, Azure OpenAI, and Azure Speech SDK to support expense analysis and business guidance.",
    meta: "Project / Full-Stack Developer / 2024",
    tags: ["react", "django rest", "azure openai", "speech sdk"],
    accent: "advisor",
  },
  {
    title: "Recycle Vision",
    summary:
      "Created an AR platform for teaching sustainability concepts to elementary school students during Columbia DivHacks 2024 using Snap Spectacles and Lens Studio.",
    meta: "DivHacks / AR Developer / 2024",
    tags: ["ar", "lens studio", "education", "sustainability"],
    accent: "trip",
  },
];

export const revalidate = 3600;

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "...");
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

async function getPinnedProjects(): Promise<FeaturedProject[]> {
  try {
    const response = await fetch("https://github.com/arnavmabrukar", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate },
    });

    if (!response.ok) {
      return featuredWorkFallback;
    }

    const html = await response.text();
    const itemMatches = [...html.matchAll(/pinned-item-list-item-content">([\s\S]*?)<\/li>/g)]
      .slice(0, 2);

    const parsedProjects = itemMatches
      .map((match, index) => {
        const itemHtml = match[1];
        const hrefMatch = itemHtml.match(/href="([^"]+)"/);
        const titleMatch = itemHtml.match(/<span class="repo">([\s\S]*?)<\/span>/);
        const descMatch = itemHtml.match(/<p class="pinned-item-desc[\s\S]*?>([\s\S]*?)<\/p>/);
        const langMatch = itemHtml.match(/itemprop="programmingLanguage">([\s\S]*?)<\/span>/);

        if (!hrefMatch || !titleMatch) {
          return null;
        }

        const title = stripTags(titleMatch[1]);
        const summary = descMatch
          ? stripTags(descMatch[1])
          : "Pinned GitHub project from my public profile.";
        const language = langMatch ? stripTags(langMatch[1]) : "GitHub";

        return {
          title,
          summary,
          meta: `Pinned Project / ${language}`,
          tags: [language.toLowerCase(), "github pinned"],
          accent: index === 0 ? "trip" : "advisor",
          href: `https://github.com${hrefMatch[1]}`,
        };
      })
      .filter(Boolean) as FeaturedProject[];

    const projects = parsedProjects;

    return projects.length === 2 ? projects : featuredWorkFallback;
  } catch {
    return featuredWorkFallback;
  }
}

const links = [
  {
    label: "Email",
    value: "arnavmabrukar@gmail.com",
    href: "mailto:arnavmabrukar@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/arnav-mabrukar",
    href: "https://www.linkedin.com/in/arnav-mabrukar",
  },
  {
    label: "GitHub",
    value: "github.com/arnavmabrukar",
    href: "https://github.com/arnavmabrukar",
  },
];

const heroLinks = [
  { label: "GitHub", href: "https://github.com/arnavmabrukar" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/arnav-mabrukar" },
  { label: "Resume", href: "#resume-download" },
  { label: "More about me", href: "#contact-section" },
];
type ExperienceChip = {
  label: string;
  meta?: string;
  icon?: "education" | "community";
};

const experience: ExperienceChip[] = [
  { label: "ProgenyHealth" },
  { label: "Rutgers", icon: "education" },
  { label: "IEEE AI/ML", icon: "community" },
];
const techStack = [
  "React",
  "Next.js",
  "Django REST",
  ".NET / C#",
  "PyTorch",
  "Docker",
  "PostgreSQL",
  "OpenAI APIs",
];
const proofPoints = [
  "Improved test coverage to 90%+ on .NET services",
  "Worked across 100K+ lines of C#/.NET code",
  "Secured $3,000 in NSF funding for a CV startup",
  "Presented product work to 100+ business owners at CES",
];
const experienceHighlights = [
  {
    role: "Software Developer Intern",
    company: "ProgenyHealth",
    date: "May 2025 - Aug 2025",
    status: "completed",
    summary:
      "Containerized .NET services with Docker, improved code quality with SonarQube, and helped raise unit test coverage above 90% in a SAFe environment.",
  },
  {
    role: "Full Stack Developer",
    company: "Sonadia",
    date: "Jun 2024 - Dec 2024",
    status: "completed",
    summary:
      "Shipped onboarding and artist workflow features, improved wallet connectivity, and helped transition the platform from beta to a public launch.",
  },
  {
    role: "Technological Lead",
    company: "National Science Foundation",
    date: "Jan 2024 - Apr 2024",
    status: "completed",
    summary:
      "Built a computer vision prototype, integrated Azure Speech and SQL-backed pipelines, and validated market workflows through NSF I-Corps interviews.",
  },
];

const latestNotes = [
  { title: "Dean’s List, Fall 2025", date: "Recent" },
  { title: "Tableau course completed", date: "Recent" },
  { title: "Started ProgenyHealth internship", date: "2025" },
  { title: "Presented startup research at CES", date: "2024" },
];

export default async function Home() {
  const featuredWork = await getPinnedProjects();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arnav Mabrukar",
    url: "https://arnavmabrukar.tech",
    image: "https://arnavmabrukar.tech/arnav-portrait.png",
    jobTitle: "AI & Full-Stack Engineer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Randolph",
      addressRegion: "New Jersey",
      addressCountry: "US",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Rutgers University-New Brunswick",
    },
    sameAs: [
      "https://github.com/arnavmabrukar",
      "https://www.linkedin.com/in/arnav-mabrukar",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Full-Stack Development",
      "Next.js",
      "React",
      ".NET",
      "Computer Vision",
      "Machine Learning",
    ],
  };

  return (
    <main className="page-shell">
      <Script
        id="person-jsonld"
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      <header className="topbar">
        <TopbarBreadcrumb />
        <nav className="topbar-nav" aria-label="Primary">
          <a href="#contact-section">About</a>
          <a href="#latest-section">Notes</a>
          <a href="#projects-section">Projects</a>
          <a href="#resume-download">
            Resume
          </a>
          <a href="#contact-section">Contact</a>
          <a aria-label="Appearance settings" className="topbar-icon" href="#appearance-settings">
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3.75a2.25 2.25 0 0 1 2.186 1.717l.094.398.221.904a1.5 1.5 0 0 0 1.18 1.111l.178.029.917.102a2.25 2.25 0 0 1 1.607 3.705l-.28.31-.625.678a1.5 1.5 0 0 0-.364 1.353l.045.174.24.887a2.25 2.25 0 0 1-3.02 2.691l-.368-.172-.84-.438a1.5 1.5 0 0 0-1.334-.057l-.166.078-.84.438a2.25 2.25 0 0 1-3.26-2.36l.08-.331.24-.887a1.5 1.5 0 0 0-.255-1.384l-.11-.143-.624-.678a2.25 2.25 0 0 1 1.196-3.753l.411-.057.917-.102a1.5 1.5 0 0 0 1.27-1.017l.05-.176.22-.904A2.25 2.25 0 0 1 12 3.75Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M12 14.25a2.25 2.25 0 1 0 0-4.5a2.25 2.25 0 0 0 0 4.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </a>
        </nav>
        <ThemeToggle />
      </header>

      <section className="screen screen--hero">

        <div className="hero">
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>
                Hey! I&apos;m <span>Arnav Mabrukar</span>
              </h1>
              <p className="hero-text">
                I&apos;m currently a CS + DS Student @{" "}
                <span>Rutgers University</span>. I&apos;ve built software across{" "}
                <span>AI</span>, <span>full-stack</span>, <span>computer vision</span>,
                {" "}and product engineering through <span>Rutgers</span>,{" "}
                <span>Sonadia</span>, <span>NSF I-Corps</span>, and hackathon teams.
                I&apos;ve optimized large-scale .NET services, built AI apps with React
                and Django, and shipped products using OpenAI APIs, PyTorch, Azure,
                AR, and computer vision workflows. I like building products people
                actually use.
              </p>
              <div className="hero-links">
                {heroLinks.map((link, index) => (
                  <span className="hero-links__item" key={link.label}>
                    {index > 0 ? <span className="hero-links__sep">|</span> : null}
                    <a
                      href={link.href}
                    >
                      {link.label}
                      {link.label === "More about me" ? " →" : ""}
                    </a>
                  </span>
                ))}
              </div>
              <section className="hero-experience-section" aria-label="Experience summary">
                <div className="hero-experience">
                  {experience.map((item, index) => (
                    <span className="hero-experience__item" key={item.label}>
                      {index > 0 ? <span className="hero-experience__sep">/</span> : null}
                      {item.icon ? (
                        <span className="hero-experience__icon" aria-hidden="true">
                          {item.icon === "education" ? (
                            <svg fill="none" viewBox="0 0 24 24">
                              <path
                                d="M3 9.5L12 5l9 4.5L12 14 3 9.5Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M7 11.5V15c0 .8 2.2 2 5 2s5-1.2 5-2v-3.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                              />
                            </svg>
                          ) : (
                            <svg fill="none" viewBox="0 0 24 24">
                              <path
                                d="M16 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6ZM8 13a3 3 0 1 0 0-6a3 3 0 0 0 0 6ZM8 19c-2.2 0-4 1-4 2.2V22h8v-.8C12 20 10.2 19 8 19ZM16 17c-1.9 0-3.5.8-4 1.8V22h8v-1.2c0-1.2-1.8-3.8-4-3.8Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                              />
                            </svg>
                          )}
                        </span>
                      ) : null}
                      <span>{item.label}</span>
                      {item.meta ? <span className="hero-experience__meta">{item.meta}</span> : null}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="screen screen--cards" id="cards-view">
        <div className="cards-view">
          <article className="info-card info-card--work">
            <div className="anchor-highlight" id="projects-section" />
            <div className="section-intro">
              <p className="eyebrow">Selected work</p>
              <h2>Featured Projects</h2>
              <a className="section-link" href="#contact-section">
                View more
              </a>
            </div>

            <div className="work-list">
              {featuredWork.slice(0, 2).map((item) => (
                <article className="work-card" key={item.title}>
                  <div className="project-preview">
                    <div className="window-bar">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className={`project-preview__inner project-preview__inner--${item.accent}`}>
                      <p className="project-preview__meta">{item.meta}</p>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                  </div>
                  <h4 className="work-card__title">
                    {item.href ? (
                      <a href={item.href} rel="noreferrer" target="_blank">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h4>
                  <p className="work-card__summary">{item.summary}</p>
                  <div className="tag-list">
                    {item.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="utility-grid">
            <article className="info-card info-card--stack">
              <p className="eyebrow">Tech Stack</p>
              <h2>Tools I use across AI and product engineering.</h2>
              <div className="tag-list tag-list--stack">
                {techStack.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="stack-proof">
                <p className="stack-proof__label">Proof Points</p>
                <div className="proof-list proof-list--compact">
                  {proofPoints.slice(0, 2).map((item) => (
                    <div className="proof-row" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="identity-cluster">
              <article className="info-card info-card--identity">
                <p className="eyebrow">Profile</p>
                <div className="profile-widget">
                  <div className="profile-widget__avatar">
                    <Image
                      alt="Portrait of Arnav"
                      className="profile-widget__image"
                      height={1600}
                      priority
                      src="/arnav-portrait.png"
                      width={1200}
                    />
                  </div>
                  <div className="profile-widget__copy">
                    <h2>Arnav</h2>
                    <p className="widget-copy">AI &amp; Full-Stack Engineer</p>
                    <div className="profile-location">
                      <span className="profile-location__pin" aria-hidden="true" />
                      <span>Randolph, New Jersey</span>
                    </div>
                    <p className="widget-copy">
                      Senior at Rutgers studying Computer Science and Data Science.
                    </p>
                  </div>
                </div>
              </article>

              <div className="identity-rail">
                <article className="info-card info-card--connect">
                  <div className="anchor-highlight" id="contact-section" />
                  <p className="eyebrow">Let&apos;s Connect</p>
                  <h2>Always open to interesting projects and conversations.</h2>
                  <div className="contact-links">
                    {links.map((link) => (
                      <a className="contact-link" href={link.href} key={link.label}>
                        <span>{link.label}</span>
                        <strong>{link.value}</strong>
                      </a>
                    ))}
                  </div>
                </article>

                <div className="identity-rail__bottom">
                  <article className="info-card info-card--resume-rail">
                    <div className="anchor-highlight" id="resume-download" />
                    <p className="eyebrow">Resume</p>
                    <a
                      className="resume-link resume-link--rail"
                      download="Arnav_Mabrukar_Resume.pdf"
                      href="/Arnav_Mabrukar_Resume.pdf"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="resume-link__icon" aria-hidden="true">
                        <span className="resume-link__icon-fold" />
                      </span>
                      <span className="resume-link__copy">
                        <strong>Download PDF</strong>
                        <span>Internships, full-stack, AI roles</span>
                      </span>
                    </a>
                  </article>

                  <AppearanceCard />
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            <article className="info-card info-card--experience">
              <div className="section-intro">
                <p className="eyebrow">Experience Highlights</p>
                <span className="section-meta">[info]</span>
              </div>
              <div className="post-list">
                {experienceHighlights.map((item) => (
                  <div className="post-row post-row--experience" key={`${item.company}-${item.role}`}>
                    <span
                      aria-hidden="true"
                      className={`timeline-marker timeline-marker--${item.status}`}
                    />
                    <div className="commit-copy commit-copy--experience">
                      <span className="commit-hash">{item.role}</span>
                      <span>{item.company}</span>
                      <span>{item.summary}</span>
                    </div>
                    <span>{item.date}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="info-card info-card--posts">
              <div className="anchor-highlight" id="latest-section" />
              <div className="section-intro">
                <p className="eyebrow">Latest Notes</p>
                <span className="section-meta">↗</span>
              </div>
              <div className="post-list">
                {latestNotes.map((item) => (
                  <div className="post-row post-row--note" key={item.title}>
                    <div className="commit-copy commit-copy--note">
                      <span>{item.title}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <footer className="site-footer">
            <div className="site-footer__meta">
              <span>© 2026 Arnav Mabrukar</span>
              <span className="site-footer__divider">-</span>
              <span>Open to software engineering opportunities</span>
            </div>
            <div className="site-footer__links">
              <a href="#resume-download">
                Resume
              </a>
              <a href="https://github.com/arnavmabrukar">GitHub</a>
              <a href="https://www.linkedin.com/in/arnav-mabrukar">LinkedIn</a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
