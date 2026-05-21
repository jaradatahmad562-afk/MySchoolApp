import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './classroom.html',
  styleUrl: './classroom.css'
})
export class ClassroomComponent implements OnInit {

  classrooms: any[] = [];
  searchTerm: string = ''; 
  private apiUrl = 'https://localhost:7264/api/Classroom'; 
  private studentsApiUrl = 'https://localhost:7264/api/Student'; 

  classroomForm!: FormGroup;

  selectedClassroomId: number | null = null;
  selectedClassroomName: string = '';
  newStudent = { name: '', birthDate: '', classroomId: 0 };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { } 

  ngOnInit() {
    this.loadClassrooms(); 
    this.classroomForm = new FormGroup({
      name: new FormControl('', Validators.required),
      capacity: new FormControl('', [Validators.required, Validators.min(1)]),
      status: new FormControl('Available')
    });
  }

  get filteredClassrooms() {
    return this.classrooms.filter(room => 
      room.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      room.id.toString().includes(this.searchTerm)
    );
  }

  get availableCount(): number {
    return this.classrooms.filter(room => 
      room.status?.toLowerCase() === 'available'
    ).length;
  }

  loadClassrooms() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data: any) => {
        this.classrooms = data.map((room: any) => ({ ...room })); 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => console.error('Error loading classrooms:', err)
    });
  }

  openAddStudentForm(classId: number, className: string) {
    this.selectedClassroomId = classId;
    this.selectedClassroomName = className;
    this.newStudent.classroomId = classId;
    this.newStudent.name = '';
    this.newStudent.birthDate = '';
  }

  submitStudent() {
    if (!this.newStudent.name || !this.newStudent.birthDate) {
      alert('Please fill in all student details!');
      return;
    }

    const targetRoom = this.classrooms.find(r => r.id === this.newStudent.classroomId);

    if (targetRoom) {
      const currentEnrolled = targetRoom.studentsCount || 0;
      const maxCapacity = targetRoom.capacity || 0;

      // Business rule: Prevent overload
      if (currentEnrolled >= maxCapacity) {
        alert(`Operation denied! Classroom (${targetRoom.name}) is full. Maximum capacity is ${maxCapacity} students.`);
        return;
      }
    }

    const studentPayload = {
      name: this.newStudent.name,
      birthDate: this.newStudent.birthDate,
      classroomId: Number(this.newStudent.classroomId), 
      status: 'Active',
      email: `${this.newStudent.name.replace(/\s+/g, '').toLowerCase()}${Math.floor(100 + Math.random() * 900)}@school.com`,
      password: 'StudentPassword123'
    };

    this.http.post(this.studentsApiUrl, studentPayload).subscribe({
      next: () => {
        alert(`Student successfully assigned to classroom: ${this.selectedClassroomName}`);
        this.loadClassrooms(); 
        this.selectedClassroomId = null; 
      },
      error: (err) => {
        console.error('Failed to add student:', err);
        alert('An error occurred while adding the student. Please check server logs and permissions.');
      }
    });
  }

  toggleStatus(room: any) {
    const roomId = room.id;
    const isAvailable = room.status?.toLowerCase() === 'available';
    const newStatus = isAvailable ? 'Occupied' : 'Available';
    
    const updatedRoom = { ...room, status: newStatus };

    this.http.put(`${this.apiUrl}/${roomId}`, updatedRoom).subscribe({
      next: () => {
        this.classrooms = this.classrooms.map(r => 
          r.id === roomId ? { ...r, status: newStatus } : r
        );
        this.cdr.detectChanges(); 
      },
      error: (err: any) => console.error('Update status failed:', err)
    });
  }

  addClassroom() {
    if (this.classroomForm.valid) {
      const classroomData = {
        name: this.classroomForm.value.name,
        capacity: Number(this.classroomForm.value.capacity),
        status: this.classroomForm.value.status || 'Available'
      };

      this.http.post(this.apiUrl, classroomData).subscribe({
        next: () => {
          this.loadClassrooms(); 
          this.classroomForm.reset({ status: 'Available' });
        },
        error: (err) => console.error('Add classroom failed:', err)
      });
    }
  }

  deleteRoom(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.classrooms = this.classrooms.filter(r => r.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete classroom failed:', err);
        if (err.status === 400) {
          alert(err.error || 'Cannot delete classroom because it contains enrolled students!');
        } else {
          alert('An error occurred while trying to delete the classroom.');
        }
      }
    });
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}