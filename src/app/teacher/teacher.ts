import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private apiUrl = 'https://localhost:7264/api/Teacher'; 

  constructor(private http: HttpClient) { }

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTeacher(teacher: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, teacher);
  }

  updateTeacher(id: number, teacher: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { ...teacher, subjects: [] });
  }

  deleteTeacher(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher.html',
  styleUrls: ['./teacher.css']
})
export class TeacherComponent implements OnInit {
  teachers: any[] = [];
  currentTeacher: any = { id: 0, name: '', specialization: '', email: '', password: '', isActive: true };
  isEditMode: boolean = false;

  constructor(private teacherService: TeacherService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = [...data]; 
        console.log('Data synchronized successfully');
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Failed to load teachers:', err)
    });
  }

  toggleStatus(teacher: any): void {
    const originalStatus = teacher.isActive;
    const newStatus = !teacher.isActive;
    teacher.isActive = newStatus;

    this.teacherService.updateTeacher(teacher.id, teacher).subscribe({
      next: () => {
        console.log(`Status changed to ${newStatus ? 'Active' : 'Inactive'}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update status failed:', err);
        teacher.isActive = originalStatus;
        this.cdr.detectChanges();
        alert('Failed to update status on server');
      }
    });
  }

  saveTeacher() {
    if (!this.currentTeacher.name?.trim() || !this.currentTeacher.specialization?.trim()) {
      return;
    }

    if (this.isEditMode) {
      this.teacherService.updateTeacher(this.currentTeacher.id, this.currentTeacher).subscribe({
        next: () => {
          this.loadTeachers();
          this.resetForm();
        },
        error: (err) => console.error('Update operation failed:', err)
      });
    } else {
      const teacherToAdd = { 
        name: this.currentTeacher.name, 
        subject: this.currentTeacher.specialization, 
        email: this.currentTeacher.email,        
        password: this.currentTeacher.password       
      };
      
      this.teacherService.addTeacher(teacherToAdd).subscribe({
        next: () => {
          this.loadTeachers();
          this.resetForm();
        },
        error: (err) => console.error('Add operation failed:', err)
      });
    }
  }

  editTeacher(teacher: any) {
    this.currentTeacher = { ...teacher };
    this.isEditMode = true;
  }

  deleteTeacher(id: number) {
    this.teacherService.deleteTeacher(id).subscribe({
      next: () => {
        this.loadTeachers();
        console.log('Teacher deleted successfully');
      },
      error: (err) => console.error('Delete operation failed:', err)
    });
  }

  resetForm() {
    this.currentTeacher = { id: 0, name: '', specialization: '', email: '', password: '', isActive: true };
    this.isEditMode = false;
  }

  getActiveCount(): number {
    return this.teachers.filter(t => t.isActive).length;
  }

  deleteItem(id: any) {
    this.teachers = this.teachers.filter(teacher => teacher.id !== id);
  }
}