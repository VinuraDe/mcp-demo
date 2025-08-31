// resumeParser.ts

export interface Experience {
  role: string;
  company: string;
  dates: string;
  details: string[];
}

export interface ParsedResume {
  raw: string;
  experiences: Experience[];
  skills: string[];
  education: string[];
}

export function parseExperienceBlock(text: string): Experience[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const expStartIndex = lines.findIndex((l) => /experience/i.test(l));
  const relevant = expStartIndex >= 0 ? lines.slice(expStartIndex + 1) : lines;

  const experiences: Experience[] = [];
  let current: Experience | null = null;

  for (const line of relevant) {
    if (/\b(\d{4})\b/.test(line) && /[-–—]/.test(line)) {
      if (current) experiences.push(current);
      const parts = line.split(/[-–—]/).map((p) => p.trim());
      const role = parts[0] || "";
      const company = parts[1] || "";
      const dates = parts.slice(2).join(" - ") || "";
      current = { role, company, dates, details: [] };
      continue;
    }

    if (/\bat\b/i.test(line) && /[A-Z][a-z]+/.test(line)) {
      if (current) experiences.push(current);
      const m = line.match(/^(.*?)\s+at\s+(.*?)\s*(?:[(-]?(.*?)[)-]?$)/i);
      if (m) {
        current = {
          role: m[1].trim(),
          company: m[2].trim(),
          dates: m[3] ? m[3].trim() : "",
          details: [],
        };
        continue;
      }
    }

    if (current) current.details.push(line);
  }

  if (current) experiences.push(current);

  if (experiences.length === 0) {
    for (const line of lines) {
      if (/\b(at|@|\-|—)\b/i.test(line) && /[A-Z][a-z]+/.test(line)) {
        experiences.push({ role: line, company: "", dates: "", details: [] });
      }
    }
  }

  return experiences;
}

export function parseResume(text: string): ParsedResume {
  const normalized = (text || "").replace(/\t/g, " ");

  const sections: Record<string, string> = {};
  const parts = normalized
    .split(/\n{2,}/g)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const p of parts) {
    const headerMatch = p.match(/^([A-Za-z ]{2,60}):?\n/);
    if (headerMatch) {
      const header = headerMatch[1].trim().toLowerCase();
      sections[header] = p.replace(headerMatch[0], "").trim();
    }
  }

  const experiences = parseExperienceBlock(normalized);

  const skillsMatch = normalized.match(/Skills[:\n]([\s\S]{0,300})/i);
  const educationMatch = normalized.match(/Education[:\n]([\s\S]{0,300})/i);

  const skills = skillsMatch
    ? skillsMatch[1]
        .split(/[\n,;•]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const education = educationMatch
    ? educationMatch[1]
        .split(/[\n;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return {
    raw: text,
    experiences,
    skills,
    education,
  };
}
