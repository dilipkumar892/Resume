# Resume Portfolio — Dileep Kumar Bardhan

A modern, interactive single-page resume and portfolio website built for **Dileep Kumar Bardhan**, a Desktop Support Engineer & IT Support Specialist. Features a rich dark/light theme, engaging animations, keyboard shortcuts, and a Google Sheets–powered contact form with spam protection.

## ✨ Features

### Core Sections
- **Hero Section** — Animated intro with typing effect, avatar, badges, CTA buttons, social links (incl. WhatsApp)
- **About Section** — Personal summary, animated stats counters with power-pulse, highlight cards
- **Experience Section** — Timeline-based work history (most recent first) with staggered animations
- **Skills Section** — Categorized skill groups with animated circular progress rings
- **Certifications Section** — Achievement cards with progress bars and hover effects
- **Education Section** — Academic background cards
- **Portfolio Section** — Filterable project cards (All / Networking / Hardware / Security) with detail modals
- **Contact Section** — Contact info + copy-email button + Google Sheets–connected form
- **Footer** — Quick links, social icons, dynamic copyright year

### Interactive Features
| Feature | Description |
|---------|-------------|
| 🌗 **Dark/Light Theme** | Toggle with `localStorage` persistence + `?` keyboard shortcut |
| ⌨️ **Typing Effect** | Role titles cycle with typewriter animation |
| 🎯 **Particle Network** | Interactive canvas background responding to mouse (DPR-aware, battery-friendly) |
| 📜 **Scroll Progress Bar** | Gradient bar at the top tracking scroll position |
| 💠 **Back-to-Top Ring** | Circular progress ring around the scroll-to-top button |
| 🃏 **3D Tilt Cards** | Cards tilt on mouse hover with perspective |
| 🔘 **Button Ripple** | Click ripple effect on all buttons |
| 🔢 **Animated Counters** | Stats count up with ease-out animation + Solo Leveling power pulse |
| 🖼️ **Project Modals** | Detail modals for portfolio items with focus trap |
| 📄 **Resume Preview Modal** | In-page PDF preview |
| 🎛️ **Portfolio Filter** | Filter projects by category with re-triggered animations |
| 🎭 **Scroll Reveal Animations** | Sections fade in as you scroll (JS-gated, no-JS safe) |
| 🎯 **Active Nav Highlight** | Current section tracked in nav bar (also on load) |
| 📱 **Mobile Hamburger Menu** | Responsive navigation with `aria-expanded` |
| ⌨️ **Keyboard Shortcuts** | `?` help, `T` theme, `B` back-to-top, `Esc` close |
| ✉️ **Copy Email** | One-click copy email with toast feedback |
| 🌍 **WhatsApp Link** | Direct `wa.me` contact link in the hero |
| ♿ **Accessibility** | Skip link, focus-visible styles, ARIA labels, reduced-motion support, no-JS fallback |

### ⚡ Solo Leveling Theme — Dark Epic Animations
The site features a **Solo Leveling** anime-inspired theme with unique effects:

| Effect | Description |
|--------|-------------|
| ⏳ **Preloader** | "SYSTEM LOADING" bar with spinning ring (auto-hides, 4s max fallback) |
| 🌑 **Shadow Aura** | Rotating conic gradient aura on cards |
| ⬆️ **"Arise" Rising Effect** | Elements rise with shadow fade when scrolling into view (does not block hover/tilt) |
| 🔮 **Dark Portal/Gate** | Radial gradient pulse behind cards |
| 💜 **Shadow Particles** | Floating purple particles on scroll and avatar click burst |
| ⚡ **Power Pulse** | Stat counters pulse with energy on completion |
| 📟 **System Messages** | Solo Leveling UI-style notifications on page load |
| 🎭 **Solo Border** | Purple-tinted card borders with glow |
| ✨ **Button Shimmer** | Animated gradient shimmer on primary buttons |
| 🖱️ **Custom Cursor** | Animated glowing cursor with hover/pressed states (fine-pointer, no reduced-motion) |
| 🕹️ **Konami Code** | Enter ↑↑↓↓←→←→BA to trigger a portal aura burst |

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure, semantic markup, SEO/OG/JSON-LD meta |
| **CSS3** | Styling, animations, responsive design, custom properties |
| **Vanilla JavaScript (ES6+)** | All interactivity, DOM manipulation, canvas API, keyboard shortcuts |
| **Google Apps Script** | Backend for contact form → Google Sheets (hardened) |
| **Font Awesome 6** | Icons throughout the UI (CDN with preconnect) |

## 📁 Project Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML document — sections, modals, SEO meta, JSON-LD schema |
| `style.css` | Complete stylesheet — themes, layouts, animations, responsive, Solo Leveling effects |
| `script.js` | JS — theme toggle, particles, typing effect, modals, form, filters, shortcuts, custom cursor |
| `Code.gs` | Google Apps Script — hardened contact-form backend (validation, sanitization, rate limit) |
| `resume.pdf` | Printable resume document for download and preview |
| `robots.txt` | Search-engine crawling rules + sitemap reference |
| `sitemap.xml` | XML sitemap for Google ranking |
| `images/og-cover.svg` | Open Graph / Twitter card image |
| `README.md` | Project documentation (this file) |
| `TODO.md` | Development tracking and analysis notes |
| `TESTING_REPORT.md` | Automated & manual test report |

## 🚀 Deployment

### Static Hosting (GitHub Pages, Netlify, Vercel, etc.)
The site is fully static and can be deployed to any static hosting provider:

1. Push the repository to GitHub
2. Enable **GitHub Pages** from Settings → Pages
3. Or deploy via **Netlify** / **Vercel** by connecting your repo
4. No build step required — just serve the root folder

### Google Sheets Contact Form Setup
The contact form stores submissions in Google Sheets via Google Apps Script:

1. Create a Google Sheet and rename the first tab to **`Responses`**
2. Open **Extensions → Apps Script** from the Google Sheet menu
3. Paste the contents of `Code.gs` into the editor
4. Click **Deploy → New Deployment** → Select **Web App**
5. Configure:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
6. Copy the generated **Web App URL**
7. Update `index.html`: replace the form `action` URL with your new Web App URL
8. **Test:** Submit a message and verify it appears in the `Responses` sheet

> **Note:** The backend validates input, neutralizes formula injection, rate-limits submissions (60/hour script-wide), and ignores honeypot (spam) submissions. The frontend reads the JSON response to show real success/error feedback.

## 🎨 Design Goals

- Clean and modern presentation
- Strong visual hierarchy
- Responsive behavior on mobile and desktop
- Smooth animations without sacrificing readability (with `prefers-reduced-motion` support)
- Consistent styling, custom scrollbar, theme-aware text selection
- Anime-inspired dark theme effects (Solo Leveling)

## 🖥️ How to View

Open `index.html` in your browser, or serve the folder with any local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then navigate to `http://localhost:8000` in your browser.

## ♿ Accessibility

- Skip-to-content link as the first focusable element
- `aria-hidden` on decorative canvases and orbs
- `aria-label` on icon-only controls and `aria-expanded` on the hamburger
- `aria-labelledby` on dialog modals, `role="status"` on toasts/form messages
- Focus ring via `:focus-visible`, focus trap + focus restore in modals
- `prefers-reduced-motion` disables animations and the custom cursor
- `<noscript>` fallback + JS-gated reveal classes so content is never invisible without JS

## 🔧 Development Notes

- All core changes are kept within HTML, CSS, and JavaScript files
- The structure is intentionally simple so it can be edited easily without a framework
- Theme preference is persisted in `localStorage`
- All animations are CSS-based where possible, with JavaScript for interactivity
- Scroll work is consolidated into a single `requestAnimationFrame`-throttled handler
- The Google Apps Script (`Code.gs`) is a standalone deployment — copy it to your Google Sheet's Apps Script editor

## 📄 License

© 2026 Dileep Kumar Bardhan. All rights reserved.

