
export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum TicketCategory {
  HARDWARE = 'Hardware',
  SOFTWARE = 'Software',
  NETWORK = 'Network',
  ACCESS = 'Access',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  role: 'EMPLOYEE' | 'AGENT' | 'MANAGER' | 'ADMIN';
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: User['role'];
  content: string;
  timestamp: string; // ISO date string
  isAiGenerated?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  
  // AI Enhanced Fields
  aiSummary?: string;
  aiSuggestedFixes?: string[];
  aiSentimentScore?: number; // 0-100
}

export interface DashboardStats {
  openCount: number;
  criticalCount: number;
  avgResolutionTimeHours: number;
  slaBreachRisk: number;
}

export interface AppSettings {
  allowGuestSignup: boolean;
  enforceMfa: boolean;
  enableAiTriage: boolean;
  restrictDeletion: boolean;
  maintenanceMode: boolean;
}
