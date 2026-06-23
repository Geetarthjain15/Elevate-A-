"use client";

import { useEffect, useRef, useState } from "react";
import { FaceAnalyzer } from "@/lib/faceAnalysis";
import { cn } from "@/lib/utils";

interface ExpressionMonitorProps {
  onResultsReady: (results: ExpressionAnalysisResult) => void;
  isActive: boolean;
}

export default function ExpressionMonitor({
  onResultsReady,
  isActive,
}: ExpressionMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const analyzerRef = useRef<FaceAnalyzer | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const init = async () => {
      try {
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
      if (analyzerRef.current) {
        const results = analyzerRef.current.stopAnalysis();
        if (results) {
          onResultsReady(results);
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
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="hidden" // Hidden video feed, only used for analysis
      />
      
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
