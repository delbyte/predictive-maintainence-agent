// Types for the multi-agent system

export interface AgentState {
  messages: AgentMessage[];
  csvData?: CSVData;
  anomalies?: Anomaly[];
  userEmail?: string;
  userId?: string;
  schedulingStatus?: SchedulingStatus;
  currentAgent?: string;
  error?: string;
}

export interface AgentMessage {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'agent';
  content: string;
  agentName?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface CSVData {
  headers: string[];
  rows: Record<string, any>[];
  vehicleInfo?: VehicleInfo[];
}

export interface VehicleInfo {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  sensorData?: SensorData;
}

export interface SensorData {
  engineTemp?: number;
  oilPressure?: number;
  brakeWear?: number;
  tirePressure?: number[];
  batteryVoltage?: number;
  [key: string]: any;
}

export interface Anomaly {
  id: string;
  vehicleId: string;
  vin?: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  detectedAt: number;
  affectedComponent?: string;
}

export interface SchedulingStatus {
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  proposedDate?: string;
  confirmedDate?: string;
  appointmentId?: string;
}

export type AgentType =
  | 'master'
  | 'csv_analysis'
  | 'anomaly_detection'
  | 'notification'
  | 'scheduling'
  | 'chatbot';

export interface AgentLog {
  agentType: AgentType;
  action: string;
  timestamp: number;
  details?: any;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
}

// Event types for real-time updates
export type AgentEventType =
  | 'agent_started'
  | 'agent_progress'
  | 'agent_thinking'  // NEW: for real-time LLM token streaming
  | 'agent_completed'
  | 'agent_failed';

export interface AgentEvent {
  type: AgentEventType;
  agentType: AgentType;
  message: string;
  data?: any;
  timestamp: number;
}
