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

### Backend
1. `cd /home/runner/work/Cook-YourCode/Cook-YourCode/backend`
2. Copy environment values:
   - `MONGODB_URI` (default: `mongodb://127.0.0.1:27017/cook-your-code`)
   - `PORT` (default: `5000`)
   - `JUDGE0_BASE_URL` (default: `https://ce.judge0.com`)
   - `JUDGE0_API_KEY` + `JUDGE0_API_HOST` (optional, only needed for hosted RapidAPI endpoints)
3. `npm install`
4. `npm run dev`

### Frontend
1. `cd /home/runner/work/Cook-YourCode/Cook-YourCode/frontend`
2. Set `VITE_API_BASE_URL` (default: `http://localhost:5000/api`)
3. `npm install`
4. `npm run dev`
