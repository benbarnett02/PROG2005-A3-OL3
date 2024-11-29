export interface Client {
    id: string;
    personalTrainerId: string;
    name: string;
    email: string;
    password?: string;  // Optional as it won't be returned from API
    age?: number;
    goals?: string;
    fitnessLevel?: string;
    medicalConditions?: string[];
} 