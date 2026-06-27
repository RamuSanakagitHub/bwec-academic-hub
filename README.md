# BWEC Academic Hub

A full-stack MERN application for **Bharat Welfare Engineering College (BWEC)** — B.Tech academic platform for ECE, CSE, and AIML branches (1st Year to Final Year).

## Features

- **Syllabus Dashboard** — All subjects with codes for ECE / CSE / AIML, Year 1–4
- **Unit-wise Syllabus** — 5 units per subject with full topic explanations
- **Diagrams** — Inline SVG waveforms, flowcharts, block diagrams, and graphs
- **Quizzes & Mock Tests** — Diagnostic MCQs with explanations and XP rewards
- **Flashcards** — Flip-animation cards (click to reveal answer) with difficulty filters
- **Attendance Tracker** — Percentage, strike count, and warnings per subject

## Tech Stack

- **MongoDB** — Database for subjects, units, quizzes, flashcards, attendance
- **Express.js** — REST API backend
- **React + Vite** — Frontend SPA with React Router
- **Node.js** — Backend runtime

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local: `mongodb://localhost:27017`)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI if needed
npm run seed        # Load all subjects, units, quizzes, flashcards
npm run dev         # Start backend on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # Start frontend on http://localhost:5173
```

### 3. Open the App

Visit `http://localhost:5173` → Register as a student → Explore!

## Subjects Covered

| Year | ECE | CSE | AIML |
|------|-----|-----|------|
| 1st  | Common (Maths, Physics, Chemistry, C, Drawing, EE) | Same | Same |
| 2nd  | EDC, Network Analysis, Signals, Digital Electronics | Data Structures, Java OOP, OS, CO, Discrete Maths | Intro AI, Python, Statistics, Linear Algebra |
| 3rd  | Analog Comm, DSP, VLSI, Microprocessors, Control Systems, Antennas | DBMS, Networks, Algorithms, SE, Compiler, TOC | ML, Deep Learning, Computer Vision, NLP, RL |
| 4th  | Digital Comm, Wireless, Image Processing, Embedded, Optical Fiber | Cloud, AI, Cybersecurity, Mobile Dev | Adv Deep Learning, MLOps, Gen AI, AI Ethics |

## Default Test Account

Register with any email. Example:
- Email: `student@bwec.ac.in`
- Branch: ECE, Year: 3
- Password: `password123`
