import { Component } from '@angular/core';
import {Client, ClientService, Workout} from "../services/data.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  client: Client | undefined;
  workoutPlans: Workout[] = [];
  today: Workout[] = [];
  dayName: string = '';
  constructor(private clientService: ClientService) {
    this.clientService.clientLogin('johndoe@example.com', 'password123').subscribe((res) => {
      this.client = res.user;
    });
    console.log(this.client);
    this.clientService.getWorkoutPlan('1').subscribe((res) => {
      this.workoutPlans = res;

      this.today = this.getTodayWorkouts();
    });
  }




  getTodayWorkouts()  : Workout[] {
    if (!this.workoutPlans) {
      console.log('No workout plans');
      return [];
    }
    const day = new Date(Date.now()).getDay() + 2;


    let dayName = '';
    switch (day) {
      case 0:
        dayName = 'Sunday';
        break;
      case 1:
        dayName = 'Monday';
        break;
      case 2:
        dayName = 'Tuesday';
        break;
      case 3:
        dayName = 'Wednesday';
        break;
      case 4:
        dayName = 'Thursday';
        break;
      case 5:
        dayName = 'Friday';
        break;
      case 6:
        dayName = 'Saturday';
        break;
    }
    this.dayName = dayName; // side effect...
    console.log(dayName) // logs undefined?
    return this.workoutPlans.filter((workout) => workout.day === dayName);
  }
}
