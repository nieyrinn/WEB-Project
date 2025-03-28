export interface SupportSession {
    id: number;
    title: string;
    description: string;
    category_id: number;
    category_name: string;
    mentor_id: number;
    mentor_name: string;
    attendee: number;
    scheduled_time: string;
    duration_minutes: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes: string;
    created_at: string;
  }