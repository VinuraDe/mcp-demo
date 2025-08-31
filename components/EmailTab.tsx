type EmailTabProps = {
  emailForm: { to: string; subject: string; body: string };
  setEmailForm: React.Dispatch<
    React.SetStateAction<{ to: string; subject: string; body: string }>
  >;
  handleSendEmail: (e: React.FormEvent) => void;
  emailStatus: string;
};

export default function EmailTab({
  emailForm,
  setEmailForm,
  handleSendEmail,
  emailStatus,
}: EmailTabProps) {
  return (
    <section className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Send an Email
      </h2>
      <form onSubmit={handleSendEmail} className="space-y-3">
        <input
          placeholder="To"
          value={emailForm.to}
          onChange={(e) => setEmailForm((s) => ({ ...s, to: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          placeholder="Subject"
          value={emailForm.subject}
          onChange={(e) =>
            setEmailForm((s) => ({ ...s, subject: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          placeholder="Body"
          value={emailForm.body}
          onChange={(e) =>
            setEmailForm((s) => ({ ...s, body: e.target.value }))
          }
          rows={6}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Send Email
        </button>
      </form>
      {emailStatus && (
        <p className="mt-3 text-sm text-gray-700">{emailStatus}</p>
      )}
    </section>
  );
}
