import { useState } from "react";

import ResumeTab from "@/components/ResumeTab";
import EmailTab from "@/components/EmailTab";
import ChatTab from "@/components/ChatTab";
import { useAppLogic } from "@/lib/useAppLogic";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"resume" | "chat" | "email">(
    "resume"
  );
  const {
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
  } = useAppLogic();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Model Context Protocol (MCP) — Demo
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "resume"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "chat"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-600 hover:text-green-500"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "email"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-purple-500"
            }`}
            onClick={() => setActiveTab("email")}
          >
            Email
          </button>
        </div>

        {activeTab === "resume" && (
          <ResumeTab
            resumeText={resumeText}
            setResumeText={setResumeText}
            handleParse={handleParse}
          />
        )}
        {activeTab === "chat" && (
          <ChatTab
            question={question}
            setQuestion={setQuestion}
            chatReply={chatReply}
            handleChat={handleChat}
          />
        )}
        {activeTab === "email" && (
          <EmailTab
            emailForm={emailForm}
            setEmailForm={setEmailForm}
            handleSendEmail={handleSendEmail}
            emailStatus={emailStatus}
          />
        )}
      </div>
    </main>
  );
}
