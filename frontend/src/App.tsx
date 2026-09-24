import React, { useState, useEffect } from "react";

interface EvaluationData {
  id?: number;
  candidate_name: string;
  target_role: string;
  resume_text: string;
  company_name: string;
  job_title: string;
  job_description: string;
  fit_category: string;
  matching_qualifications: string[];
  missing_requirements: string[];
  explanation: string;
  outreach_email: string;
}

interface HistoryItem {
  id: number;
  candidate_name: string;
  job_title: string;
  fit_category: string;
}

export default function App() {
  const [candidateName, setCandidateName] = useState("Riya Shah");
  const [targetRole, setTargetRole] = useState("Customer Success Manager");
  const [resumeText, setResumeText] = useState(
    "Riya Shah has five years of B2B SaaS customer success experience. She has managed 25 client accounts, used HubSpot and improved customer retention by 12%."
  );
  const [companyName, setCompanyName] = useState("CloudScale Inc.");
  const [jobTitle, setJobTitle] = useState("Enterprise Customer Success Manager");
  const [jobDescription, setJobDescription] = useState(
    "Enterprise Customer Success Manager requiring five years of experience, Salesforce, enterprise renewals and experience supporting US customers."
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationData | null>(null);
  const [editableEmail, setEditableEmail] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Could not load history:", err);
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_name: candidateName,
          target_role: targetRole,
          resume_text: resumeText,
          company_name: companyName,
          job_title: jobTitle,
          job_description: jobDescription,
        }),
      });

      if (!res.ok) throw new Error("Evaluation request failed");
      const data: EvaluationData = await res.json();
      setResult(data);
      setEditableEmail(data.outreach_email);
      fetchHistory();
    } catch (err) {
      alert("Error generating analysis. Ensure backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const loadPastRecord = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/history/${id}`);
      if (res.ok) {
        const data: EvaluationData = await res.json();
        setCandidateName(data.candidate_name);
        setTargetRole(data.target_role);
        setResumeText(data.resume_text);
        setCompanyName(data.company_name);
        setJobTitle(data.job_title);
        setJobDescription(data.job_description);
        setResult(data);
        setEditableEmail(data.outreach_email);
      }
    } catch (err) {
      console.error("Failed to load historical record:", err);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(editableEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "Strong Fit":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Moderate Fit":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Potential Fit":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-rose-100 text-rose-800 border-rose-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">MyPM AI Recruiter Assistant</h1>
          <p className="text-xs text-slate-500">Evidence-grounded candidate evaluation & personalized outreach</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-12 gap-6 flex-1">
        {/* Left Column: Input Form & Database History */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Input Information</h2>
            <form onSubmit={handleEvaluate} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Candidate Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded p-2 text-sm mt-1 focus:ring-1 focus:ring-slate-900 outline-none"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Target Role</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded p-2 text-sm mt-1 focus:ring-1 focus:ring-slate-900 outline-none"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Resume Text</label>
                <textarea
                  rows={4}
                  required
                  className="w-full border rounded p-2 text-sm mt-1 focus:ring-1 focus:ring-slate-900 outline-none"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Company Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded p-2 text-sm mt-1 focus:ring-1 focus:ring-slate-900 outline-none"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Job Title</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded p-2 text-sm mt-1 focus:ring-1 focus:ring-slate-900 outline-none"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Job Description</label>
                <textarea
                  rows={4}
                  required
                  className="w-full border rounded p-2 text-sm mt-1 focus:ring-1 focus:ring-slate-900 outline-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded text-sm transition disabled:opacity-50 mt-2"
              >
                {loading ? "Analyzing Candidate Fit..." : "Run AI Evaluation"}
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Saved Analyses (History)</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadPastRecord(item.id)}
                  className="p-2 border rounded text-xs flex justify-between items-center cursor-pointer hover:bg-slate-50 transition"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{item.candidate_name}</span>
                    <span className="text-slate-400"> &bull; {item.job_title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${getBadgeColor(item.fit_category)}`}>
                    {item.fit_category}
                  </span>
                </div>
              ))}
              {history.length === 0 && <p className="text-xs text-slate-400">No previous analyses saved yet.</p>}
            </div>
          </div>
        </section>

        {/* Right Column: AI Output & Outreach */}
        <section className="col-span-12 lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide border-b pb-3 mb-4">
            Evaluation Report
          </h2>

          {!result && !loading && (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              Fill in candidate and job details, then click "Run AI Evaluation".
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-sm text-slate-500 space-y-2">
              <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <p>Evaluating match without hallucinating requirements...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm font-semibold text-slate-700">Fit Category:</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeColor(result.fit_category)}`}>
                  {result.fit_category}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Assessment Explanation</h4>
                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-200 bg-emerald-50/50 p-3.5 rounded-lg">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase mb-2">Matching Qualifications</h4>
                  <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
                    {result.matching_qualifications.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="border border-amber-200 bg-amber-50/50 p-3.5 rounded-lg">
                  <h4 className="text-xs font-bold text-amber-800 uppercase mb-2">Missing Requirements</h4>
                  <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
                    {result.missing_requirements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">
                    Recruiter Outreach Email (Editable)
                  </label>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="text-xs bg-slate-100 hover:bg-slate-200 border text-slate-700 px-3 py-1 rounded font-medium transition"
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>
                <textarea
                  rows={5}
                  className="w-full border rounded p-3 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none leading-relaxed"
                  value={editableEmail}
                  onChange={(e) => setEditableEmail(e.target.value)}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}