import {Component, OnInit} from '@angular/core';
import {ClientService, Client, Workout} from '../services/data.service';
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  private client: Client;
  private workoutPlan: Workout[] | undefined;
  groupedWorkouts: { day: string; workouts: Workout[] }[] = [];


  constructor(private dataService: ClientService, private authService: AuthService) {
    this.client = this.authService.getCurrentClient() as Client; // explicit cast... not ideal but in theory this should always be a Client if router guard hasn't redirected.
    this.dataService.getWorkoutPlan(this.client.client_id).subscribe((workoutPlan) => {
      this.workoutPlan = workoutPlan;
      this.groupWorkoutsByDay(); // this method runs twice - guessing it fixes the race condition?

    });

  }

  ngOnInit() {
    this.groupWorkoutsByDay();
  }

  groupWorkoutsByDay() {
    if (!this.workoutPlan) {
      return;
    }
    this.groupedWorkouts = this.workoutPlan.reduce((acc, workout) => {
      const day = workout.day;
      const existingDay = acc.find((group) => group.day === day);
      if (existingDay) {
        existingDay.workouts.push(workout);
      } else {
        acc.push({day, workouts: [workout]});
      }
      return acc;
    }, [] as { day: string; workouts: Workout[] }[]);
  }

}
