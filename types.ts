export interface RoutineStep {
  step: string;
  description: string;
}

export interface ProductRecommendation {
  productType: string;
  name: string;
  reason: string;
}

export interface AnalysisResult {
  skinType: string;
  skinIssues: string[];
  amRoutine: RoutineStep[];
  pmRoutine: RoutineStep[];
  productRecommendations: ProductRecommendation[];
}

export interface CustomRoutineStep {
  id: string;
  text: string;
  isEditing?: boolean;
}
