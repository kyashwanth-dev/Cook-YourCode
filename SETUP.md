# Cook-YourCode Setup Guide

This guide explains how to run the frontend and backend locally, with extra focus on MongoDB and Judge0 configuration.

## 1) Prerequisites

- Node.js (LTS) and npm
- MongoDB (local install or MongoDB Atlas)
- Internet access to a Judge0 endpoint

## 2) Clone the repository

```bash
git clone https://github.com/kyashwanth-dev/Cook-YourCode.git
cd Cook-YourCode
```

## 3) Backend setup (`/backend`)

1. Go to backend folder:

   ```bash
   cd /home/runner/work/Cook-YourCode/Cook-YourCode/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `/home/runner/work/Cook-YourCode/Cook-YourCode/backend/.env` with:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/cook-your-code

   JUDGE0_BASE_URL=https://ce.judge0.com
   # Optional for RapidAPI-hosted Judge0:
   # JUDGE0_API_KEY=your_key
   # JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
   ```

4. Start backend:

   ```bash
   npm run dev
   ```

5. Verify backend health:

   - Open `http://localhost:5000/health`
   - Expected response:

     ```json
     {"status":"ok"}
     ```

## 4) MongoDB setup details

You can use either local MongoDB or MongoDB Atlas.

### Option A: Local MongoDB

1. Install MongoDB Community Server.
2. Start MongoDB service.
3. Keep `MONGODB_URI` as:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/cook-your-code
   ```

### Option B: MongoDB Atlas

1. Create a free cluster in MongoDB Atlas.
2. Create a database user and allow your IP in Network Access.
3. Copy your connection string and set it in backend `.env`, for example:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/cook-your-code?retryWrites=true&w=majority
   ```

4. Restart backend after updating `.env`.

## 5) Judge0 setup details

Backend uses these environment variables:

- `JUDGE0_BASE_URL` (required): Judge0 API base URL
- `JUDGE0_API_KEY` (optional): needed for RapidAPI-based Judge0
- `JUDGE0_API_HOST` (optional): needed for RapidAPI-based Judge0

### Public Judge0 CE endpoint

Use:

```env
JUDGE0_BASE_URL=https://ce.judge0.com
```

### RapidAPI Judge0 endpoint

Use:

```env
JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

If code execution fails, verify these values and restart backend.

## 6) Frontend setup (`/frontend`)

1. Open a new terminal and go to frontend folder:

   ```bash
   cd /home/runner/work/Cook-YourCode/Cook-YourCode/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `/home/runner/work/Cook-YourCode/Cook-YourCode/frontend/.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start frontend:

   ```bash
   npm run dev
   ```

5. Open the URL shown in terminal (usually `http://localhost:5173`).

## 7) Optional checks

### Frontend

```bash
cd /home/runner/work/Cook-YourCode/Cook-YourCode/frontend
npm run lint
npm run build
```

### Backend

```bash
cd /home/runner/work/Cook-YourCode/Cook-YourCode/backend
npm start
```

## 8) Troubleshooting

- **Backend not starting**: check `MONGODB_URI` and confirm MongoDB is reachable.
- **Frontend cannot call API**: verify `VITE_API_BASE_URL` points to backend (`http://localhost:5000/api` by default).
- **Judge0 errors**: verify Judge0 URL and RapidAPI headers (if used).
- **Port conflict**: change backend `PORT` and update frontend `VITE_API_BASE_URL` to match.
