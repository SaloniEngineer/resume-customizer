# TailorCraft — AI-Powered Resume Customizer Web App

A production-grade full-stack web application that customizes a candidate's resume to match a specific Job Description (JD) using an LLM. TailorCraft analyzes requirements, prioritizes relevant skills, re-phrases bullet points with high-impact action verbs, calculates an ATS match score, and produces downloadable PDF, DOCX, and TXT resumes — while enforcing a strict **zero-hallucination** constraint.

---

## 1. System Architecture

```
User (Browser)
   │
   ▼
Next.js 14 App Router (React + Tailwind CSS + Lucide Icons)
   │  • Job Description Input & Validation (Min 50 chars)
   │  • Resume Upload (Drag-and-Drop, PDF & DOCX, Max 5MB)
   │  • Interactive Customization Scope & Cover Letter Toggle
   │  • Real-time Animated Loading Milestones
   │  • Clean ATS Resume Preview & Clipboard Copy
   │  • Match Score Gauge, ATS Readiness & Breakdown
   │  • Diff & Transparency View
   │  • Download Handlers (.pdf, .docx, .txt)
   │
   │  REST API Calls (Multipart/Form-Data & JSON)
   ▼
Python FastAPI Backend (Uvicorn)
   │  • Request Validation & HTTP Error Handling
   │  • Secure CORS (Wildcard dev + Configured Frontend URL)
   │  • Pydantic v2 Schema Enforcement
   │
   ├──► Resume Parsing Layer
   │       • PyMuPDF (fitz) for PDF text extraction & scanned detection
   │       • python-docx for Word document text & table extraction
   │
   ├──► LLM Orchestration Layer
   │       • Groq API (llama-3.3-70b-versatile / llama-3.1-8b-instant)
   │       • Strict Zero-Hallucination System Prompt
   │       • Structured JSON Output with fallback repair
   │       • Keyword Overlap & ATS Score Calculation
   │
   └──► Document Generation Layer
           • ReportLab for high-fidelity, styled PDF generation
           • python-docx for Word document generation
           • Plain Text generator with clean spacing & headers
```

---

## 2. Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript | Fast, server-capable modern frontend with responsive layouts |
| **Styling** | Tailwind CSS + Lucide React | Modern executive SaaS design, rich color tokens, glassmorphism |
| **Backend** | Python 3.10+ / 3.13, FastAPI, Uvicorn | High-performance asynchronous API framework |
| **Resume Parsing** | PyMuPDF (`fitz`), `python-docx` | Robust extraction for PDF and DOCX files; detects empty/scanned docs |
| **LLM Provider** | Groq API (`llama-3.3-70b-versatile`) | Ultra-fast inference with strict structured JSON output |
| **Document Export** | ReportLab (PDF), `python-docx` (DOCX) | Server-side pixel-perfect document rendering |
| **Deployment** | Vercel (Frontend), Render (Backend) | Cloud-native hosting with zero cold-starts on edge |

---

## 3. Core & Bonus Features

### Core Features (100% Implemented)
- **Job Description Input**: Large responsive textarea, character/word counters, validation for empty or excessively short text (<50 chars), and a 1-click **Sample JD** loader.
- **Resume Upload**: Drag-and-drop zone supporting `.pdf` and `.docx` files up to 5 MB, with filename and size indicators, error messaging, and a 1-click **Demo Resume** button for instant evaluation.
- **AI Customization**:
  - Rewrites professional summary directly aligned with the target role.
  - Prioritizes and categorizes existing skills (Languages, Frameworks, Tools, Cloud).
  - Enhances experience and project bullet points using action verbs and quantifiable impact.
  - Optimizes for relevant ATS keywords while strictly forbidding hallucinated metrics, degrees, or employers.
  - Suggests missing keywords separately.
- **Results Display**: Structured, printable resume view with copy buttons for individual sections and full text.
- **Multi-Format Downloads**:
  - **PDF (.pdf)**: Styled with executive margins, navy/teal headers, and bullet formatting via ReportLab.
  - **Plain Text (.txt)**: Cleanly formatted ATS-friendly text.
  - **Word Document (.docx)**: Formatted Word document with proper typography.

### Bonus Features (100% Implemented)
1. **Match Score & ATS Readiness**: Transparent match score gauge with breakdown across Keyword Overlap, Skills Alignment, and Experience Relevance.
2. **Diff & Transparency View**: Side-by-side comparison between original content and customized sections, showing what changed.
3. **Cover Letter Generator**: Generates a tailored 3-paragraph cover letter using verified resume facts and target JD, with copy and download options.
4. **Section Selection**: Checkboxes allowing candidates to select which sections to customize (Summary, Skills, Experience, Projects).
5. **Responsive SaaS UI**: Optimized for all screen sizes from mobile to wide desktop monitors.

---

## 4. Local Setup & Running Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ and npm
- (Optional) Free Groq API Key from [console.groq.com](https://console.groq.com)

---

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd resume-customizer
```

---

### Step 2: Backend Setup (FastAPI)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   FRONTEND_URL=http://localhost:3000
   ```
   *(Note: If no Groq API key is supplied, the backend automatically uses an intelligent local demo customizer so you can still test all parsing, formatting, scoring, and downloads!)*

5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend API will be live at `http://localhost:8000`.
   - Health check: `http://localhost:8000/health`
   - Interactive Swagger API Docs: `http://localhost:8000/docs`

6. Run the test suite:
   ```bash
   pytest tests/test_api.py -v
   ```

---

### Step 3: Frontend Setup (Next.js)

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `.env.local` has:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. API Documentation

### `GET /health`
Returns backend health status, API version, and Groq configuration status.
- **Response `200 OK`**:
  ```json
  {
    "status": "ok",
    "service": "Resume Customizer API",
    "version": "1.0.0",
    "llm_configured": true,
    "llm_model": "llama-3.3-70b-versatile"
  }
  ```

### `POST /api/customize-resume`
Accepts a resume file and job description, parses the file, invokes Groq LLM, and returns the tailored resume with match metrics.
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: Resume file (`.pdf` or `.docx`, max 5 MB) [Required]
  - `job_description`: Target job description text (min 50 chars) [Required]
  - `target_sections`: Optional JSON list, e.g. `["Summary", "Skills", "Experience"]`
  - `generate_cover_letter`: Optional boolean (`true`/`false`)
- **Response `200 OK`**: JSON matching `CustomizedResume` schema.

### `POST /api/generate-cover-letter`
Generates a targeted cover letter based on candidate's verified resume and JD.
- **Content-Type**: `application/json`
- **Body**: `{ "job_description": "...", "resume_data": {...}, "company_name": "...", "role_title": "..." }`
- **Response `200 OK`**: `{ "cover_letter": "..." }`

### `POST /api/download/pdf`
Generates and streams a styled ReportLab PDF resume.
- **Response**: Binary stream with `Content-Type: application/pdf`.

### `POST /api/download/docx`
Generates and streams a formatted Word document resume.
- **Response**: Binary stream with `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

### `POST /api/download/txt`
Generates and streams a clean plain-text resume.
- **Response**: `Content-Type: text/plain; charset=utf-8`.

---

## 6. Deployment Instructions

### A. Pushing to GitHub
1. Initialize a git repository at the root of `resume-customizer/`:
   ```bash
   cd resume-customizer
   git init
   git add .
   git commit -m "feat: complete production-ready resume customizer web app"
   ```
2. Create a new repository on GitHub (e.g., `resume-customizer`) and push:
   ```bash
   git remote add origin https://github.com/<your-username>/resume-customizer.git
   git branch -M main
   git push -u origin main
   ```

---

### B. Deploying Backend to Render
1. Sign up / Log in to [Render](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `resume-customizer-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `GROQ_API_KEY`: `gsk_your_real_groq_api_key`
   - `GROQ_MODEL`: `llama-3.3-70b-versatile`
   - `FRONTEND_URL`: `https://your-frontend-app.vercel.app`
6. Click **Deploy Web Service**.
7. Copy your public Render URL (e.g. `https://resume-customizer-api.onrender.com`). Verify it by visiting `https://resume-customizer-api.onrender.com/health`.

---

### C. Deploying Frontend to Vercel
1. Sign up / Log in to [Vercel](https://vercel.com).
2. Click **Add New** → **Project** and import your GitHub repository.
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" and choose `frontend`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://resume-customizer-api.onrender.com`)
5. Click **Deploy**.
6. Once deployed, update the `FRONTEND_URL` environment variable in Render with your live Vercel domain to ensure strict CORS compliance.

---

## 7. Known Limitations & Trade-offs

1. **Scanned Documents**:
   - The parser utilizes PyMuPDF for native vector and text PDF extraction. Scanned PDFs (pure images without an OCR text layer) will be gracefully detected and prompt the candidate to upload a text-based document.
2. **LLM Token Limits**:
   - Resumes exceeding 15 pages may encounter token limit boundaries. The parser trims redundant whitespaces and limits prompt size to optimize throughput.
3. **Groq Free Tier Rate Limits**:
   - Free Groq tier accounts have requests-per-minute (RPM) limits. The backend handles HTTP 429 rate limits gracefully and returns informative user messages.

---

## 8. License
MIT License. Built for the Full Stack Developer Technical Assignment.
