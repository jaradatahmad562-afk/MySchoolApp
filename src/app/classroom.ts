import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = 'https://localhost:7264/api/Classroom'; 

  constructor(private http: HttpClient) { }

  getClassrooms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}