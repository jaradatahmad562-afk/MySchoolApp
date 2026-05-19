import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './grades.html',
  styleUrls: ['./grades.css']
})
export class GradesComponent implements OnInit {
  grades: any[] = [];
  students: any[] = [];
  subjects: any[] = [];
  
  gradeForm: any = {
    id: 0,
    studentId: 0,
    subjectId: 0,
    firstExam: 0,
    secondExam: 0,
    finalExam: 0
  };

  isEditing: boolean = false;
  isSaving: boolean = false;
  private apiUrl = 'https://localhost:7264/api';

  // 🌟 ضفنا الـ ChangeDetectorRef هون عشان نجبر الشاشة تتحدث
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStudents();
    this.loadSubjects();
    this.loadGrades();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadStudents() {
    this.http.get<any[]>(`${this.apiUrl}/Grades/students`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.students = data;
        this.cdr.detectChanges(); // تحديث فوري للقوائم
      },
      error: (err) => console.error(err)
    });
  }

  loadSubjects() {
    this.http.get<any[]>(`${this.apiUrl}/Grades/subjects`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.subjects = data;
        this.cdr.detectChanges(); // تحديث فوري للقوائم
      },
      error: (err) => console.error(err)
    });
  }

  loadGrades() {
    this.http.get<any[]>(`${this.apiUrl}/Grades`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.grades = data;
        this.cdr.detectChanges(); // 🌟 تحديث فوري للجدول أول ما تفتح الصفحة
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    const sId = Number(this.gradeForm.studentId);
    const subId = Number(this.gradeForm.subjectId);

    if (!sId || !subId || sId === 0 || subId === 0) {
      alert("Please select a student and a subject before saving!");
      return;
    }

    this.isSaving = true;
    this.gradeForm.studentId = sId;
    this.gradeForm.subjectId = subId;
    this.gradeForm.total = this.gradeForm.firstExam + this.gradeForm.secondExam + this.gradeForm.finalExam;

    if (this.isEditing) {
      this.http.put(`${this.apiUrl}/Grades/${this.gradeForm.id}`, this.gradeForm, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.loadGrades();
          this.resetForm();
          this.isSaving = false;
          this.cdr.detectChanges(); // تحديث الشاشة بعد التعديل
        },
        error: (err) => {
          console.error(err);
          this.isSaving = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.gradeForm.id = 0; 
      this.http.post(`${this.apiUrl}/Grades`, this.gradeForm, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.loadGrades();
          this.resetForm();
          this.isSaving = false;
          this.cdr.detectChanges(); // 🌟 تحديث الشاشة فوراً بعد الإضافة
        },
        error: (err) => {
          console.error(err);
          this.isSaving = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  editGrade(grade: any) {
    this.isEditing = true;
    this.gradeForm = { ...grade };
    this.cdr.detectChanges();
  }

  deleteGrade(id: number) {
    this.grades = this.grades.filter(g => g.id !== id);
    this.cdr.detectChanges(); // إخفاء السطر فوراً
    
    this.http.delete(`${this.apiUrl}/Grades/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => {},
      error: (err) => {
        console.error(err);
        this.loadGrades();
      }
    });
  }

  resetForm() {
    this.isEditing = false;
    this.gradeForm = { id: 0, studentId: 0, subjectId: 0, firstExam: 0, secondExam: 0, finalExam: 0 };
  }
}