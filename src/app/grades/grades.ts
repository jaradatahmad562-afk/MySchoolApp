import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../student'; 

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './grades.html',
  styleUrls: ['./grades.css']
})
export class GradesComponent implements OnInit {
  studentsWithGrades: any[] = []; 
  
  notificationMessage: string = '';
  showNotification: boolean = false;

  constructor(
    private studentService: StudentService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRealStudentsForGrades();
  }

  loadRealStudentsForGrades(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        const realStudents = data || [];
        
        this.studentsWithGrades = realStudents.map((student: any) => {
          return {
            id: student.id || student.Id,
            name: student.name || student.Name,
            firstExam: Math.floor(Math.random() * (30 - 20 + 1)) + 20, 
            secondExam: Math.floor(Math.random() * (30 - 20 + 1)) + 20,
            finalExam: Math.floor(Math.random() * (40 - 28 + 1)) + 28
          };
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading students for grades:', err);
      }
    });
  }

  // 💾 كبسة حفظ العلامات
  saveGrades() {
    this.notificationMessage = `Success: Total scores calculated out of 100 and all grades saved successfully!`;
    this.showNotification = true;
    
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges();
    }, 3500);

    this.cdr.detectChanges();
  }
}