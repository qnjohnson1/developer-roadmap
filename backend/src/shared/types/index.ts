export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  goal: string;
  userId: string;
  months?: Month[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Month {
  id: string;
  phaseId: string;
  number: number;
  title: string;
  progress: number;
  weeks?: Week[];
  resources?: Resource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Week {
  id: string;
  monthId: string;
  number: number;
  title: string;
  focus: string;
  days?: Day[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Day {
  id: string;
  weekId: string;
  dayName: string;
  dayIndex: number;
  timeBlocks?: TimeBlock[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeBlock {
  id: string;
  dayId: string;
  duration: string;
  type: 'theory' | 'project' | 'practice';
  description: string;
  completed: boolean;
  order: number;
  progressLogs?: ProgressLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  monthId: string;
  title: string;
  url?: string;
  type: 'book' | 'video' | 'website' | 'tool';
  status: 'not_started' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  entityType: 'phase' | 'month' | 'week' | 'day' | 'timeblock' | 'resource';
  entityId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressLog {
  id: string;
  userId: string;
  timeBlockId: string;
  actualDuration: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}