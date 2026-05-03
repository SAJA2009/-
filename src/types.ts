export type GradeLevel = 'grade_10' | 'grade_11' | 'grade_12';

export type Semester = 'semester_1' | 'semester_2_3';

export type ExamType = 'qudurat' | 'tahsili';

export type Subject = 'math' | 'physics' | 'chemistry' | 'biology';

export interface QuestionStep {
  title: string;
  explanation: string;
  formula?: string;
}

export interface SolutionResponse {
  answer: string;
  steps: QuestionStep[];
  lawsUsed: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'teacher';
  createdAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  subject: Subject;
  semester: Semester;
  grade: GradeLevel;
  score: number;
  totalQuestions: number;
  timestamp: Date;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ProblemAttempt {
  id: string;
  userId: string;
  subject: Subject;
  semester: Semester;
  grade: GradeLevel;
  query: string;
  timestamp: Date;
  isSolved: boolean;
}

export interface AreaOfDifficulty {
  subject: Subject;
  topic: string;
  level: number; // 0 to 1, where 1 is "very difficult"
  lastUpdated: Date;
}

export interface StudentProgress {
  userId: string;
  quizAttempts: QuizAttempt[];
  problemAttempts: ProblemAttempt[];
  difficultAreas: AreaOfDifficulty[];
}
