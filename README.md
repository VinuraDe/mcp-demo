# MCP Next.js Demo


A minimal Model Context Protocol server implemented inside a Next.js app. Features:


- **Resume parsing**: simple resume parser endpoint (`/api/parseResume`) that accepts plain text and extracts experiences.
- **Chat endpoint**: `/api/chat` — ask questions about the parsed resume (e.g. "What role did I have at my last position?")
- **Email endpoint**: `/api/sendEmail` — send emails via SMTP (nodemailer) or SendGrid.
- **Frontend**: `pages/index.js` — a tiny Next.js page to interact with the MCP server (upload/enter resume, chat, send email).


## Quick start


1. Copy the files into a directory.
2. `npm install`
3. Create `.env` based on `.env.example` and fill SMTP or SendGrid settings.
4. Run: `npm run dev`
5. Open `http://localhost:3000`


## API endpoints


- `POST /api/parseResume` — body `{ text: string }` — parse and store resume in server memory session.
- `POST /api/chat` — body `{ question: string }` — returns `{ answer: string }` answering questions about the stored resume.
- `POST /api/sendEmail` — body `{ to, subject, body }` — sends an email via SMTP or SendGrid.


## Notes


- The resume parser is intentionally lightweight (text-based heuristics). For production, replace with a robust parser and optionally an LLM-backed QA layer.
- The server stores the parsed resume in memory — suitable for demo. For scaling/persistence, store in a DB.


## Deployment


You can deploy to Vercel, Netlify, or any Node hosting. If you deploy to Vercel, add environment variables in the project settings.