// resumeHandler.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getStoredResume } from "./parseResume";
import { ParsedResume } from "@/lib/resumeParser";

export interface ExperienceItem {
  role: string;
  company: string;
  dates: string;
  details: string[];
}

function answerFromResume(
  question: string,
  parsed: ParsedResume | null
): string {
  if (!parsed)
    return "I don't have a parsed resume yet. POST your resume text to /api/parseResume.";

  const q = (question || "").toLowerCase();
  const exp: ExperienceItem[] = parsed.experiences || [];

  if (
    /last|most recent|current|latest/.test(q) &&
    /role|position|job/.test(q)
  ) {
    const last = exp[0] || exp[exp.length - 1];
    if (!last) return "No experience entries found in your resume.";
    return `Your most recent role was **${last.role || "Unknown role"}** at **${
      last.company || "Unknown company"
    }** ${last.dates ? `(${last.dates})` : ""}.`;
  }

  const atMatch = q.match(/role.*at\s+([a-z0-9 \.-]+)/i);
  if (atMatch) {
    const company = atMatch[1].trim();
    const found = exp.find(
      (e) => e.company && e.company.toLowerCase().includes(company)
    );
    if (found)
      return `At ${found.company} you were **${found.role || "in a role"}** ${
        found.dates ? `(${found.dates})` : ""
      }.`;
    return `I couldn't find a company that matches "${company}" in your parsed resume.`;
  }

  if (/skill|technolog|stack|tools/.test(q)) {
    if (parsed.skills && parsed.skills.length)
      return `Your resume lists these skills: ${parsed.skills.join(", ")}.`;
    return "No explicit skills section found in your resume.";
  }

  if (/when|date|year/.test(q)) {
    const last = exp[0] || exp[exp.length - 1];
    if (last && last.dates)
      return `Your most recent position (${last.role}) is dated: ${last.dates}.`;
    return "No dates could be found for your experiences.";
  }

  for (const e of exp) {
    if (
      q.includes((e.role || "").toLowerCase()) ||
      q.includes((e.company || "").toLowerCase())
    ) {
      return `Found: **${e.role || "role"}** at **${e.company || "company"}** ${
        e.dates ? `(${e.dates})` : ""
      }. Details: ${e.details.join(" ")}.`;
    }
  }

  if (exp.length) {
    return `I found ${
      exp.length
    } experience items. Your most recent role appears to be **${
      exp[0]?.role || exp[exp.length - 1]?.role || "unknown"
    }**.`;
  }

  return "I couldn't answer that from your resume. Try asking something like: 'What role did I have at my last position?'";
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body as { question?: string };
  if (!question) return res.status(400).json({ error: "`question` required" });

  const parsed: ParsedResume | null = getStoredResume();
  try {
    const answer = answerFromResume(question, parsed);
    return res.json({ answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to answer" });
  }
}
