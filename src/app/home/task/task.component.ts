import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/app.interface';
import { TaskService } from '../task.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task: Task; 
  @Input() tasks: Task[]; 
  @Input() index: number; 
  @Input() taskList: Task[]; 

  newDescription: string; 
  dontClose = false; 
  formGroup: FormGroup; 
  isEditing: boolean = false; 
  date: Date; 
  today: Date; 
  overDue: boolean;
  newDate: string;
  minDate = new Date(); 

  constructor(
    private _formBuilder: FormBuilder,
    private _taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.newDate = this.task.due_date; 
    this._calculateDate(); 
    this.formGroup = this._formBuilder.group({
      'task': ["Enter description here", Validators.minLength(1)], 
      "date": []
    })
    this.newDescription = this.task.description;
  }

  private _calculateDate(): void {
    this.today = new Date();
    this.date = new Date(this.task.due_date);
    this.overDue = this.today.getTime() > this.date.getTime();
  }

  complete(): void {
    this._taskService.complete(this.task.id).subscribe(); 
  }
  
  get description(): string {
    return this.task.description; 
  }

  edit(): void {
    this.dontClose = true;
    this.isEditing = !this.isEditing; 
  }

  doneEditing(): void {
    if (!!this.newDate) {
      this.task.due_date = this.newDate; 
      this._calculateDate(); 
    }
    this.task.description = this.newDescription; 
    this._taskService.editTask(this.task.description, this.task.priority, this.task.id, this.task.due_date).subscribe(
      () => {
        this.edit(); 
      }
    ); 
  }

  suppressClose(): void {
    this.dontClose = true; 
  }

  close(): void {
    if (this.isEditing && !this.dontClose) {
      this.isEditing = false; 
    }
    this.dontClose = false;
  }

  up(): void {
    if (this.index >= this.taskList.length - 1) {
      return; 
    }
    this.task.priority = this.taskList[this.index + 1].priority - 1;
    this._taskService.editTask(this.task.description, this.task.priority, this.task.id).subscribe(); 
  }

  down(): void {
    if (this.index <= 0) {
      return;
    }
    this.task.priority = this.taskList[this.index - 1].priority + 1;
    this._taskService.editTask(this.task.description, this.task.priority, this.task.id).subscribe(); 
  }

  get formattedDate(): string {
    return formatDate(this.date, "EEEE, MMMM d", "en-us")
  }
}
