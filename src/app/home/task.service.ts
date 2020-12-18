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

  editTask(description: string, priority: number, id?: string): Observable<Task> {
    let data = {
      description: description, 
      priority: priority, 
    }
    if (!!id) {
      data["id"] = id;
    }
    return this._http.post(`${API_URL}/tasks/`, data) as Observable<Task>; 
  }
}
