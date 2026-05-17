import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject.html',
  styleUrls: ['./subject.css']
})
export class SubjectComponent implements OnInit {
  subjects: any[] = [];
  filteredSubjects: any[] = [];
  searchTerm: string = ''; 

  newSubject = { title: '', credits: 0 };
  private apiUrl = 'https://localhost:7264/api/Subject'; 

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllSubjects();
  }

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

  getAllSubjects() {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
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
    const subjectToSave = {
      title: this.newSubject.title,
      credits: Number(this.newSubject.credits)
    };

    if (subjectToSave.title && subjectToSave.credits > 0) {
      this.http.post(this.apiUrl, subjectToSave, this.getAuthHeaders()).subscribe({
        next: () => {
          this.getAllSubjects(); 
          this.newSubject = { title: '', credits: 0 }; 
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Add failed!", err);
        }
      });
    }
  }

  deleteSubject(id: number) {
    const originalSubjects = [...this.subjects];
    this.subjects = this.subjects.filter(s => s.id !== id);
    this.filteredSubjects = [...this.subjects];

    this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders()).subscribe({
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