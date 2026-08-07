# Spark — Dating Application (Frontend)

> A modern, full-featured dating application frontend built with **Next.js 16**, **React 19**, and **TailwindCSS 4**. Designed for smooth real-time interactions, clean UI, and a polished user experience.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Pages & Routes](#pages--routes)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

Spark Frontend is the client-side interface for the Spark dating platform. It provides a seamless experience for browsing profiles, chatting with matches, managing subscriptions, and more — with real-time updates powered by Socket.IO and smooth animations via Framer Motion and GSAP.

---

## Tech Stack

| Category         | Technology                          |
|------------------|-------------------------------------|
| Framework        | Next.js 16 (App Router)             |
| UI Library       | React 19                            |
| Styling          | TailwindCSS 4                       |
| Language         | TypeScript 5                        |
| State Management | Redux Toolkit + React Redux         |
| Forms            | React Hook Form + Zod               |
| Animations       | Framer Motion, GSAP                 |
| Real-time        | Socket.IO Client                    |
| Auth             | Google OAuth (`@react-oauth/google`)|
| HTTP Client      | Axios                               |
| Charts           | Recharts                            |
| Icons            | Lucide React, React Icons           |
| Date Handling    | Day.js                              |
| Notifications    | React Hot Toast                     |
| Linting          | ESLint 9 + eslint-config-next       |

---

## Project Structure

```
spark-frontend/
├── public/                     # Static assets (logo, images, etc.)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Public-facing pages (landing, auth, about, etc.)
│   │   │   ├── (auth)/         # Login, register, forgot password
│   │   │   ├── about/
│   │   │   ├── careers/
│   │   │   └── contact/
│   │   ├── user/               # Authenticated user pages
│   │   │   ├── home/           # Discover / swipe page
│   │   │   ├── matches/        # Matches list
│   │   │   ├── messages/       # Chat conversations
│   │   │   ├── notifications/  # In-app notifications
│   │   │   ├── history/        # Like/pass history
│   │   │   ├── premium/        # Subscription & upgrade
│   │   │   ├── profile/        # User profile management
│   │   │   └── settings/       # Account settings
│   │   └── admin/              # Admin dashboard & management
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Admin-specific components
│   │   ├── auth/               # Login, register forms
│   │   ├── chat/               # Messaging UI
│   │   ├── common/             # Shared components (buttons, modals, etc.)
│   │   ├── guards/             # Route protection (auth guards)
│   │   ├── landing/            # Landing page sections
│   │   ├── layout/             # Navbar, sidebar, footer
│   │   ├── providers/          # Context & store providers
│   │   ├── ui/                 # Base UI primitives
│   │   └── user/               # User-specific components
│   ├── constants/              # App-wide constant values
│   ├── contexts/               # React Context definitions
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility library wrappers
│   ├── proxy.ts                # API proxy configuration
│   ├── services/               # API service functions (Axios)
│   ├── store/                  # Redux store & slices
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Helper utilities
│   └── validations/            # Zod validation schemas
├── .env.local                  # Local environment variables (not committed)
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Features

- **Authentication** — Email/password login, registration, and Google OAuth 2.0
- **Profile Discovery** — Browse and swipe through user profiles
- **Matchmaking** — Like, pass, and get notified on mutual matches
- **Real-Time Chat** — Instant messaging with matched users via Socket.IO + emoji picker
- **Notifications** — Live in-app notification feed
- **History** — View past likes and passes
- **Premium / Subscriptions** — Upgrade page with subscription plan selection (Stripe)
- **Profile Management** — Edit bio, photos, interests, and preferences
- **Admin Dashboard** — User management, reports, and analytics with charts (Recharts)
- **Route Guards** — Protected routes with auth middleware
- **Animations** — Smooth transitions via Framer Motion and GSAP
- **Form Validation** — Type-safe forms with React Hook Form + Zod
- **Responsive UI** — Fully responsive across desktop and mobile

---

## Pages & Routes

| Route                  | Description                          |
|------------------------|--------------------------------------|
| `/`                    | Landing page                         |
| `/about`               | About Spark                          |
| `/careers`             | Careers page                         |
| `/contact`             | Contact page                         |
| `/login`               | User login                           |
| `/register`            | User registration                    |
| `/user/home`           | Discover / swipe page                |
| `/user/matches`        | View all matches                     |
| `/user/messages`       | Chat with matches                    |
| `/user/notifications`  | Notification feed                    |
| `/user/history`        | Like/pass history                    |
| `/user/premium`        | Subscription & upgrade               |
| `/user/profile`        | Manage your profile                  |
| `/user/settings`       | Account settings                     |
| `/admin/*`             | Admin panel (protected)              |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- A running instance of the [Spark Backend](https://github.com/SparkDx2Y/backend)

---

### Installation

```bash
# Clone the repository
git clone https://github.com/SparkDx2Y/spark-frontend.git
cd spark-frontend

# Install dependencies
npm install
```

---

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Socket.IO
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```



---

### Running Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Script        | Command          | Description                           |
|---------------|------------------|---------------------------------------|
| Development   | `npm run dev`    | Start Next.js dev server              |
| Build         | `npm run build`  | Build for production                  |
| Production    | `npm start`      | Start production server               |
| Lint          | `npm run lint`   | Run ESLint checks                     |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `develop`

---

> Made with by **Achu** — Spark Development Team