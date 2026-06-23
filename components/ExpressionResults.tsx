"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Smile, Frown, Meh, Activity, Zap, ShieldAlert, ShieldCheck } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpressionResultsProps {
  results: ExpressionAnalysisResult;
}

export default function ExpressionResults({ results }: ExpressionResultsProps) {
  if (!results) return null;

  const {
    confidenceScore,
    nervousnessIndex,
    expressionBreakdown,
    insights,
    facePresentPercentage,
    multipleFacePercentage,
  } = results;

  // Prepare data for the Bar Chart
  const chartData = {
    labels: [
      "Happy",
      "Neutral",
      "Surprised",
      "Fearful",
      "Sad",
      "Angry",
      "Disgusted",
    ],
    datasets: [
      {
        label: "% Time Displayed",
        data: [
          expressionBreakdown.happy || 0,
          expressionBreakdown.neutral || 0,
          expressionBreakdown.surprised || 0,
          expressionBreakdown.fearful || 0,
          expressionBreakdown.sad || 0,
          expressionBreakdown.angry || 0,
          expressionBreakdown.disgusted || 0,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",  // Happy - Green
          "rgba(148, 163, 184, 0.7)", // Neutral - Gray
          "rgba(234, 179, 8, 0.7)",   // Surprised - Yellow
          "rgba(249, 115, 22, 0.7)",  // Fearful - Orange
          "rgba(59, 130, 246, 0.7)",  // Sad - Blue
          "rgba(239, 68, 68, 0.7)",   // Angry - Red
          "rgba(168, 85, 247, 0.7)",  // Disgusted - Purple
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(148, 163, 184)",
          "rgb(234, 179, 8)",
          "rgb(249, 115, 22)",
          "rgb(59, 130, 246)",
          "rgb(239, 68, 68)",
          "rgb(168, 85, 247)",
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          callback: (value: any) => `${value}%`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="text-primary-200" size={24} />
        <h2 className="text-2xl font-bold text-light-100">
          Expression Analysis
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Key Metrics Cards */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="card card-border flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-sm font-medium text-light-400 mb-2 uppercase tracking-wider">
              Confidence Score
            </h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
               {/* Simple CSS Circle Progress Placeholder - Consider SVG for better control */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-dark-300"
              />
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle
                   cx="64"
                   cy="64"
                   r="60"
                   fill="transparent"
                   stroke="currentColor"
                   strokeWidth="4"
                   className="text-primary-200"
                   strokeDasharray="377" // 2 * pi * r
                   strokeDashoffset={377 - (377 * confidenceScore) / 100}
                   strokeLinecap="round"
                 />
               </svg>
              <span className="text-4xl font-bold text-light-100">
                {confidenceScore}
              </span>
            </div>
            <p className="text-sm text-light-400 mt-4">
              Based on positive and neutral expressions
            </p>
          </div>

          <div className="card card-border flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-light-100">Nervousness</p>
                <p className="text-xs text-light-400">Micro-expressions</p>
              </div>
            </div>
            <span className="text-xl font-bold text-light-100">{nervousnessIndex}%</span>
          </div>

          <div className="card card-border flex flex-col p-4 gap-3">
            <div className="flex items-center gap-2">
              {(facePresentPercentage >= 85 && multipleFacePercentage <= 5) ? (
                <ShieldCheck className="text-green-500" size={20} />
              ) : (
                <ShieldAlert className="text-red-500" size={20} />
              )}
              <h3 className="text-sm font-medium text-light-100">Integrity Checks</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-light-400">Face Present</span>
                <span className={facePresentPercentage >= 85 ? "text-green-400" : "text-red-400"}>
                  {facePresentPercentage}% Time
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-light-400">Multiple Faces</span>
                <span className={multipleFacePercentage <= 5 ? "text-green-400" : "text-red-400"}>
                  {multipleFacePercentage}% Time
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="col-span-1 md:col-span-2 card card-border p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-light-100 mb-4">
            Expression Breakdown
          </h3>
          <div className="flex-1 min-h-[250px] w-full relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="card card-border p-6">
          <h3 className="text-lg font-semibold text-light-100 mb-4 flex items-center gap-2">
            <Smile className="text-primary-200" size={20} />
            Key Behavioral Insights
          </h3>
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-200" />
                <span className="text-light-300">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
