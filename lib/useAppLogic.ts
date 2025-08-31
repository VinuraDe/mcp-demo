import { useState } from "react";

export function useAppLogic() {
  const [resumeText, setResumeText] = useState("");
  const [question, setQuestion] = useState(
    "What role did I have at my last position?"
  );
  const [chatReply, setChatReply] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  async function handleParse(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/parseResume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: resumeText }),
    });
    const data = await r.json();
    if (data.ok) {
      alert("Resume parsed and stored. You can now ask questions.");
    } else {
      alert("Parse failed: " + JSON.stringify(data));
    }
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    setChatReply("...thinking");
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await r.json();
    if (data.answer) setChatReply(data.answer);
    else setChatReply("Error: " + JSON.stringify(data));
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus("sending...");
    const r = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailForm),
    });
    const data = await r.json();
    if (data.ok) setEmailStatus("✅ Sent via " + data.provider);
    else setEmailStatus("❌ Error: " + JSON.stringify(data));
  }

  return {
    resumeText,
    setResumeText,
    question,
    setQuestion,
    chatReply,
    emailStatus,
    emailForm,
    setEmailForm,
    handleParse,
    handleChat,
    handleSendEmail,
  };
}
