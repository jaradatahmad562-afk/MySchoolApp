import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // تأكد إن الـ HttpClientModule مضاف في الـ app.config أو الـ app.module
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

  constructor(private http: HttpClient) {}

  // هاد السطر هو "البطل" اللي رح يرجعلك البيانات كل ما تفتح الصفحة
  ngOnInit(): void {
    this.fetchData(); 
  }

  fetchData(): void {
    // جلب المواعيد (الحصص)
    this.http.get<any[]>(`${this.baseUrl}/Schedule`).subscribe({
      next: (data) => {
        this.schedules = data;
        console.log("Data loaded successfully:", data);
      },
      error: (err) => console.error("Failed to load schedules:", err)
    });

    // جلب المواد والقاعات للقوائم المنسدلة
    this.http.get<any[]>(`${this.baseUrl}/Subject`).subscribe(res => this.subjects = res);
    this.http.get<any[]>(`${this.baseUrl}/Classroom`).subscribe(res => this.classrooms = res);
  }

  addSchedule(): void {
    // منع الإرسال إذا البيانات ناقصة (حل مشكلة Data is missing)
    if (!this.newSchedule.subjectId || !this.newSchedule.classroomId || !this.newSchedule.startTime) {
      alert("Please fill all fields!");
      return;
    }

    const payload = {
      day: Number(this.newSchedule.day),
      subjectId: Number(this.newSchedule.subjectId),
      classroomId: Number(this.newSchedule.classroomId),
      // معالجة الوقت لإضافة الثواني عشان SQL بطلبها
      startTime: this.newSchedule.startTime.length === 5 ? this.newSchedule.startTime + ":00" : this.newSchedule.startTime,
      endTime: this.newSchedule.endTime.length === 5 ? this.newSchedule.endTime + ":00" : this.newSchedule.endTime
    };

    this.http.post(`${this.baseUrl}/Schedule`, payload).subscribe({
      next: () => {
        console.log("Success! Schedule added.");
        this.fetchData(); // تحديث فوري من الداتابيز
        this.resetForm();
      },
      error: (err) => {
        // لو السيرفر ضرب 500 بس الداتا وصلت (زي ما صار معك قبل)
        this.fetchData();
        alert(err.error?.message || "Check server connection");
      }
    });
  }

  deleteSchedule(id: number): void {
    if (!id) return;
    
    if(confirm("Are you sure you want to delete this slot?")) {
      this.http.delete(`${this.baseUrl}/Schedule/${id}`).subscribe({
        next: () => {
          // تحديث الواجهة فوراً (بحل مشكلة الـ 404 والكبسة الثانية)
          this.schedules = this.schedules.filter(s => s.id !== id);
          console.log("Deleted successfully");
        },
        error: (err) => {
          console.error("Delete failed", err);
          this.fetchData(); // مزامنة مع الداتابيز في حال الفشل
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