import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router'; 
import { filter } from 'rxjs/operators'; 

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboardComponent implements OnInit {
  studentProfile: any = null;
  grades: any[] = [];
  schedule: any[] = [];
  currentTab: string = 'profile';

  private baseUrl = 'https://localhost:7264/api/StudentPortal'; 

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkCurrentRoute(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkCurrentRoute(event.url);
    });

    this.loadStudentData();
  }

  checkCurrentRoute(url: string) {
    if (url.includes('my-grades')) {
      this.currentTab = 'grades';
    } else if (url.includes('my-schedule')) {
      this.currentTab = 'schedule';
    } else {
      this.currentTab = 'profile';
    }
    this.cdr.detectChanges(); 
  }

  loadStudentData() {
    const token = localStorage.getItem('token');
    // إذا ما في توكن، توقف فوراً
    if (!token) {
        console.error("No token found in localStorage!");
        return;
    }

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    // البروفايل
    const profileUrl = `${this.baseUrl}/my-profile`;
    this.http.get(profileUrl, { headers }).subscribe({
      next: (data) => { 
        this.studentProfile = data; 
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Failed URL:', profileUrl, 'Error:', err)
    });

    // الدرجات
    const gradesUrl = `${this.baseUrl}/my-grades`;
    this.http.get<any[]>(gradesUrl, { headers }).subscribe({
      next: (data) => { this.grades = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Failed URL:', gradesUrl, 'Error:', err)
    });

    // الجدول
    const scheduleUrl = `${this.baseUrl}/my-schedule`;
    this.http.get<any[]>(scheduleUrl, { headers }).subscribe({
      next: (data) => { this.schedule = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Failed URL:', scheduleUrl, 'Error:', err)
    });
  }
}