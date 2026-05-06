import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  // الرابط تبع الكنترولر في مشروعك
  private apiUrl = 'https://localhost:7264/api/Classroom'; 

  constructor(private http: HttpClient) { }

  // دالة لجلب قائمة الصفوف
  getClassrooms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}