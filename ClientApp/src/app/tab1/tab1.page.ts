import { Component } from '@angular/core';
import {Client, ClientService, Workout} from "../services/data.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  client: Client;
  workoutPlans: Workout[] = [];
  today: Workout[] = [];
  dayName: string = '';
  constructor(private clientService: ClientService, private authService: AuthService) {
    this.client = this.authService.getCurrentClient();

    this.clientService.getWorkoutPlan(this.client?.client_id).subscribe((res) => {
      this.workoutPlans = res;

      this.today = this.getTodayWorkouts();
    });
  }



  getTodayWorkouts()  : Workout[] {
    if (!this.workoutPlans) {
      console.log('No workout plans');
      return [];
    }
    const day = new Date(Date.now()).getDay();
console.log(day)
    console.log("days")

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
