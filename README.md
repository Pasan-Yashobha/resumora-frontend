# Resumora Frontend

> **Design Your Career Identity** — A modern, full-featured SaaS resume builder built with React, TypeScript, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

---

## Features

- 10 Professional Templates - 5 free + 5 premium with live preview
- Resume Builder - section-by-section editor with real-time preview
- Color Palettes - 10 accent themes per template
- PDF Download - high-quality PDF via html2canvas + jsPDF
- Email Sending - send resume directly to recruiters with PDF attached
- Stripe Payments - one-time $9.99 Premium upgrade
- Full Auth - register, login, email verification, resend
- Profile Image Upload - Cloudinary-powered
- Fully Responsive - mobile, tablet, desktop

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| State | Zustand (persisted) |
| Routing | React Router v6 |
| HTTP | Axios |
| Payments | Stripe.js + React Stripe Elements |
| PDF | html2canvas + jsPDF |
| Icons | React Icons |
| Notifications | React Hot Toast |

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running (see resumora-backend repo)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/resumora-frontend.git
cd resumora-frontend
npm install
cp .env.example .env.local
```

### Environment Variables

```env
VITE_API_URL=http://localhost:8080/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Run

```bash
npm run dev        # Development — http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

## Deployment

### Vercel

```bash
npm i -g vercel && vercel
```
Set `VITE_API_URL` and `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel dashboard.

### Netlify

Build command: `npm run build` | Publish directory: `dist`

---

Made with love by Pasan Yashobha
