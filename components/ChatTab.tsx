type ChatTabProps = {
  question: string;
  setQuestion: (q: string) => void;
  chatReply: string;
  handleChat: (e: React.FormEvent) => void;
};

export default function ChatTab({
  question,
  setQuestion,
  chatReply,
  handleChat,
}: ChatTabProps) {
  return (
    <section className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Chat about your CV
      </h2>
      <form onSubmit={handleChat} className="space-y-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your resume..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Ask
        </button>
      </form>
      <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <strong className="block text-gray-700 mb-2">Answer:</strong>
        <p className="text-gray-800 whitespace-pre-line">{chatReply}</p>
      </div>
    </section>
  );
}
