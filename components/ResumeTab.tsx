type ResumeTabProps = {
  resumeText: string;
  setResumeText: (t: string) => void;
  handleParse: (e: React.FormEvent) => void;
};

export default function ResumeTab({
  resumeText,
  setResumeText,
  handleParse,
}: ResumeTabProps) {
  return (
    <section className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Paste your Resume
      </h2>
      <form onSubmit={handleParse} className="space-y-3">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={8}
          placeholder="Paste your resume text here..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Parse Resume
        </button>
      </form>
    </section>
  );
}
