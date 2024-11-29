import { PersonalTrainer } from '../models/trainer.interface';
import { Client } from '../models/client.interface';
import { WorkoutPlan } from '../models/workout-plan.interface';

export const mockTrainer: PersonalTrainer = {
    id: 'pt123',
    email: 'trainer@example.com',
    password: 'abc123',
    name: 'John Doe',
    specialization: 'Strength Training',
    experience: 5
};

export const mockClients: Client[] = [
    {
        id: 'c1',
        personalTrainerId: 'pt123',
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'abc123',
        age: 28,
        goals: 'Weight loss',
        fitnessLevel: 'Intermediate',
        medicalConditions: []
    },
    {
        id: 'c2',
        personalTrainerId: 'pt123',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'abc123',
        age: 35,
        goals: 'Muscle gain',
        fitnessLevel: 'Beginner',
        medicalConditions: ['Asthma']
    },
    {
        id: 'c3',
        personalTrainerId: 'pt123',
        name: 'Carol Williams',
        email: 'carol@example.com',
        password: 'abc123',
        age: 42,
        goals: 'General fitness',
        fitnessLevel: 'Advanced',
        medicalConditions: []
    }
];

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