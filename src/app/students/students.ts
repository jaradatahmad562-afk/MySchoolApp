import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StudentService } from '../student'; 

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  classrooms: any[] = [];
  
  // Notification Management
  notificationMessage: string = '';
  showNotification: boolean = false;
  notificationType: 'success' | 'error' | 'warning' = 'success';

  private classroomApiUrl = 'https://localhost:7264/api/Classroom';

  constructor(
    private studentService: StudentService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // --- الإحصائيات (Getters) ---
  // هدول بتناديهم بالـ HTML باستخدام {{ totalStudents }} و {{ activeStudentsCount }}
  get totalStudents(): number {
    return this.students.length;
  }

  get activeStudentsCount(): number {
    return this.students.filter(s => s.status === 'Active').length;
  }
  // ---------------------------

  ngOnInit(): void {
    this.loadStudents();
    this.loadClassrooms(); 
  }

  displayNotification(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data; 
        this.filteredStudents = data;
        this.cdr.detectChanges(); 
      },   
      error: (err) => {
        console.error('Error loading students:', err);
        this.displayNotification('Error loading students list', 'error');
      }
    });
  }

  loadClassrooms(): void {
    this.http.get<any[]>(this.classroomApiUrl).subscribe({
      next: (data) => {
        this.classrooms = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading classrooms:', err)
    });
  }

  searchStudents(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.cdr.detectChanges();
  }

  toggleStatus(student: any): void {
    const originalStatus = student.status;
    const newStatus = student.status === 'Active' ? 'Inactive' : 'Active';

    student.status = newStatus;

    this.studentService.updateStudent(student.id, student).subscribe({
      next: () => {
        this.displayNotification(`Status changed to ${newStatus}`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update status failed:', err);
        student.status = originalStatus; 
        this.displayNotification('Failed to update status on server', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  addStudent(name: string, birthDate: string, classroomId: string): void {
    if (!name || !birthDate || !classroomId) {
      this.displayNotification('Please fill all required fields', 'warning');
      return;
    }

    const newStudent = {
      Id: 0, 
      Name: name,
      BirthDate: birthDate,
      Status: 'Active',
      ClassroomId: parseInt(classroomId)
    };

    this.studentService.addStudent(newStudent).subscribe({
      next: () => {
        this.loadStudents(); 
        this.displayNotification('Student added successfully!', 'success');
      },
      error: (err) => {
        console.error('Add failed:', err);
        this.displayNotification('Failed to add student', 'error');
      }
    });
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.students = this.students.filter(s => s.id !== id);
        this.filteredStudents = this.filteredStudents.filter(s => s.id !== id);
        this.displayNotification('Student deleted successfully!', 'success');
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.displayNotification('Delete failed', 'error');
      }
    });
  }
}