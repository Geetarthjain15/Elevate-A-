<div align="center">
  <h1>🚀 Elevate AI: Next-Gen Interview Simulator</h1>
  <p><strong>Master your interviews with conversational AI tailored to your profession.</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  </div>

  <br />
  <h3>🌐 <a href="https://elevate-ai-geetarth.vercel.app">Live Demo</a></h3>
</div>

<br />

## 🌟 The Vision

Landing a dream job is tough, and practicing for interviews often involves reading static lists of questions or awkward mirror talks. **Elevate AI** bridges the gap by providing a **hyper-realistic, voice-driven mock interview experience**.

Instead of typing answers, you talk to an intelligent agent that understands the nuance of your profession—whether you are a seasoned Backend Engineer, a strategic Product Manager, or an entry-level Data Analyst.

## ✨ Core Capabilities

- 🎙️ **Conversational Voice AI**: Powered by Vapi and Google Gemini, the interviewer speaks naturally, pauses, and responds dynamically to your answers, simulating the pressure and rhythm of a real interview.
- 🎯 **15+ Specialized Domains**: Tailored question sets and contexts for:
  - Software Engineering (SDE I & II, Frontend, Backend, Full Stack, Mobile)
  - Data (Analyst, Scientist)
  - Business & Strategy (Product Manager, Marketing, Sales, HR)
  - Quality Assurance & DevOps
- 📊 **Granular Performance Analytics**: After every session, the AI evaluates your performance on a 1-100 scale, giving actionable feedback on:
  - Technical Accuracy & Problem Solving
  - Communication & Articulation
  - Confidence & Cultural Fit
- 🔐 **Secure & Personalized Dashboard**: Built with Firebase Authentication to keep your interview history, transcripts, and growth metrics private and accessible.

## 🏗️ Architecture

Elevate AI is built with a modern, serverless architecture to ensure low latency and high scalability:

- **Frontend**: Next.js (App Router) heavily utilizing React Server Components for performance. Styled with Tailwind CSS and Shadcn UI for a polished, accessible interface.
- **Backend**: Next.js API Routes handle secure communication with AI models and database operations.
- **AI Orchestration**: Google Gemini generates context-aware, role-specific questions and evaluates transcripts. Vapi manages the real-time WebRTC voice pipeline.
- **Database**: Firebase Firestore handles real-time data syncing for user profiles, interview transcripts, and historical feedback.

## 🚀 Getting Started

Want to run Elevate AI locally? Follow these steps:

### Prerequisites
- Node.js 18.x or higher
- A Firebase Project
- API keys for Google Gemini and Vapi

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Geetarthjain15/Elevate-A-.git
   cd Elevate-A-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   # AI & Voice
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

   # Firebase Setup
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to start your first interview!

---
*Designed and engineered with a focus on intuitive user experience and cutting-edge AI integration.*
