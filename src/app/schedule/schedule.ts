import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css']
})
export class ScheduleComponent implements OnInit {
  schedules: any[] = [];
  subjects: any[] = [];
  classrooms: any[] = [];
  private baseUrl = 'https://localhost:7264/api';

  newSchedule = {
    day: 0,
    startTime: '',
    endTime: '',
    subjectId: 0,
    classroomId: 0
  };

  constructor(private http: HttpClient) { } 

  ngOnInit(): void {
    this.fetchData(); 
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin';
  }

  fetchData(): void {
    this.http.get<any[]>(`${this.baseUrl}/Schedule`, this.getAuthHeaders()).subscribe({
      next: (data) => {
       
        setTimeout(() => {
          this.schedules = data; 
        }, 0);
      },
      error: (err) => {
        console.error("Error fetching data", err);
      }
    });

    this.http.get<any[]>(`${this.baseUrl}/Subject`, this.getAuthHeaders()).subscribe(res => this.subjects = res);
    this.http.get<any[]>(`${this.baseUrl}/Classroom`, this.getAuthHeaders()).subscribe(res => this.classrooms = res);
  }

  addSchedule(): void {
    if (!this.newSchedule.subjectId || !this.newSchedule.classroomId || !this.newSchedule.startTime) {
      alert("Please fill all fields!");
      return;
    }

    const payload = {
      day: Number(this.newSchedule.day),
      subjectId: Number(this.newSchedule.subjectId),
      classroomId: Number(this.newSchedule.classroomId),
      startTime: this.newSchedule.startTime.length === 5 ? this.newSchedule.startTime + ":00" : this.newSchedule.startTime,
      endTime: this.newSchedule.endTime.length === 5 ? this.newSchedule.endTime + ":00" : this.newSchedule.endTime
    };

    this.http.post(`${this.baseUrl}/Schedule`, payload, this.getAuthHeaders()).subscribe({
      next: () => {
        console.log("Success! Schedule added.");
        this.fetchData(); 
        this.resetForm();
      },
      error: (err) => {
        this.fetchData();
        alert(err.error?.message || "Check server connection");
      }
    });
  }

  deleteSchedule(id: number): void {
    if (!id) return;

    if (confirm("Are you sure you want to delete this slot?")) {
      this.http.delete(`${this.baseUrl}/Schedule/${id}`, this.getAuthHeaders()).subscribe({
        next: () => {
          
          setTimeout(() => {
            this.schedules = this.schedules.filter(s => s.id != id); 
          }, 0);
          console.log("Deleted successfully");
        },
        error: (err) => {
          console.error("Delete failed", err);
        }
      });
    }
  }

  resetForm(): void {
    this.newSchedule = { day: 0, startTime: '', endTime: '', subjectId: 0, classroomId: 0 };
  }

  getDayName(dayIndex: number | string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[Number(dayIndex)] || 'Unknown';
  }
}