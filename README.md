# Resume Portfolio — Dileep Kumar Bardhan

A modern, interactive single-page resume and portfolio website built for **Dileep Kumar Bardhan**, a Desktop Support Engineer & IT Support Specialist. Features a rich dark/light theme, engaging animations, and a Google Sheets–powered contact form.

## ✨ Features

### Core Sections
- **Hero Section** — Animated intro with typing effect, avatar, badges, CTA buttons, social links
- **About Section** — Personal summary, stats counters, highlight cards
- **Experience Section** — Timeline-based work history with staggered animations
- **Skills Section** — Categorized skill groups with animated progress bars
- **Certifications Section** — Achievement cards with hover effects
- **Education Section** — Academic background cards
- **Portfolio Section** — Project cards with clickable detail modals
- **Contact Section** — Contact info + form with Google Sheets integration
- **Footer** — Quick links, social icons, copyright

### Interactive Features
| Feature | Description |
|---------|-------------|
| 🌗 **Dark/Light Theme** | Toggle with `localStorage` persistence |
| ⌨️ **Typing Effect** | Role titles cycle with typewriter animation |
| 🎯 **Particle Network** | Interactive canvas background responding to mouse |
| 📜 **Scroll Progress Bar** | Gradient bar at top tracking scroll position |
| 🃏 **3D Tilt Cards** | Cards tilt on mouse hover with perspective |
| 🔘 **Button Ripple** | Click ripple effect on all buttons |
| 🔢 **Animated Counters** | Stats count up with ease-out animation |
| 🖼️ **Project Modals** | Detail modals for portfolio items |
| 📄 **Resume Preview Modal** | In-page PDF preview |
| 🎭 **Scroll Reveal Animations** | Sections fade in as you scroll |
| 🎯 **Active Nav Highlight** | Current section tracked in nav bar |
| 📱 **Mobile Hamburger Menu** | Responsive navigation |

### ⚡ Solo Leveling Theme — Dark Epic Animations
The site features a **Solo Leveling** anime-inspired theme with unique effects:

| Effect | Description |
|--------|-------------|
| 🌑 **Shadow Aura** | Rotating conic gradient aura on cards |
| ⬆️ **"Arise" Rising Effect** | Elements rise with shadow fade when scrolling into view |
| 🔮 **Dark Portal/Gate** | Radial gradient pulse behind cards |
| 💜 **Shadow Particles** | Floating purple particles on scroll and avatar click |
| ⚡ **Power Pulse** | Stat counters pulse with energy on completion |
| 📟 **System Messages** | Solo Leveling UI-style notifications on page load |
| 🎭 **Solo Border** | Purple-tinted card borders with glow |
| ✨ **Button Shimmer** | Animated gradient shimmer on primary buttons |

### Security Features
- Right-click context menu disabled
- Text selection restricted (except form inputs)
- Drag and copy protection enabled
- Resume download still works normally

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, animations, responsive design, custom properties |
| **Vanilla JavaScript (ES6+)** | All interactivity, DOM manipulation, canvas API |
| **Google Apps Script** | Backend for contact form → Google Sheets |
| **Font Awesome 6** | Icons throughout the UI |
| **Google Fonts** | System fonts (Segoe UI, etc.) |

## 📁 Project Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML document — all sections, modals, SEO meta tags |
| `style.css` | Complete stylesheet — theme variables, layouts, animations, responsive, Solo Leveling effects |
| `script.js` | JavaScript — theme toggle, particle canvas, typing effect, modals, form handling, 3D tilt, counters, animations |
| `Code.gs` | Google Apps Script — handles contact form POST requests, saves data to Google Sheets |
| `resume.pdf` | Printable resume document for download and preview |
| `README.md` | Project documentation (this file) |
| `TODO.md` | Development tracking and analysis notes |

## 📋 Section Blueprint

1. **Hero Section** — Intro, name, role, call-to-action buttons, animated visual background, avatar, social links
2. **About Section** — Personal summary, stats (1+ years, 100+ systems, 500+ issues), highlight cards
3. **Experience Section** — Professional timeline with work history cards (HITPA, LearningRoutes)
4. **Skills Section** — 6 categories: Technical Support, OS, Software, Hardware, Remote Tools, IT Support Tasks
5. **Certifications Section** — CompTIA A+, Microsoft 365, Networking Basics, Key Achievement
6. **Education Section** — MCA (AKTU), B.Sc. Computer Science (DBRAU)
7. **Portfolio Section** — 3 projects with detail modals and tags
8. **Contact Section** — Contact info + Google Sheets–connected form
9. **Footer** — Closing information and quick links

## 🚀 Deployment

### Static Hosting (GitHub Pages, Netlify, Vercel, etc.)
The site is fully static and can be deployed to any static hosting provider:

1. Push the repository to GitHub
2. Enable **GitHub Pages** from the repository Settings → Pages
3. Or deploy via **Netlify** / **Vercel** by connecting your repo
4. No build step required — just serve the root folder

### Google Sheets Contact Form Setup
The contact form stores submissions in Google Sheets via Google Apps Script:

1. **Create a Google Sheet** with columns: `Timestamp | Name | Email | Message`
2. Open **Extensions → Apps Script** from the Google Sheet menu
3. Paste the contents of `Code.gs` into the editor
4. Click **Deploy → New Deployment** → Select **Web App**
5. Configure:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
6. Copy the generated **Web App URL**
7. Update `index.html`: replace the form `action` URL with your new Web App URL
8. **Test:** Submit a message and verify it appears in the Google Sheet

> **Note:** The form uses `no-cors` mode, so the response can't be read directly. Success is assumed if no network error occurs.

## 🎨 Design Goals

- Clean and modern presentation
- Strong visual hierarchy
- Responsive behavior on mobile and desktop
- Smooth animations without sacrificing readability
- Consistent styling across all sections
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

## 🔧 Development Notes

- All core changes are kept within HTML, CSS, and JavaScript files
- The structure is intentionally simple so it can be edited easily without a framework
- Theme preference is persisted in `localStorage`
- All animations are CSS-based where possible, with JavaScript for interactivity
- The Google Apps Script (`Code.gs`) is a standalone deployment — copy it to your Google Sheet's Apps Script editor

## 📄 License

© 2026 Dileep Kumar Bardhan. All rights reserved.
