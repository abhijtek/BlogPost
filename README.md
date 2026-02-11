# BlogPost

A full-stack publishing platform with a modern React frontend, Express API backend, role-based moderation, rich text editing, and image-backed articles.

## Why This Project
BlogPost is built for teams that need more than basic CRUD:
- Writer workflow: draft -> submit -> publish/reject
- Admin moderation with full content review
- Rich article editing (TinyMCE)
- Tagging, sorting, filtering, and view tracking
- Appwrite-powered media storage for featured images

## Tech Stack

### Frontend
- React 19 + Vite 7
- React Router 7
- Redux Toolkit
- Tailwind CSS v4
- TinyMCE (`@tinymce/tinymce-react`)
- Axios + Appwrite SDK

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT auth (access + refresh)
- `bcrypt`, `cookie-parser`, `cors`, `express-validator`
- Nodemailer + Mailgen (auth/email flows)

## Project Structure
```text
BlogPost/
  backend/
    src/
      controllers/
      routes/
      models/
      middlewares/
      utils/
  frontend/
    src/
      components/
      pages/
      store/
      psappwrite/
```

## Core Features
- Authentication (register, login, logout, current user)
- Profile updates (username + avatar metadata)
- Article lifecycle:
  - `draft`
  - `pending` (submitted for review)
  - `published`
  - `rejected`
- Admin review panel:
  - approve/reject pending posts
  - rejection notes
  - full blog visibility (title, tags, image, content)
- Public browsing:
  - feed cards
  - article details
  - sorting by date/views
  - tag and text filtering
- View counter with 24-hour per-user threshold logic

## Local Development

### 1. Clone + Install
```bash
# from repo root
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

#### Backend (`backend/.env`)
Minimum keys used by code:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
ADMIN_PROMOTE_SECRET=your_admin_promote_secret
USER_VIEW_LIMIT_24=5

MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_PORT=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=
```

#### Frontend (`frontend/.env`)
```env
VITE_BACKEND_BASE_URL=http://localhost:3000
VITE_APPWRITE_URL=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_BUCKET_ID=
VITE_APPWRITE_APIKEY=
VITE_APPWRITE_APIENDPOINT=
```

### 3. Run Dev Servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173` by default.

## Scripts

### Backend
- `npm run dev` -> start API with nodemon
- `npm start` -> start API with node

### Frontend
- `npm run dev` -> start Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview built app
- `npm run lint` -> run ESLint

## API Overview
Base URL: `/api/v1`

### Auth (`/auth`)
- `POST /register`
- `POST /login`
- `POST /logout` (auth)
- `GET /current-user` (auth)
- `PATCH /profile` (auth)
- `POST /admin/promote` (auth)
- plus email/refresh/password routes

### Blogs (`/blogs`)
- `POST /posts` (auth)
- `GET /posts` (public published posts)
- `GET /posts/:slug` (public published post)
- `PUT /posts/:slug` (owner)
- `DELETE /posts/:slug` (owner)
- `GET /posts/my` (auth)
- `GET /posts/my/:slug` (auth)
- `POST /posts/:slug/submit` (owner)
- `GET /posts/pending` (admin)
- `PATCH /posts/:slug/review` (admin)
- `POST /posts/:slug/view` (auth, published)

## Deployment Notes
- Frontend can be deployed to Vercel.
- Backend can be deployed on a Node host (Render/Railway/Vercel Functions, etc.).
- Ensure `CORS_ORIGIN` matches deployed frontend URL.
- Ensure `VITE_BACKEND_BASE_URL` points to deployed backend.

## Common Troubleshooting
- Avatar not visible after login:
  - Ensure frontend dispatches `login({ userData })` shape.
- Slow first load on deployment:
  - Check TTFB vs bundle time separately.
  - Confirm backend region near DB.
  - Reduce initial JS bundle and avoid heavy startup work.
- CORS cookie/session issues:
  - Set `credentials: true` on frontend requests (already enabled in axios instance).
  - Use correct origin and HTTPS in production.

## License
Private/internal use unless you define otherwise.
