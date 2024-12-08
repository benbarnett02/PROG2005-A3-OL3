import { PersonalTrainer } from '../models/trainer.interface';
import { Client } from '../models/client.interface';
import { WorkoutPlan } from '../models/workout-plan.interface';

export const mockTrainer: PersonalTrainer = {
    personaltrainer_id: 1,
    name: 'John Doe',
    email: 'trainer@example.com',
    password: 'abc123',
    gender: 'Male',
    dob: '1980-01-01T00:00:00.000Z',
    is_active: 1
};

export const mockWorkoutPlan: WorkoutPlan = {
    id: 'wp1',
    clientId: 'c1',
    exercises: [
        {
            name: 'Squats',
            sets: 3,
            reps: 12,
            weight: 100,
            notes: 'Focus on form'
        },
        {
            name: 'Push-ups',
            sets: 3,
            reps: 15,
            notes: 'Rest 1 minute between sets'
        }
    ],
    startDate: '2023-11-01'
}; 