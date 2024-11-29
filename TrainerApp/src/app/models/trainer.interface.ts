export interface PersonalTrainer {
    id: string;
    email: string;
    password?: string;  // Optional as it won't be returned from API
    name: string;
    specialization?: string;
    experience?: number;
} 