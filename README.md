# Interactive Virtual Assistant (IVA)

Modern **Next.js (App Router)** frontend for an interactive virtual assistant with:
- AI assistant + chat history
- Mock interview simulator (sessions, messages, feedback)
- Document management (upload/list)
- Stripe billing / checkout
- 3D scenes using React Three Fiber

> Backend: this frontend expects a Spring Boot backend (OAuth2 + sessions + CSRF) running separately.

---

## Tech Stack

- **Next.js** (React 19, App Router)
- **TypeScript**
- **Tailwind CSS** (PostCSS)
- **Framer Motion** (UI animation)
- **React Three Fiber** / drei / three (3D)
- **Stripe** (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **WebSockets** STOMP (`@stomp/stompjs`) + SockJS
- PDF/Doc tooling: `react-pdf`, `pdf-lib`, `docx`, `mammoth`

---

## Getting Started (Local)

### Prerequisites

- **Node.js 20+**
- **npm**
- A running backend (Spring Boot) that provides:
  - REST API under `/api/v1/**`
  - OAuth2 login endpoints (e.g. `/oauth2/authorization/github`)
  - Session cookie auth (e.g. `JSESSIONID`)
  - CSRF cookie (typically `XSRF-TOKEN`)

### 1) Install dependencies

```bash
npm ci
```

### 2) Configure environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...
```

Notes:
- `NEXT_PUBLIC_BACKEND_URL` is required. The app will throw if it’s missing.
- This project uses **cookie-based auth** (`credentials: 'include'`). Ensure your backend CORS and cookie settings allow your frontend origin.

### 3) Run the dev server

```bash
npm run dev
```

Open: http://localhost:3000

---

## Scripts

From `package.json`:

- `npm run dev` — start Next dev server
- `npm run build` — typecheck + build (`tsc && next build`)
- `npm run start` — start the production server (`next start`)

---

## Key Environment Variables

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_BACKEND_URL` | ✅ | Backend base URL (e.g. `http://localhost:8080`) |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | ⚠️ | Stripe publishable key for Checkout / Billing Portal |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | ⚠️ | Mapbox token (if Mapbox features are used) |

---

## App Routes (high-level)

Routes live under `src/app/*`.

Common pages:
- `/` — landing page
- `/login`, `/signup` — auth pages
- `/assistant` — assistant UI
- `/dashboard` — dashboard
- `/interview` — interview flow
- `/interview-dashboard` — interview dashboard
- `/documents` — document management
- `/payment` — Stripe payment / plan selection
- `/settings` — account/settings

---

## Backend Integration Notes (Auth / CSRF)

This frontend is designed for Spring Security defaults:
- Auth is maintained via session cookies.
- CSRF token cookie: `XSRF-TOKEN`
- CSRF header sent by frontend: `X-XSRF-TOKEN`

See: `src/services/api.ts` (`csrfHeaders()` and `credentials: 'include'`).

---

## WebSockets

WebSocket client code is in:
- `src/services/ws.ts`

It expects `NEXT_PUBLIC_BACKEND_URL` and will connect to the backend’s WebSocket endpoint (commonly something like `/chat-websocket`).

---

## Project Structure (partial)

```text
src/
  app/                     # Next.js App Router routes
  components/              # UI components (dashboard, assistant, interview, settings, etc.)
  context/                 # React contexts (Auth, Theme)
  custompages/             # Legacy / page-level components used by routes
  services/                # API + websocket clients
public/                    # Static assets (images, 3D models)
```

---

## Docker

This repo includes a `Dockerfile` and `nginx.conf`.

### Important

The current Docker setup **builds Next.js into `./dist` and copies that folder into Nginx**:

- `next.config.mjs` sets `distDir: './dist'`
- Docker `builder` runs `npm run build`
- Production image serves `/app/dist` as static files

However, `nginx.conf` is written as a **reverse proxy** expecting a running Next server on `127.0.0.1:3000`.

So as-is:
- **Dockerfile = static file serving**
- **nginx.conf = reverse proxy for SSR**

If you want Docker to serve SSR correctly, the production stage should run `next start` (Node runtime), optionally behind Nginx. If you want static-only hosting, you’ll need `next export` and an `output: 'export'` configuration.

---

## Deployment

### Vercel (recommended)

This is the intended host for a Next.js App Router project.

1. Import the repo to Vercel
2. Set environment variables in Vercel:
   - `NEXT_PUBLIC_BACKEND_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
3. Deploy

If your backend uses cookies, ensure:
- correct CORS configuration
- cookie `SameSite` / `Secure` settings match your production domains

### GitHub Pages (not recommended for this app)

GitHub Pages is static hosting only.

This app uses server-dependent functionality (auth sessions, dynamic routes, API calls, etc.). If you want GitHub Pages, you typically need a fully static export (`next export`) and to avoid SSR/server-only features.

---

## Troubleshooting

### “There is no CSS / styles not loading”
- Ensure `src/app/layout.tsx` imports your global CSS (e.g. `src/app/index.css`).
- Ensure Tailwind is configured correctly (`postcss.config.js`, `tailwind.config.*` if present).

### Auth works until refresh (redirects to login)
- Check backend cookies/CORS (`credentials: 'include'`)
- Ensure the backend sets cookies for the correct domain, and `SameSite=None; Secure` when cross-site.

### WebSockets don’t connect
- Ensure `NEXT_PUBLIC_BACKEND_URL` is set
- Verify backend WebSocket endpoint and CORS / allowed origins

---

## License

MIT License

Copyright (c) 2026 Dennis Wong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
