import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './subject.html',
  styleUrls: ['./subject.css']
})
export class SubjectComponent implements OnInit {
  subjects: any[] = [];
  filteredSubjects: any[] = [];
  searchTerm: string = ''; 

  // شلنا الـ teacherId من هون عشان يصير الفورم بس للعنوان والساعات
  newSubject = { title: '', credits: 0 };
  
  private apiUrl = 'https://localhost:7264/api/Subject'; 

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllSubjects();
  }

  getAllSubjects() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.subjects = data || [];
        this.filteredSubjects = [...this.subjects]; 
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Fetch error:', err)
    });
  }

  searchSubjects() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredSubjects = [...this.subjects];
    } else {
      this.filteredSubjects = this.subjects.filter(s => 
        s.title?.toLowerCase().includes(term)
      );
    }
    this.cdr.detectChanges();
  }

  addSubject() {
    // هسا بنبعث بس الـ Title والـ Credits
    // الـ API بالباك إند رح يحط الـ TeacherId من عنده NULL تلقائياً
    const subjectToSave = {
      title: this.newSubject.title,
      credits: Number(this.newSubject.credits)
    };

    if (subjectToSave.title && subjectToSave.credits > 0) {
      this.http.post(this.apiUrl, subjectToSave).subscribe({
        next: () => {
          this.getAllSubjects(); 
          this.newSubject = { title: '', credits: 0 }; // تصفير الفورم
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("الإضافة فشلت! تأكد إنك عدلت الـ Model في الباك إند ليكون الـ TeacherId اختياري (?)", err);
        }
      });
    }
  }

  deleteSubject(id: number) {
    const originalSubjects = [...this.subjects];
    this.subjects = this.subjects.filter(s => s.id !== id);
    this.filteredSubjects = [...this.subjects];

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        console.log(`Subject with ID ${id} deleted`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete failed!', err);
        this.subjects = originalSubjects;
        this.filteredSubjects = [...this.subjects];
        this.cdr.detectChanges();
      }
    });
  }
}