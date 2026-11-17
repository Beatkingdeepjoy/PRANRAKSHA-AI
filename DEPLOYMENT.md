# PRANRAKSHA AI — PRODUCTION DEPLOYMENT RUNBOOK
> **Predict Danger. Connect Help. Save Lives.**

---

## 1. Architecture Overview

PRANRAKSHA AI is architected as a distributed cloud emergency response platform:

| Tier | Service | Provider | Production Configuration |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 14 App Router, TypeScript, Tailwind CSS, MapLibre GL | **Vercel** | Framework: Next.js<br>Root Directory: `./`<br>Build: `npm run build` |
| **AI Backend** | Python 3.13 FastAPI Microservice (DBSCAN & Hydrological Engine) | **Render** | Runtime: Python<br>Root Directory: `ai-service`<br>Start: `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Database & Auth** | PostgreSQL 15, PostGIS, Realtime WebSockets | **Supabase** | Schema: `supabase/schema.sql` (23 Relational Tables + RLS) |
| **Source Control** | Git Repository (`main` branch) | **GitHub** | Repository: `PRANRAKSHA-AI` |

---

## 2. Phase 1 & 2: GitHub Repository Setup & Push Commands

### Initial Verification
```bash
# Check status and staged files
git status

# Commit the verified production code
git commit -m "feat(core): initial production release of PRANRAKSHA AI"

# Link your GitHub remote repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/PRANRAKSHA-AI.git

# Set default branch to main and push
git branch -M main
git push -u origin main
```

> **Security Guarantee:**
> `.gitignore` is configured to strictly exclude `.env`, `.env.local`, `node_modules`, `.next`, and build artifacts. All secrets remain safe on your local workstation.

---

## 3. Phase 3: Supabase Database & Auth Deployment

1. **Log in to Supabase Console**: [https://app.supabase.com](https://app.supabase.com)
2. **Select or Create Project**:
   * Project Name: `PRANRAKSHA-AI-PROD`
   * Region: `ap-south-1` (Mumbai / India) for lowest latency in Tripura & Northeast India.
3. **Execute SQL Schema**:
   * Open the **SQL Editor** tab from the left sidebar.
   * Click **New query**.
   * Copy and paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql).
   * Click **Run** (`Ctrl + Enter`).
   * *Result:* Creates PostGIS extensions, spatial geometry columns, all 23 production tables (`incidents`, `profiles`, `rescue_teams`, `shelters`, `hospitals`, `journey_sessions`, `notifications`, etc.), and Row Level Security (RLS) policies.
4. **Collect Production Credentials**:
   * Navigate to **Project Settings (⚙️) → API**.
   * Copy:
     * `Project URL` (e.g. `https://xyzcompany.supabase.co`)
     * `anon public` key (`eyJh...`)
     * `service_role` secret key (`eyJh...`)

---

## 4. Phase 4: Render Backend Deployment (FastAPI Microservice)

1. **Log in to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
2. **Create New Web Service**:
   * Click **New +** → **Web Service**.
   * Connect your GitHub repository: `PRANRAKSHA-AI`.
3. **Configure Service Settings**:
   * **Name**: `pranraksha-ai-service`
   * **Region**: Singapore or Frankfurt
   * **Branch**: `main`
   * **Root Directory**: `ai-service`
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   * **Health Check Path**: `/health`
4. **Environment Variables on Render**:
   In the **Environment** section, add:
   * `ALLOWED_ORIGINS` = `*` *(or your production Vercel URL once deployed)*
   * `PYTHON_VERSION` = `3.13.0`
5. Click **Create Web Service**.
6. Once deployed, note down your Render URL:
   `https://pranraksha-ai-service.onrender.com`

---

## 5. Phase 5: Vercel Frontend Deployment (Next.js Application)

1. **Log in to Vercel**: [https://vercel.com](https://vercel.com)
2. **Import Project**:
   * Click **Add New...** → **Project**.
   * Select the `PRANRAKSHA-AI` repository from GitHub.
3. **Build & Project Configuration**:
   * **Framework Preset**: `Next.js`
   * **Root Directory**: `./` (Root)
   * **Build Command**: `next build` (Default)
   * **Output Directory**: `.next` (Default)
   * **Install Command**: `npm install` (Default)
4. **Environment Variables on Vercel**:
   Add the following environment variables in the Vercel project settings:
   
   | Variable Name | Value / Description | Required? |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Yes |
   | `NEXT_PUBLIC_APP_ENV` | `production` | Yes |
   | `NEXT_PUBLIC_DEMO_MODE` | `false` *(or `true` for demonstration with preloaded incidents)* | Yes |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Yes (Real mode) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase `anon` public key | Yes (Real mode) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase `service_role` key | Yes (Server-side) |
   | `NEXT_PUBLIC_AI_API_URL` | Your Render URL (e.g. `https://pranraksha-ai-service.onrender.com`) | Yes |
   | `AI_SERVICE_URL` | Your Render URL (e.g. `https://pranraksha-ai-service.onrender.com`) | Yes |
   | `HUGGINGFACE_API_TOKEN` | Your Hugging Face read token (`hf_...`) | Optional |
   | `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Optional |
   | `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Optional |
   | `TWILIO_PHONE_NUMBER` | Your Twilio Phone Number | Optional |

5. Click **Deploy**.
6. Your Vercel frontend is live at `https://pranraksha-ai.vercel.app`.

---

## 6. Phase 6: Service Interconnection & Production CORS

1. **Update Render CORS**:
   * Go back to Render Dashboard → `pranraksha-ai-service` → **Environment**.
   * Set `ALLOWED_ORIGINS` = `https://pranraksha-ai.vercel.app,http://localhost:3000`.
2. **Update Supabase Auth URL**:
   * In Supabase Console → **Authentication → URL Configuration**.
   * Set **Site URL** = `https://pranraksha-ai.vercel.app`.
   * Add Redirect URL: `https://pranraksha-ai.vercel.app/**`.

---

## 7. Verification Checklist

- [x] Frontend builds cleanly with zero errors (`npm run build` exits with code 0).
- [x] All 37 static and dynamic routes compiled.
- [x] Secret scanning passed — zero credentials checked into git.
- [x] `.gitignore` verified — `node_modules`, `.next`, `.env.local` strictly excluded.
- [x] Backend entry point verified (`ai-service/main.py` -> `main:app`).
- [x] Health check endpoint `/health` operational in backend.
- [x] CORS middleware configured on FastAPI microservice.
- [x] Supabase PostGIS schema validated (`supabase/schema.sql`).
- [x] Watermark-free GIS maps operational with CARTO Dark Matter & ESRI World Imagery.
- [x] Device GPS browser geolocation active.
- [x] OpenStreetMap OSRM routing engine active for turn-by-turn road calculations.
- [x] Open-Meteo hydrology telemetry synced.
