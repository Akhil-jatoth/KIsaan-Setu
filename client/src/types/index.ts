export type AppRoute = 
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'ar-assistant'
  | 'crop-scanner'
  | 'disease-analysis'
  | 'guidance'
  | 'crops'
  | 'crop-detail'
  | 'equipment'
  | 'equipment-detail'
  | 'training'
  | 'training-experience'
  | 'virtual-farm'
  | 'progress'
  | 'history'
  | 'field-detail'
  | 'community'
  | 'kisan-suvidha'
  | 'demo'
  | 'settings';

export type UserRole = 'Farmer' | 'Agriculture Student' | 'Trainer' | 'Agronomist' | 'Lead Agronomist & Trainer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  location?: string;
  createdAt: string;
}

export interface GrowthStage {
  stage: string;
  duration: string;
  description: string;
  keyCareTips: string[];
}

export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  image: string;
  description: string;
  idealSoil: string;
  optimalTemp: string;
  waterRequirement: string;
  growthStages: GrowthStage[];
  commonDiseases: string[];
  nutritionalNeeds: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  harvestingGuidelines: string;
}

export interface DiseaseStep {
  step: number;
  title: string;
  instruction: string;
  urgency: string;
  illustrationType: 'isolate' | 'prune' | 'hygiene' | 'expert' | 'monitor';
}

export interface Disease {
  id: string;
  crop: string;
  name: string;
  scientificName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  image: string;
  symptoms: string[];
  causes: string[];
  visualIndicators: {
    leaf: string;
    stem?: string;
    fruit?: string;
  };
  prevention: string[];
  stepByStepGuidance: DiseaseStep[];
  expertAdvisory: string;
}

export interface EquipmentComponent {
  id: string;
  name: string;
  position: [number, number, number];
  description: string;
  safetyChecklist: string[];
  maintenanceCycle: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  specs: Record<string, string>;
  components: EquipmentComponent[];
  safetyProtocols: string[];
}

export interface TrainingStep {
  stepNumber: number;
  title: string;
  targetComponentId: string;
  instruction: string;
  feedbackSuccess: string;
  feedbackError: string;
  hint: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  badge: string;
  description: string;
  learningObjectives: string[];
  interactive3DType: 'tractor' | 'sprayer' | 'farm' | 'drone' | 'plant';
  steps: TrainingStep[];
  quiz: QuizQuestion[];
}

export interface ScanResult {
  id: string;
  userId: string;
  crop: string;
  scientificName: string;
  condition: string;
  diseaseId?: string;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  image: string;
  date: string;
  guidanceViewed: boolean;
  location: string;
  actionTaken?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  unlockedAt: string;
}

export interface UserProgress {
  userId: string;
  totalScans: number;
  completedTrainings: number;
  averageScore: number;
  learningStreakDays: number;
  cropsIdentifiedCount: number;
  diseasesDiagnosedCount: number;
  badges: Badge[];
  moduleProgress: Record<string, {
    completed: boolean;
    score: number;
    completedSteps: number;
    timeSpent: string;
  }>;
}

export interface CommunityComment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface CommunityNote {
  id: string;
  author: string;
  role: string;
  avatar: string;
  timeAgo: string;
  location: string;
  crop: string;
  title: string;
  content: string;
  image: string;
  upvotes: number;
  commentsCount: number;
  solved: boolean;
  comments: CommunityComment[];
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  uvIndex: number;
  location: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}
