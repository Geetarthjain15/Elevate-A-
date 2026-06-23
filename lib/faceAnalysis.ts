import * as faceapi from "face-api.js";

export class FaceAnalyzer {
  private videoElement: HTMLVideoElement | null = null;
  private isAnalyzing: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  public snapshots: ExpressionSnapshot[] = [];
  public modelsLoaded: boolean = false;

  constructor() {
    this.snapshots = [];
  }

  async loadModels() {
    if (this.modelsLoaded) return;
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      this.modelsLoaded = true;
      console.log("Face analysis models loaded");
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
        const detection = await faceapi
          .detectSingleFace(
            this.videoElement,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detection) {
          const expressions = detection.expressions;
          
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
    
    let totalScore = {
        neutral: 0,
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
    }

    this.snapshots.forEach((snap) => {
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
    });

    const totalSnapshots = this.snapshots.length;

    // Confidence: % of time happy or neutral
    const confidenceScore = Math.round(
      ((happyCount + neutralCount) / totalSnapshots) * 100
    );

    // Nervousness: % of time fearful or surprised
    const nervousnessIndex = Math.round(
      ((fearfulCount + surprisedCount) / totalSnapshots) * 100
    );

    // Engagement: simply having snapshots (face detected)
    // Could be refined if we tracked face landmarks, but simple for now
    const engagementScore = 100; // Placeholder

    // Composure: inverse of nervousness
    const composureRating = 100 - nervousnessIndex;

    // Expression Breakdown
    const expressionBreakdown: Record<string, number> = {};
    Object.entries(totalScore).forEach(([exp, total]) => {
      expressionBreakdown[exp] = Math.round((total / totalSnapshots) * 100);
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

    return {
      confidenceScore,
      nervousnessIndex,
      engagementScore,
      composureRating,
      expressionBreakdown,
      timeline: this.snapshots,
      insights,
    };
  }
}
