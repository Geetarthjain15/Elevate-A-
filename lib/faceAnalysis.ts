import { ExpressionSnapshot, ExpressionAnalysisResult } from "@/types";
import * as faceapi from "@vladmandic/face-api";

export class FaceAnalyzer {
  private videoElement: HTMLVideoElement | null = null;
  private isAnalyzing: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  public snapshots: ExpressionSnapshot[] = [];
  public modelsLoaded: boolean = false;
  private cocoSsdModel: any = null;

  constructor() {
    this.snapshots = [];
  }

  async loadModels() {
    if (this.modelsLoaded) return;
    try {
      await import("@tensorflow/tfjs");
      const cocoSsd = await import("@tensorflow-models/coco-ssd");

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        cocoSsd.load().then((m: any) => { this.cocoSsdModel = m; }),
      ]);
      this.modelsLoaded = true;
      console.log("Face and Object analysis models loaded");
    } catch (error) {
      console.error("Failed to load face analysis models:", error);
    }
  }

  startAnalysis(videoElement: HTMLVideoElement, intervalMs: number = 3000) {
    if (!this.modelsLoaded) {
      console.warn("Models not loaded yet. Call loadModels() first.");
      return;
    }
    this.videoElement = videoElement;
    this.isAnalyzing = true;
    this.snapshots = [];

    this.intervalId = setInterval(async () => {
      if (!this.isAnalyzing || !this.videoElement) return;

      try {
        let deviceDetected = false;
        let isLookingAway = false;

        // Object Detection for Cell Phones
        if (this.cocoSsdModel && this.videoElement) {
          try {
            const predictions = await this.cocoSsdModel.detect(this.videoElement);
            const device = predictions.find((p: any) => p.class === "cell phone");
            if (device) deviceDetected = true;
          } catch (e) {
            console.error("COCO-SSD error:", e);
          }
        }

        // Ensure video is ready before detecting
        if (
          this.videoElement.readyState < 2 || 
          !this.videoElement.videoWidth || 
          !this.videoElement.videoHeight
        ) {
          return;
        }

        const detections = await faceapi
          .detectAllFaces(
            this.videoElement,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        const faceCount = detections.length;

        if (faceCount > 0) {
          const detection = detections[0]; // analyze the first/main face
          const expressions = detection.expressions;
          const landmarks = detection.landmarks;

          // Head Pose Estimation
          const nose = landmarks.getNose();
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          const leftEyeCenter = {
            x: leftEye.reduce((sum, pt) => sum + pt.x, 0) / leftEye.length,
            y: leftEye.reduce((sum, pt) => sum + pt.y, 0) / leftEye.length,
          };

          const rightEyeCenter = {
            x: rightEye.reduce((sum, pt) => sum + pt.x, 0) / rightEye.length,
            y: rightEye.reduce((sum, pt) => sum + pt.y, 0) / rightEye.length,
          };

          const noseTip = nose[3];

          const distLeft = Math.sqrt(Math.pow(noseTip.x - leftEyeCenter.x, 2) + Math.pow(noseTip.y - leftEyeCenter.y, 2));
          const distRight = Math.sqrt(Math.pow(noseTip.x - rightEyeCenter.x, 2) + Math.pow(noseTip.y - rightEyeCenter.y, 2));

          const ratio = distLeft / distRight;
          if (ratio > 2.5 || ratio < 0.4) {
            isLookingAway = true;
          }
          
          // Find dominant expression
          let dominantExpression = "neutral";
          let maxVal = expressions.neutral;
          
          Object.entries(expressions).forEach(([exp, val]) => {
            if (val > maxVal) {
              maxVal = val;
              dominantExpression = exp;
            }
          });

          this.snapshots.push({
            timestamp: new Date().toISOString(),
            dominantExpression,
            expressions: {
              neutral: expressions.neutral,
              happy: expressions.happy,
              sad: expressions.sad,
              angry: expressions.angry,
              fearful: expressions.fearful,
              disgusted: expressions.disgusted,
              surprised: expressions.surprised,
            },
            faceCount,
            deviceDetected,
            isLookingAway,
          });
        } else {
          // No face detected
          this.snapshots.push({
            timestamp: new Date().toISOString(),
            dominantExpression: "none",
            expressions: {
              neutral: 0,
              happy: 0,
              sad: 0,
              angry: 0,
              fearful: 0,
              disgusted: 0,
              surprised: 0,
            },
            faceCount: 0,
            deviceDetected,
            isLookingAway: true,
          });
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    }, intervalMs);
  }

  stopAnalysis(): ExpressionAnalysisResult | null {
    this.isAnalyzing = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.snapshots.length === 0) {
      return null;
    }

    return this.calculateResults();
  }

  private calculateResults(): ExpressionAnalysisResult {
    let happyCount = 0;
    let neutralCount = 0;
    let fearfulCount = 0;
    let surprisedCount = 0;
    
    let noFaceCount = 0;
    let multipleFaceCount = 0;
    let deviceDetectedCount = 0;
    let lookingAwayCount = 0;

    let totalScore = {
        neutral: 0,
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
    }

    let faceDetectedSnapshots = 0;

    this.snapshots.forEach((snap) => {
      if (snap.faceCount === 0) noFaceCount++;
      if (snap.faceCount > 1) multipleFaceCount++;
      if (snap.deviceDetected) deviceDetectedCount++;
      if (snap.isLookingAway) lookingAwayCount++;

      if (snap.faceCount > 0) {
        faceDetectedSnapshots++;
        if (snap.dominantExpression === "happy") happyCount++;
        if (snap.dominantExpression === "neutral") neutralCount++;
        if (snap.dominantExpression === "fearful") fearfulCount++;
        if (snap.dominantExpression === "surprised") surprisedCount++;

        totalScore.neutral += snap.expressions.neutral;
        totalScore.happy += snap.expressions.happy;
        totalScore.sad += snap.expressions.sad;
        totalScore.angry += snap.expressions.angry;
        totalScore.fearful += snap.expressions.fearful;
        totalScore.disgusted += snap.expressions.disgusted;
        totalScore.surprised += snap.expressions.surprised;
      }
    });

    const totalSnapshots = this.snapshots.length;

    // Confidence: % of time happy or neutral (when face is present)
    const confidenceScore = faceDetectedSnapshots > 0 ? Math.round(
      ((happyCount + neutralCount) / faceDetectedSnapshots) * 100
    ) : 0;

    // Nervousness: % of time fearful or surprised (when face is present)
    const nervousnessIndex = faceDetectedSnapshots > 0 ? Math.round(
      ((fearfulCount + surprisedCount) / faceDetectedSnapshots) * 100
    ) : 0;

    const facePresentPercentage = Math.round(((totalSnapshots - noFaceCount) / totalSnapshots) * 100);
    const multipleFacePercentage = Math.round((multipleFaceCount / totalSnapshots) * 100);
    const deviceDetectedPercentage = Math.round((deviceDetectedCount / totalSnapshots) * 100);
    const lookingAwayPercentage = Math.round((lookingAwayCount / totalSnapshots) * 100);

    const engagementScore = facePresentPercentage;
    const composureRating = 100 - nervousnessIndex;
    const eyeContactScore = Math.max(0, 100 - lookingAwayPercentage);

    // Expression Breakdown
    const expressionBreakdown: Record<string, number> = {};
    Object.entries(totalScore).forEach(([exp, total]) => {
      expressionBreakdown[exp] = faceDetectedSnapshots > 0 ? Math.round((total / faceDetectedSnapshots) * 100) : 0;
    });

    // Generate Insights
    const insights: string[] = [];
    if (confidenceScore > 80) {
      insights.push("You maintained a highly confident and positive demeanor.");
    } else if (confidenceScore > 50) {
       insights.push("You showed a balanced, professional composure.");
    } else {
        insights.push("Consider smiling more to project greater confidence.");
    }

    if (nervousnessIndex > 20) {
      insights.push(
        "Some nervousness detected. Remember to take deep breaths."
      );
    }

    if (facePresentPercentage < 85) {
      insights.push("Warning: Your face was frequently out of frame or not detected.");
    }

    if (multipleFacePercentage > 5) {
      insights.push("Warning: Multiple faces were detected in your frame during the interview.");
    }

    if (deviceDetectedPercentage > 0) {
      insights.push("Warning: A cell phone or mobile device was detected during your interview.");
    }

    if (lookingAwayPercentage > 15) {
      insights.push("Warning: You were frequently looking away from the screen.");
    }

    return {
      confidenceScore,
      nervousnessIndex,
      engagementScore,
      composureRating,
      eyeContactScore,
      expressionBreakdown,
      timeline: this.snapshots,
      insights,
      facePresentPercentage,
      multipleFacePercentage,
      deviceDetectedPercentage,
      lookingAwayPercentage,
    };
  }
}
