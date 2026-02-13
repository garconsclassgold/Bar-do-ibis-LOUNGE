
export enum ShiftType {
  MORNING = 'Manhã',
  AFTERNOON = 'Tarde',
  NIGHT = 'Noite'
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  critical?: boolean;
}

export interface ChecklistState {
  [key: string]: boolean;
}

export interface OperationalReport {
  id: string;
  date: string;
  bartenderName: string;
  shift: ShiftType;
  completedItems: string[];
  totalItems: number;
  coconutCount: number;
  observations: string;
  signature: string;
}
