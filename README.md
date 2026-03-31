# Arnav's Portfolio

A personal portfolio site built with Next.js.

This project is designed to feel clean, modern, and developer-focused while still being easy to update. It includes:

- a hero section with intro links and experience highlights
- featured projects pulled from GitHub
- contact, resume, and appearance controls
- recent commit activity
- SEO metadata, sitemap, robots.txt, and Vercel Analytics

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- CSS via `app/globals.css`
- Vercel Analytics

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create a production build:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

## Project Structure

```text
app/
  layout.tsx       App shell, fonts, metadata, analytics
  page.tsx         Main homepage content
  globals.css      Global styling and responsive layout
  robots.ts        Robots.txt generation
  sitemap.ts       Sitemap generation

components/
  appearance-card.tsx
  resume-card.tsx
  theme-toggle.tsx
  topbar-breadcrumb.tsx

public/
  arnav-portrait.png
  Arnav_Mabrukar_Resume.pdf
  pokeball-pixel.svg
```

## Where To Edit Things

### Personal content

Most of the site content lives in:

- [app/page.tsx](/Users/arnm/WebstormProjects/PersonalPortfolio/app/page.tsx)

That file contains:

- hero intro text
- contact links
- featured project fallback content
- proof points
- experience highlights

### Styling

Main styling lives in:

- [app/globals.css](/Users/arnm/WebstormProjects/PersonalPortfolio/app/globals.css)

This includes:

- colors and theme variables
- layout spacing
- mobile responsiveness
- card styling
- resume modal styling

### SEO and metadata

Metadata and favicon setup live in:

- [app/layout.tsx](/Users/arnm/WebstormProjects/PersonalPortfolio/app/layout.tsx)

Sitemap and robots config live in:

- [app/sitemap.ts](/Users/arnm/WebstormProjects/PersonalPortfolio/app/sitemap.ts)
- [app/robots.ts](/Users/arnm/WebstormProjects/PersonalPortfolio/app/robots.ts)

## Dynamic Content

The homepage pulls in a few live data sources:

- featured GitHub projects
- recent public GitHub commits/activity

If GitHub requests fail, the site falls back to hardcoded content defined in `app/page.tsx`.

## Resume

The resume PDF is stored at:

- `public/Arnav_Mabrukar_Resume.pdf`

The resume card supports:

- preview in a modal
- direct PDF download

## Deployment

This site is intended to be deployed on Vercel.

If deploying manually:

1. Import the repo into Vercel
2. Keep the framework preset as `Next.js`
3. Use the repo root as the project root
4. Let Vercel run the default build command

## Notes

- Theme and accent preferences are saved in `localStorage`
- The site starts in dark mode
- Anchor links highlight sections when navigated to from the navbar

