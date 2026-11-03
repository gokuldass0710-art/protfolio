# Gokul Dass Kannan — Cybersecurity Portfolio

> **Title:** Aspiring Cybersecurity Professional
> **Focus:** SOC Analysis, Security Monitoring, Network Defense, Web Application Security
> **Education:** BCA (Multimedia & Animation), Hindustan Institute of Technology & Science
> **Training:** Cybersecurity & Ethical Hacking — Bostan Institute of Analysis
> **Contact:** gokuldass0710@gmail.com
> **Live Local Server:** `http://localhost:3000`

---

## 🛡️ Project Overview

This is a personal cybersecurity portfolio designed to showcase hands-on laboratory projects, realistic detection engineering workflows, and security testing methodologies.

### Core Architecture Highlights:
- **Central Configuration Single Source of Truth:** All personal details, credentials, and links are managed in `src/data/site.js`. No personal info is hard-coded in components.
- **Strict Evidence & Verification Standard:** All project results are transparently labeled as **Verified** or **Unverified / To Confirm**. Every case study cleanly separates **Implemented**, **Observed**, and **Recommended** states.
- **Honest Skill Leveling:** Skills use only fixed labels (`Hands-on`, `Learning`, `Fundamentals`) tied directly to laboratory project evidence — no arbitrary percentage meters or unsubstantiated claims.
- **High-Performance & Zero-Dependency:** Built with modern ES Modules, responsive CSS variables, semantic HTML5, SVG technical architecture diagrams, and a zero-dependency local Node.js HTTP server.
- **Security-First Portfolio Design:** Includes HTTP security headers (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`), anti-spam form honeypots, input validation, and an interactive terminal shell with safe static lookups.
- **Working Contact Form:** Fully integrated with [Resend](https://resend.com) — form submissions are delivered directly to `gokuldass0710@gmail.com`.

---

## 🚀 Quick Start (Running Locally)

### Option 1: Automatic Helper
Double-click `start.bat` in the project root:
```cmd
.\start.bat
```

### Option 2: Command Line (Node.js)
```bash
node server.js
```
The server will start at:
👉 **[http://localhost:3000](http://localhost:3000)**

### Option 3: Verification & Test Checklist
```bash
node server.js --verify
```

> ⚠️ **Note:** The server must be running for the contact form to work. Restart it after every reboot.

---

## 📁 Project Directory Structure

```text
cybersecurity-portfolio/
├── index.html                  # Single Page Application entrypoint & SEO metadata
├── server.js                   # High-performance zero-dependency local HTTP server
├── start.bat                   # 1-click localhost launcher
├── .env                        # Secret config (API key, emails) — NOT committed to Git
├── .env.example                # Safe placeholder template — safe to commit
├── .gitignore                  # Excludes .env and secrets from Git
├── vercel.json                 # Vercel deployment & security headers config
├── api/
│   └── contact.js              # Vercel serverless function wrapper for contact form
├── public/
│   ├── favicon.svg             # Shield badge SVG favicon
│   ├── og-image.svg            # 1200×630 Open Graph & Twitter card image
│   ├── robots.txt              # Search engine directives
│   ├── _headers                # Netlify security headers configuration
│   └── resume/
│       └── Gokul_Dass_Kannan_Resume.pdf  # (Add your resume PDF here)
└── src/
    ├── app.js                  # Modular client app logic, routing, modal & terminal
    ├── api/
    │   └── contactHandler.js   # Server-side email handler (Resend, validation, rate limiting)
    ├── data/
    │   ├── site.js             # Personal profile, education, links & availability
    │   ├── projects.js         # Detailed laboratory case studies & evidence
    │   ├── skills.js           # Verified skills categorized with levels
    │   └── certifications.js   # Certifications roadmap & active courses
    └── styles/
        └── main.css            # Dark cybersecurity theme tokens, grid & animations
```

---

## 🛠️ How to Customize Your Content

All website content is driven by the data files inside `src/data/`.

### 1. Personal Details & Social Links
Edit `src/data/site.js`:
```js
export const site = {
  name: "Gokul Dass Kannan",
  logo: "GK.",
  title: "Aspiring Cybersecurity Professional",
  links: {
    email: "gokuldass0710@gmail.com",   // ✅ Your email
    github: "",                          // Add your GitHub URL
    linkedin: "",                        // Add your LinkedIn URL
    resumePath: "/resume/Gokul_Dass_Kannan_Resume.pdf"
  },
  contactFormEndpoint: "/api/contact"
};
```
> Any empty social link automatically hides its button. No broken or dead `#` links are ever rendered.

### 2. Adding Your Resume PDF
Place your resume inside `public/resume/` named exactly:
`Gokul_Dass_Kannan_Resume.pdf`

The site automatically detects the file and enables the **View Resume** and **Download Resume** buttons. Until uploaded, it gracefully displays a muted "Resume coming soon" tooltip.

### 3. Adding or Updating Projects
Edit `src/data/projects.js`. Each project includes:
- `slug`, `title`, `category`, `status`
- `problem`, `objectives`, `environment`, `technologies`, `methodology`
- `implemented`, `observed`, `recommended` (distinct triage breakdown)
- `results`: `{ text: string, verified: boolean }[]`
- `limitations`: boundaries of what worked and what was out-of-scope
- `evidence`: diagram images or screenshots with captions

---

## 📬 Contact Form — Email Delivery via Resend

The portfolio contact form delivers submitted messages directly to your Gmail inbox via **[Resend](https://resend.com)**.

### ✅ Current Configuration (Already Set Up)

| Setting | Value |
|---|---|
| **RESEND_API_KEY** | Set in `.env` (secret, never shared) |
| **CONTACT_EMAIL** | `gokuldass0710@gmail.com` |
| **FROM_EMAIL** | `onboarding@resend.dev` |
| **Endpoint** | `POST /api/contact` |

### How It Works:
1. Visitor fills in the form and clicks **Transmit Message**.
2. Browser securely sends data to the server-side endpoint `/api/contact`.
3. Server validates required fields, email syntax, message length, and anti-spam honeypot.
4. Server rate-limits submissions (max 5 per 10 minutes per IP) to prevent spam floods.
5. Input is HTML-escaped to prevent injection vulnerabilities.
6. Email is dispatched via Resend REST API to `gokuldass0710@gmail.com`, with the visitor set as `reply_to`.
7. Visitor receives an immediate styled confirmation — without leaving your portfolio.

### Email Format Received:
```
Subject: New Portfolio Message: [Visitor's Subject]

Visitor Name:  [Name they entered]
Visitor Email: [Their email — click Reply to respond directly]
Subject:       [Their subject]
Message:       [Their message]
Received At:   [Server timestamp]
```

### Environment Configuration (`.env`):
```env
# 1. Your Resend API Key (starts with re_)
RESEND_API_KEY=re_your_actual_api_key

# 2. Your personal email where you want to receive messages
CONTACT_EMAIL=gokuldass0710@gmail.com

# 3. Verified Resend sender address
# For testing: onboarding@resend.dev (delivers to the email on your Resend account)
# For production: contact@yourcustomdomain.com (once verified in Resend)
FROM_EMAIL=onboarding@resend.dev
```

> **Security Note:** `.env` is listed in `.gitignore` and is **never exposed to the frontend or committed to GitHub**.

---

## 🌐 Deploying to Production

### Deploying to Vercel (Recommended)
1. Push this repository to GitHub (`.env` is in `.gitignore` — safe to push).
2. Import the repository in [Vercel](https://vercel.com/).
3. In Vercel Dashboard → **Settings** → **Environment Variables**, add:
   - `RESEND_API_KEY` = your real API key
   - `CONTACT_EMAIL` = `gokuldass0710@gmail.com`
   - `FROM_EMAIL` = `onboarding@resend.dev`
4. Vercel automatically reads `vercel.json` for SPA rewrites, security headers, and the `/api/contact` serverless function.

### Deploying to Netlify
1. Push this repository to GitHub.
2. Sign in to [Netlify](https://www.netlify.com/) and click **Add new site** > **Import an existing project**.
3. Set Build command to empty and Publish directory to `.`.
4. In Netlify Dashboard → **Environment Variables**, add the same 3 variables above.
5. Netlify automatically reads `public/_headers` for security headers.

### Deploying to GitHub Pages
1. Push repository to GitHub.
2. Go to **Settings** > **Pages** and set source branch to `main`.
3. Note: GitHub Pages does not support server-side functions — the contact form backend won't work. Use Vercel or Netlify for full functionality.

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| API key protection | Server-side only, never in frontend JS |
| Input validation | Required fields, email regex, max lengths |
| HTML injection prevention | All user input HTML-escaped before rendering |
| Anti-spam | Honeypot hidden field + rate limiting (5 req/10 min per IP) |
| HTTP security headers | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| No secrets in Git | `.env` excluded by `.gitignore` |
| Generic error messages | Visitors never see internal error details |

---

## 📋 Owner Checklist

- [x] Resend account created and API key configured in `.env`
- [x] Contact form delivering emails to `gokuldass0710@gmail.com`
- [x] About Me, Education, and Training sections updated
- [x] CGPA/academic scores removed from portfolio
- [ ] Add your **LinkedIn** URL to `src/data/site.js`
- [ ] Add your **GitHub** URL to `src/data/site.js`
- [ ] Export your resume as PDF → save as `public/resume/Gokul_Dass_Kannan_Resume.pdf`
- [ ] Verify Resend custom domain for production sending (optional)
- [ ] Deploy to Vercel or Netlify for public access

---

## 📄 License
MIT © 2026 Gokul Dass Kannan
