"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ExpressionMonitorProps {
  onResultsReady: (results: ExpressionAnalysisResult | null) => void;
  isActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function ExpressionMonitor({
  onResultsReady,
  isActive,
  videoRef,
}: ExpressionMonitorProps) {
  const analyzerRef = useRef<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const wasActive = isActive;

    const init = async () => {
      try {
        // Dynamically import FaceAnalyzer ONLY on the client side
        // This prevents @vladmandic/face-api from being evaluated on the server (SSR),
        // which crashes with "TextEncoder is not a constructor"
        const { FaceAnalyzer } = await import("@/lib/faceAnalysis");
        analyzerRef.current = new FaceAnalyzer();
        await analyzerRef.current.loadModels();

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsInitializing(false);
      } catch (err) {
        console.error("Failed to initialize webcam or models:", err);
        setError("Camera access denied or models failed to load.");
        setIsInitializing(false);
      }
    };

    if (isActive) {
      init();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (wasActive) {
        if (analyzerRef.current) {
          const results = analyzerRef.current.stopAnalysis();
          onResultsReady(results || null);
        } else {
          onResultsReady(null);
        }
      }
    };
  }, [isActive, onResultsReady]);

  // Handle starting/stopping analysis based on isActive
  useEffect(() => {
    if (!isInitializing && !error && isActive && analyzerRef.current && videoRef.current) {
      analyzerRef.current.startAnalysis(videoRef.current);
    }
  }, [isInitializing, error, isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-full bg-dark-200/80 backdrop-blur-md px-4 py-2 border border-light-800/30 shadow-lg">
      {isInitializing ? (
        <>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-xs font-medium text-light-100">Initializing Analysis...</span>
        </>
      ) : error ? (
        <>
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-light-100">{error}</span>
        </>
      ) : (
        <>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-xs font-medium text-light-100 tracking-wide">
            📊 Expression Analysis Active
          </span>
        </>
      )}
    </div>
  );
}
