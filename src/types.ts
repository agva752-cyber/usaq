export interface Task {
  id: number;
  icon: string;
  title: string;
  description: string;
  duration: string;
}

export interface Scenario {
  id: number;
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface Award {
  id: number;
  icon: string;
  title: string;
  description: string;
  requiredStars: number;
}

export type Page = 'home' | 'speech' | 'confidence' | 'stage' | 'awards';
