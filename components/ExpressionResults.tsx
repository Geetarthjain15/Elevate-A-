"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Radar, Doughnut } from "react-chartjs-2";
import { Activity, ShieldAlert, ShieldCheck, Eye, Brain, Zap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
);

interface ExpressionResultsProps {
  results: ExpressionAnalysisResult;
}

function ScoreRing({
  score,
  label,
  color,
  icon: Icon,
  description,
}: {
  score: number;
  label: string;
  color: string;
  icon: React.ElementType;
  description: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * Math.min(score, 100)) / 100;

  return (
    <div className="card card-border flex flex-col items-center justify-center p-5 text-center gap-3">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Track */}
          <circle cx="64" cy="64" r={radius} fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out", filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-3xl font-bold text-light-100">{score}</span>
          <span className="text-xs text-light-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Icon size={14} style={{ color }} />
          <p className="text-sm font-semibold text-light-100">{label}</p>
        </div>
        <p className="text-xs text-light-400">{description}</p>
      </div>
    </div>
  );
}

function IntegrityRow({
  label,
  value,
  pass,
  threshold,
}: {
  label: string;
  value: number;
  pass: boolean;
  threshold: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {pass ? (
        <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
      ) : (
        <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-light-300">{label}</span>
          <span className={`text-xs font-semibold ${pass ? "text-green-400" : "text-red-400"}`}>
            {value}% <span className="text-light-400 font-normal">({threshold})</span>
          </span>
        </div>
        <div className="w-full h-1.5 bg-dark-300 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(value, 100)}%`,
              backgroundColor: pass ? "#4ade80" : "#f87171",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ExpressionResults({ results }: ExpressionResultsProps) {
  if (!results) return null;

  const {
    confidenceScore,
    nervousnessIndex,
    engagementScore,
    composureRating,
    eyeContactScore,
    insights,
    facePresentPercentage,
    multipleFacePercentage,
    deviceDetectedPercentage,
    lookingAwayPercentage,
  } = results;

  // ── Radar chart: Performance metrics ──
  const radarData = {
    labels: ["Confidence", "Eye Contact", "Composure", "Engagement", "Calmness"],
    datasets: [
      {
        label: "Your Performance",
        data: [
          confidenceScore,
          eyeContactScore,
          composureRating,
          engagementScore,
          100 - nervousnessIndex,
        ],
        backgroundColor: "rgba(100, 160, 255, 0.15)",
        borderColor: "rgba(100, 160, 255, 0.9)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(100, 160, 255, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(100, 160, 255, 1)",
        pointRadius: 4,
      },
    ],
  };

  const radarOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.07)" },
        angleLines: { color: "rgba(255,255,255,0.07)" },
        pointLabels: {
          color: "#94a3b8",
          font: { size: 12, family: "'Inter', sans-serif" },
        },
        ticks: {
          color: "#475569",
          backdropColor: "transparent",
          stepSize: 25,
          callback: (v: number) => `${v}`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f8fafc",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        callbacks: { label: (ctx: any) => ` ${ctx.parsed.r}%` },
      },
    },
  };

  // ── Doughnut for eye contact ──
  const eyeContactData = {
    datasets: [
      {
        data: [eyeContactScore, 100 - eyeContactScore],
        backgroundColor: [
          "rgba(34, 211, 238, 0.85)",
          "rgba(255,255,255,0.05)",
        ],
        borderColor: ["rgba(34, 211, 238, 1)", "transparent"],
        borderWidth: [2, 0],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "78%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  const allIntegrityPassed =
    facePresentPercentage >= 85 &&
    multipleFacePercentage <= 5 &&
    deviceDetectedPercentage === 0 &&
    lookingAwayPercentage <= 15;

  return (
    <div className="flex flex-col gap-8 mt-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="text-primary-200" size={24} />
        <h2 className="text-2xl font-bold text-light-100">Performance Analysis</h2>
      </div>

      {/* ── Row 1: Score Rings ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreRing
          score={confidenceScore}
          label="Confidence"
          color="#a78bfa"
          icon={Brain}
          description="Positive & neutral expressions"
        />
        <ScoreRing
          score={eyeContactScore}
          label="Eye Contact"
          color="#22d3ee"
          icon={Eye}
          description="Time looking at screen"
        />
        <ScoreRing
          score={composureRating}
          label="Composure"
          color="#34d399"
          icon={TrendingUp}
          description="Inverse of nervousness"
        />
        <ScoreRing
          score={engagementScore}
          label="Engagement"
          color="#fb923c"
          icon={Zap}
          description="Face visible in frame"
        />
      </div>

      {/* ── Row 2: Radar + Eye Contact Doughnut ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Radar */}
        <div className="col-span-3 card card-border p-6 flex flex-col">
          <h3 className="text-base font-semibold text-light-100 mb-4">Overall Performance Radar</h3>
          <div className="flex-1 min-h-[280px]">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Eye Contact Doughnut */}
        <div className="col-span-2 card card-border p-6 flex flex-col items-center justify-center gap-6">
          <h3 className="text-base font-semibold text-light-100 self-start">Eye Contact</h3>
          <div className="relative w-44 h-44">
            <Doughnut data={eyeContactData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-light-100">{eyeContactScore}</span>
              <span className="text-sm text-light-400">/ 100</span>
            </div>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-light-400">Looking away</span>
              <span className="text-red-400">{lookingAwayPercentage}% of interview</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-light-400">On-screen</span>
              <span className="text-cyan-400">{eyeContactScore}% of interview</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Integrity + Insights ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Integrity */}
        <div className="card card-border p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {allIntegrityPassed ? (
              <ShieldCheck className="text-green-400" size={20} />
            ) : (
              <ShieldAlert className="text-red-400" size={20} />
            )}
            <h3 className="text-base font-semibold text-light-100">Integrity Checks</h3>
            <span
              className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                allIntegrityPassed
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {allIntegrityPassed ? "All Passed" : "Issues Found"}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <IntegrityRow label="Face Present" value={facePresentPercentage} pass={facePresentPercentage >= 85} threshold="≥ 85%" />
            <IntegrityRow label="Eye Contact" value={eyeContactScore} pass={lookingAwayPercentage <= 15} threshold="≤ 15% away" />
            <IntegrityRow label="Single Person" value={100 - multipleFacePercentage} pass={multipleFacePercentage <= 5} threshold="≤ 5% multi-face" />
            <IntegrityRow label="No Device" value={100 - deviceDetectedPercentage} pass={deviceDetectedPercentage === 0} threshold="0% detected" />
          </div>
        </div>

        {/* Insights */}
        {insights && insights.length > 0 && (
          <div className="card card-border p-6 flex flex-col gap-4">
            <h3 className="text-base font-semibold text-light-100 flex items-center gap-2">
              <Brain className="text-primary-200" size={18} />
              AI Behavioral Insights
            </h3>
            <ul className="space-y-3 flex-1">
              {insights.map((insight, idx) => {
                const isWarning = insight.toLowerCase().startsWith("warning");
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                        isWarning ? "bg-red-400" : "bg-primary-200"
                      }`}
                    />
                    <span className={`text-sm ${isWarning ? "text-red-300" : "text-light-300"}`}>
                      {insight}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
