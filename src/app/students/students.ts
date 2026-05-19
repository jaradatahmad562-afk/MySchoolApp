import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { StudentService } from '../student'; 

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  classrooms: any[] = [];
  
  newStudentEmail: string = '';
  newStudentPassword: string = '';

  notificationMessage: string = '';
  showNotification: boolean = false;
  notificationType: 'success' | 'error' | 'warning' = 'success';

  private classroomApiUrl = 'https://localhost:7264/api/Classroom';

  constructor(
    private studentService: StudentService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

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

  get totalStudents(): number {
    return this.students.length;
  }

  get activeStudentsCount(): number {
    return this.students.filter(s => {
      const currentStatus = s.status || s.Status || '';
      return currentStatus.toString().toLowerCase() === 'active';
    }).length;
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadClassrooms(); 
  }

  displayNotification(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    document.title = message; 
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
        this.students = data || []; 
        this.filteredStudents = [...this.students];
        this.cdr.detectChanges(); 
      },   
      error: (err) => {
        console.error('Error loading students:', err);
        this.displayNotification('Error loading students list', 'error');
      }
    });
  }

  loadClassrooms(): void {
    this.http.get<any[]>(this.classroomApiUrl, this.getAuthHeaders()).subscribe({
      next: (data) => {
        this.classrooms = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading classrooms:', err)
    });
  }

  searchStudents(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student => {
        const studentName = student.name || student.Name || '';
        return studentName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    this.cdr.detectChanges();
  }

  toggleStatus(student: any): void {
    if (!student) return;

    const currentStatus = student.status || student.Status || 'Active';
    const newStatus = currentStatus.toString().toLowerCase() === 'active' ? 'Inactive' : 'Active';

    student.status = newStatus;
    student.Status = newStatus;

    this.studentService.updateStudent(student.id || student.Id, student).subscribe({
      next: () => {
        this.displayNotification(`Status changed to ${newStatus}`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update status failed:', err);
        student.status = currentStatus; 
        student.Status = currentStatus; 
        this.displayNotification('Failed to update status on server', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  addStudent(name: string, birthDate: string, classroomId: string, 
             nameInput: HTMLInputElement, dateInput: HTMLInputElement, classSelect: HTMLSelectElement): void {
             
    if (!name || !birthDate || !classroomId || !this.newStudentEmail || !this.newStudentPassword) {
      this.displayNotification('Please fill all required fields, including email and password', 'warning');
      return;
    }

    const newStudent = {
      Id: 0, 
      Name: name,
      BirthDate: birthDate,
      Status: 'Active',
      ClassroomId: parseInt(classroomId),
      Email: this.newStudentEmail,       
      Password: this.newStudentPassword  
    };

    this.studentService.addStudent(newStudent).subscribe({
      next: () => {
        this.loadStudents(); 
        this.displayNotification('Student and user account created successfully!', 'success');
        
        nameInput.value = '';
        dateInput.value = '';
        classSelect.value = '';
        this.newStudentEmail = '';
        this.newStudentPassword = '';
        
        this.cdr.detectChanges(); 
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
        this.students = this.students.filter(s => (s.id || s.Id) !== id);
        this.filteredStudents = this.filteredStudents.filter(s => (s.id || s.Id) !== id);
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