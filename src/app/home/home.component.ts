import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Task } from '../app.interface';

import { TaskService } from './task.service'; 
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tasks: Task[] = []; 

  newTaskDesription: string; 
  formGroup: FormGroup; 

  placeholder: string;
  private _placeholders = [
    "Milk the chickens.", 
    "Walk the cow", 
    "Turn off the oven", 
    "Eat", 
    "Peerpal takehome project", 
    "Homework", 
    "Taxes"
  ]

  constructor(
    private _taskService: TaskService, 
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      "task": ['', Validators.minLength(1)]
    })

    this.placeholder = "For example: '" + this._placeholders[Math.floor(Math.random() * this._placeholders.length)] + "'"

    this._taskService.loadTasks()
      .pipe(take(1))
      .subscribe(
        (response) => {
          this.tasks = response; 
        }, 
        () => {
        }
      )
  }

  get taskList(): Task[] {
    return this.tasks.sort((a, b) => {
      return b.priority - a.priority;
    })
  }

  get runningPriority(): number {
    if (this.tasks.length === 0) {
      return 1; 
    }
    return this.tasks[0].priority + 1; 
  }

  addTask(): void {
    if (this.formGroup.valid) {
      this._taskService.editTask(this.newTaskDesription, this.runningPriority).subscribe(
        (task) => {
          this.tasks.push(task)
        }
      ); 
      this.formGroup.controls["task"].reset(); 
      this.newTaskDesription = undefined; 
    }
    else {
      return
    }
  }
}
