import Image from "next/image";
import Script from "next/script";
import { AppearanceCard } from "@/components/appearance-card";
import { ResumeCard } from "@/components/resume-card";
import { TopbarBreadcrumb } from "@/components/topbar-breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";
const date = new Date();

const profileTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/New_York",
});

function formatProfileTime(value: Date) {
  const time = profileTimeFormatter.format(value);
  const offset =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      timeZoneName: "longOffset",
    })
      .formatToParts(value)
      .find((part) => part.type === "timeZoneName")
      ?.value.replace(/^GMT([+-])/, "UTC $1") ?? "UTC";

  return `${time} (${offset})`;
}

type FeaturedProject = {
  title: string;
  summary: string;
  meta: string;
  tags: string[];
  accent: string;
  href?: string;
};

type HackathonProject = {
  title: string;
  summary: string;
  event: string;
  location: string;
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

const hackathonProjectsFallback: HackathonProject[] = [
  {
    title: "Fawn",
    summary:
      "AI-powered daycare operations assistant handling parent calls, lead capture, scheduling, and real-time staff updates.",
    event: "YHack Spring 2026",
    location: "Yale University, New Haven, CT",
    href: "https://devpost.com/software/fawn-v12jaw",
  },
  {
    title: "CookingMama",
    summary:
      "A grocery and recipe experience built to help college students shop more simply and plan meals more easily.",
    event: "HackRU Spring 2024",
    location: "College Avenue Student Center, New Brunswick, NJ",
    href: "https://devpost.com/software/cookingmama",
  },
  {
    title: "NJ Trip Planner",
    summary: "AI-powered New Jersey travel guide and HackRU winner.",
    event: "HackRU Fall 2023",
    location: "Busch Student Center, Piscataway, NJ",
    href: "https://devpost.com/software/nj-trip-planner",
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

async function getHackathonProjects(): Promise<HackathonProject[]> {
  async function getHackathonLocation(challengeUrl: string) {
    try {
      const response = await fetch(challengeUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        next: { revalidate },
      });

      if (!response.ok) {
        return "";
      }

      const html = await response.text();
      const streetAddressMatch = html.match(/"streetAddress":\s*"([^"]+)"/);

      if (streetAddressMatch) {
        return stripTags(streetAddressMatch[1]).replace(/,\s*USA$/, "");
      }

      const locationMatch = html.match(/maps\.google\.com\/\?q=[^"]+">([\s\S]*?)<\/a>/);
      return locationMatch ? stripTags(locationMatch[1]) : "";
    } catch {
      return "";
    }
  }

  try {
    const response = await fetch("https://devpost.com/arnavmabrukar", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate },
    });

    if (!response.ok) {
      return hackathonProjectsFallback;
    }

    const html = await response.text();
    const projectCards = [
      ...html.matchAll(
        /<div class="large-3 small-12 columns gallery-item"[\s\S]*?<\/div><\/a>\s*<\/div>/g,
      ),
    ].slice(0, 3);

    const parsedProjects = await Promise.all(
      projectCards.map(async (match) => {
        const itemHtml = match[0];
        const hrefMatch = itemHtml.match(/href="([^"]+)"/);
        const titleMatch = itemHtml.match(/<h5>\s*([\s\S]*?)\s*<\/h5>/);
        const summaryMatch = itemHtml.match(/<p class="small tagline">\s*([\s\S]*?)\s*<\/p>/);

        if (!hrefMatch || !titleMatch || !summaryMatch) {
          return null;
        }

        const projectUrl = hrefMatch[1];
        let event = "Hackathon Project";
        let location = "";

        try {
          const projectResponse = await fetch(projectUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0",
            },
            next: { revalidate },
          });

          if (projectResponse.ok) {
            const projectHtml = await projectResponse.text();
            const challengeHrefMatch = projectHtml.match(
              /<div class="software-list-content">[\s\S]*?<a href="([^"]+)">([\s\S]*?)<\/a>/,
            );

            if (challengeHrefMatch) {
              event = stripTags(challengeHrefMatch[2]);
              location = await getHackathonLocation(challengeHrefMatch[1]);
            }
          }
        } catch {
          // Leave fallback event/location values when Devpost fetches fail.
        }

        return {
          title: stripTags(titleMatch[1]),
          summary: stripTags(summaryMatch[1]),
          event: itemHtml.includes("Winner") ? `${event} / Winner` : event,
          location,
          href: projectUrl,
        };
      }),
    );

    const projects = parsedProjects.filter(Boolean) as HackathonProject[];

    return projects.length ? projects : hackathonProjectsFallback;
  } catch {
    return hackathonProjectsFallback;
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
  "Python",
  "Java",
  "TypeScript",
  "React",
  ".NET / C#",
  "Docker",
  "SQL",
  "Azure",
  "Next.js",
  "Django REST",
  "PyTorch",
  "Computer Vision",
];
const proofPoints = [
  "Improved test coverage to 90%+ on production .NET services",
  "Worked across 100K+ lines of C#/.NET code in a real engineering environment",
  "Built and shipped full-stack projects with React, Django, and AI integrations",
  "Won Best Transportation Hack at HackRU for NJ Trip Planner",
  "Presented startup product research to 100+ business owners at CES",
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

export default async function Home() {
  const featuredWork = await getPinnedProjects();
  const hackathonProjects = await getHackathonProjects();
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
      "Java",
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
          <a href="#projects-section">Projects</a>
          <a href="#experience-section">Experience</a>
          <a href="#resume-download">Resume</a>
          <a href="#contact-section">Contact</a>
          <a href="#appearance-settings">Appearance</a>
        </nav>
        <ThemeToggle />
      </header>

      <section className="screen screen--hero">

        <div className="hero">
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>
                Hey! I&apos;m <span>Arnav Mabrukar</span>{" "}
                <Image
                  alt="Samurott sprite"
                  className="hero-name-sprite"
                  height={52}
                  priority
                  src="/samurott-sprite.png"
                  width={52}
                />
              </h1>
              <p className="hero-text">
                I&apos;m currently a 4th year CS + DS Student @{" "}
                <span>Rutgers University</span>. I&apos;ve built software across{" "}
                <span>AI</span>, <span>full-stack</span>, <span>computer vision</span>,
                {" "}and product engineering through <span>Rutgers</span>,{" "}
                <span>Sonadia</span>, <span>NSF I-Corps</span>, and hackathon teams.
                I&apos;ve optimized large-scale .NET services, built AI apps with React
                and Django, and shipped products using OpenAI APIs, PyTorch, Azure,
                AR, and computer vision workflows. I like building products people
                actually use.
              </p>
              <section className="hero-meta" aria-label="Hero links and experience">
                <div className="hero-links">
                  {heroLinks.map((link, index) => (
                    <span
                      className={`hero-links__item${
                        link.label === "More about me" ? " hero-links__item--more" : ""
                      }`}
                      key={link.label}
                    >
                      {index > 0 ? <span className="hero-links__sep">|</span> : null}
                      <a href={link.href}>
                        {link.label}
                        {link.label === "More about me" ? (
                          <span className="hero-links__arrow"> {"\u2192"}</span>
                        ) : null}
                      </a>
                    </span>
                  ))}
                </div>
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
              <a
                className="section-link"
                href="https://github.com/arnavmabrukar?tab=repositories"
                rel="noreferrer"
                target="_blank"
              >
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
                  {item.href ? (
                    <a className="work-card__action" href={item.href} rel="noreferrer" target="_blank">
                      View project →
                    </a>
                  ) : null}
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
            <article className="info-card info-card--posts">
              <div className="anchor-highlight" id="hackathons-section" />
              <div className="section-intro">
                <p className="eyebrow">Hackathon Projects</p>
                <a
                  className="section-link"
                  href="https://devpost.com/arnavmabrukar"
                  rel="noreferrer"
                  target="_blank"
                >
                  View Devpost
                </a>
              </div>
              <div className="post-list">
                {hackathonProjects.map((item) => (
                  <div className="post-row post-row--note" key={`${item.title}-${item.event}`}>
                    <div className="commit-copy commit-copy--note">
                      <span>
                        {item.href ? (
                          <a href={item.href} rel="noreferrer" target="_blank">
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </span>
                      <span>{item.summary}</span>
                      <span>{item.event}</span>
                      {item.location ? <span>{item.location}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <div className="identity-cluster">
              <article className="info-card info-card--identity">
                <div className="anchor-highlight" id="profile-section" />
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
                    <h2>Arnav Mabrukar</h2>
                    <p className="widget-copy">AI &amp; Full-Stack Engineer</p>
                    <div className="profile-meta" aria-label="Profile location and local time">
                      <div className="profile-meta__row">
                        <span className="profile-meta__icon" aria-hidden="true">
                          <svg fill="none" viewBox="0 0 24 24">
                            <path
                              d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                            />
                            <circle cx="12" cy="10" r="2.2" fill="currentColor" />
                          </svg>
                        </span>
                        <span>New Jersey</span>
                      </div>
                      <div className="profile-meta__row">
                        <span className="profile-meta__icon" aria-hidden="true">
                          <svg fill="none" viewBox="0 0 24 24">
                            <circle
                              cx="12"
                              cy="12"
                              r="8"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <path
                              d="M12 7.5v5l3 1.8"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                            />
                          </svg>
                        </span>
                        <span>{formatProfileTime(date)}</span>
                      </div>
                    </div>
                    <p className="widget-copy profile-widget__description">
                      Rutgers CS + DS senior building AI apps and production systems,
                      active in IEEE AI/ML while diving deeper into LLMs and
                      advanced deep learning.
                      <span className="profile-widget__description-break" aria-hidden="true" />
                      Learning Japanese and staying consistent with lifting outside of code.
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
                  <ResumeCard />
                  <AppearanceCard />
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            <div className="anchor-highlight" id="experience-section" />
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
                  {proofPoints.slice(0, 3).map((item) => (
                    <div className="proof-row" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
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
