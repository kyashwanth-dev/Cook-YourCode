# Cook-YourCode

LeetCode-style coding platform with a React frontend and Express backend.

## Tech Stack
- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB
- Judge0 API

## Features
- Problem list with difficulty tags
- Problem detail page with statement, constraints, and sample I/O
- Monaco editor with C++, Java, Python, JavaScript selectors
- Run sample test cases via Judge0
- Submit against hidden test cases with verdicts (Accepted / Wrong Answer / Runtime Error / Compilation Error)
- Admin panel to add/edit problems and manage sample + hidden test cases

## Project Structure
- `/frontend` - React app
- `/backend` - Express API and MongoDB models

## Local Setup

Follow this process to run both backend and frontend locally.
For a dedicated setup guide (including MongoDB and Judge0 details), see [`SETUP.md`](./SETUP.md).

### 1) Prerequisites
- Node.js (LTS) and npm
- MongoDB running locally (or a hosted MongoDB connection string)
- Internet access to Judge0 API (`https://ce.judge0.com`) or your own Judge0-compatible endpoint

### 2) Clone and open the project
```bash
git clone https://github.com/kyashwanth-dev/Cook-YourCode.git
cd Cook-YourCode
```

### 3) Backend setup (`/backend`)
1. Move to backend:
   ```bash
   cd /home/runner/work/Cook-YourCode/Cook-YourCode/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/backend` and add the values below:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/cook-your-code
   PORT=5000
   JUDGE0_BASE_URL=https://ce.judge0.com
   # Optional (only for RapidAPI-hosted Judge0)
   # JUDGE0_API_KEY=your_key
   # JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
   ```
4. Start backend in development mode:
   ```bash
   npm run dev
   ```
5. Verify backend is running:
   - Open `http://localhost:5000/health`
   - Expected response: `{"status":"ok"}`

### 4) Frontend setup (`/frontend`)
1. Open a new terminal and move to frontend:
   ```bash
   cd /home/runner/work/Cook-YourCode/Cook-YourCode/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/frontend`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start frontend:
   ```bash
   npm run dev
   ```
5. Open the URL shown in terminal (usually `http://localhost:5173`).

### 5) Build and lint checks

#### Frontend
From `/frontend`:
```bash
npm run lint
npm run build
```

#### Backend
From `/backend`:
```bash
npm start
```

### 6) Common troubleshooting
- **Mongo connection failed**: ensure MongoDB is running and `MONGODB_URI` is correct.
- **Judge0 requests failing**: verify `JUDGE0_BASE_URL` and optional RapidAPI credentials.
- **CORS/API issues in UI**: confirm frontend `VITE_API_BASE_URL` points to the running backend (`http://localhost:5000/api` by default).
- **Port conflict**: change `PORT` in backend `.env` and update `VITE_API_BASE_URL` accordingly.
