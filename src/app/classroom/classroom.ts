import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule], 
  templateUrl: './classroom.html',
  styleUrl: './classroom.css'
})
export class ClassroomComponent implements OnInit {

  classrooms: any[] = [];
  searchTerm: string = ''; 
  private apiUrl = 'https://localhost:7264/api/Classroom'; 

  classroomForm!: FormGroup;

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

  // التعديل هنا لحل مشكلة "تغيير سطر بدلاً من سطر آخر"
  toggleStatus(room: any) {
    // 1. تحديد الـ ID والحالة الجديدة قبل أي شيء
    const roomId = room.id;
    const isAvailable = room.status?.toLowerCase() === 'available';
    const newStatus = isAvailable ? 'Occupied' : 'Available';
    
    // 2. تجهيز البيانات للإرسال
    const updatedRoom = { ...room, status: newStatus };

    this.http.put(`${this.apiUrl}/${roomId}`, updatedRoom).subscribe({
      next: () => {
        // 3. التحديث الجراحي: نبحث عن الـ ID داخل المصفوفة الأصلية (this.classrooms)
        // هذا يضمن أنه حتى مع وجود فلتر بحث، التعديل سيصيب العنصر الصحيح حصراً
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
        error: (err) => console.error('Add failed:', err)
      });
    }
  }

  deleteRoom(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.classrooms = this.classrooms.filter(r => r.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}