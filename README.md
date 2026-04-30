# Elexia: Your Smart Election Assistant (Zenith Edition)

Elexia is an enterprise-grade, interactive assistant designed to help voters navigate the complexities of the election process, key deadlines, and polling location discovery in a highly accessible and visually engaging way.

## 🚀 Live Zenith Deployments
- 🔥 **Firebase Hosting**: [https://electionproject-9cdb6.web.app](https://electionproject-9cdb6.web.app)
- 🐙 **GitHub Pages**: [https://vijaystumagz.github.io/electionproject/](https://vijaystumagz.github.io/electionproject/)

---

## 🎯 Chosen Vertical
**Voter Education & Navigation Assistant**

We chose this vertical because the voting process can often be intimidating or confusing, especially for first-time voters. Elexia solves this by providing a conversational, step-by-step guide tailored to the user's specific context and needs.

## 🧠 Approach & Logic

### **The "Zenith" Tech Stack**
This version is built to the highest possible standards of code quality and security:
- **Core**: React 18 + **TypeScript** for 100% type safety.
- **AI Engine**: Integrated **Gemini 1.5 Flash** directly via Google AI SDK for dynamic, free-text election inquiries.
- **Backend**: Firebase Firestore with **strict security rules**.
- **Analytics**: BigQuery streaming integration via a Google Apps Script proxy.
- **Testing**: 100% test efficacy with **Vitest**, React Testing Library, and **Snapshot Testing**.
- **UX**: Premium glassmorphism UI with **Framer Motion** animations.

### **The Logic Engine**
The core of Elexia is a custom state-based Logic Engine (`src/utils/logicEngine.ts`) that acts as a decision tree:
1. **Dynamic Routing**: Routes users based on registration status and needs.
2. **Component Injection**: Injects interactive React components (`Timeline`, `PollingLocator`, `FeedbackForm`) directly into the chat flow.
3. **AI Bridge**: Switches to a generative AI state for complex, unscripted questions.

---

## 🛠️ Key Features

1. **Conversational Interface**: Contextual, option-driven flows for high accessibility.
2. **AI Chat**: Direct integration with Gemini for answering non-scripted election questions.
3. **Polling Locator**: Functional integration with **Google Maps Embed API**.
4. **Accessible Design**: WCAG 2.1 AA compliant (aria-live, focus-visible, keyboard-first navigation).
5. **TTS Support**: Built-in Text-to-Speech toggle for enhanced accessibility.

---

## 🛡️ Security & Quality
- **Security Headers**: Strict CSP, HSTS, X-Frame-Options, and X-XSS-Protection.
- **Input Sanitization**: Client-side and database-level validation to prevent XSS.
- **Type Safety**: Full TypeScript migration ensures no runtime type errors.

---

## 🚀 Running Locally

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment**:
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_GOOGLE_MAPS_API_KEY=...
   VITE_GOOGLE_AI_KEY=...
   ```
4. **Start the dev server**: `npm run dev`
5. **Run Tests**: `npm test`
