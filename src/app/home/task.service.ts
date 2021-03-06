import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../app.constants';

import { Task } from 'src/app/app.interface'; 

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private _http: HttpClient
  ) {}

  loadTasks(): Observable<Task[]> {
    return this._http.get(`${API_URL}/tasks/`) as Observable<Task[]>; 
  }

  editTask(description: string, priority: number, id?: string, date?: string): Observable<Task> {
    let data = {
      description: description, 
      priority: priority, 
    }

    if (!!id) {
      data["id"] = id;
    }
    if (!!date) {
      data["date"] = date; 
    }
    return this._http.post(`${API_URL}/tasks/`, data) as Observable<Task>; 
  }

  complete(taskId: string): Observable<any> {
    let data = {
      id: taskId
    }
    return this._http.post(`${API_URL}/complete/`, data); 
  }
}
