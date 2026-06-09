"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { interviewDomains } from "@/constants";

const levels = ["Junior", "Mid-Level", "Senior", "Lead"];

const InterviewForm = ({ userName, userId }: { userName: string; userId?: string }) => {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [level, setLevel] = useState("Junior");
  const [amount, setAmount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const domain = interviewDomains.find((d) => d.id === selectedDomain);

  const handleGenerate = async () => {
    if (!domain || !userId) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: domain.defaultType,
          role: domain.defaultRole,
          level: level,
          techstack: domain.defaultTechstack,
          amount: String(amount),
          userid: userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to generate interview. Please try again.");
      }
    } catch (error) {
      console.error("Error generating interview:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Domain Selection Grid */}
      <div>
        <h3 className="mb-4">Choose Your Interview Domain</h3>
        <p className="mb-6 text-light-100">Select the role you want to practice for</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviewDomains.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`domain-card ${
                selectedDomain === d.id ? "domain-card-selected" : ""
              }`}
            >
              <span className="text-3xl mb-2">{d.icon}</span>
              <h4 className="text-lg font-semibold text-white">{d.title}</h4>
              <p className="text-sm text-light-400 mt-1">{d.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Panel - shows after domain selection */}
      {selectedDomain && domain && (
        <div className="card-border w-full">
          <div className="dark-gradient rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{domain.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-white">{domain.title} Interview</h3>
                <p className="text-sm text-light-400">{domain.description}</p>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="text-light-100 text-sm font-medium mb-2 block">Experience Level</label>
              <div className="flex flex-wrap gap-3">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`level-chip ${
                      level === l ? "level-chip-selected" : ""
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="text-light-100 text-sm font-medium mb-2 block">
                Number of Questions: {amount}
              </label>
              <input
                type="range"
                min="3"
                max="15"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-primary-200 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-light-400 mt-1">
                <span>3</span>
                <span>15</span>
              </div>
            </div>

            {/* Skills Preview */}
            <div>
              <label className="text-light-100 text-sm font-medium mb-2 block">Skills Tested</label>
              <div className="flex flex-wrap gap-2">
                {domain.defaultTechstack.split(",").map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-dark-200 text-light-100 text-sm border border-light-800/30"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary !w-full !py-3 !text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-dark-100 border-t-transparent rounded-full animate-spin" />
                  Generating Interview...
                </span>
              ) : (
                `Generate ${domain.title} Interview`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewForm;
