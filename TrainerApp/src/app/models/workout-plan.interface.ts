export interface WorkoutPlan {
    id: string;
    clientId: string;
    exercises: Exercise[];
    startDate: string;
    endDate?: string;
}

export interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;  // in minutes
    notes?: string;
} 