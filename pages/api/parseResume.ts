import type { NextApiRequest, NextApiResponse } from "next";
import { parseResume, ParsedResume } from "../../lib/resumeParser";

const resumeStore: { parsed: ParsedResume | null } = { parsed: null };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body as { text?: string };
  if (!text)
    return res
      .status(400)
      .json({ error: "`text` is required in the request body" });

  try {
    const parsed: ParsedResume = parseResume(text);
    resumeStore.parsed = parsed;
    return res.json({ ok: true, parsed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to parse resume" });
  }
}

export function getStoredResume(): ParsedResume | null {
  return resumeStore.parsed;
}
