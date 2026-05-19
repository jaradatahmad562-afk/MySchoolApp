import { Routes, Router } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { StudentsComponent } from './students/students';
import { ClassroomComponent } from './classroom/classroom'; 
import { TeacherComponent } from './teacher/teacher'; 
import { ScheduleComponent } from './schedule/schedule';
import { SubjectComponent } from './subject/subject'; 
import { LoginComponent } from './login/login';
import { GradesComponent } from './grades/grades'; 
import { StudentDashboardComponent } from './student-dashboard/student-dashboard';
import { authGuard } from './auth.guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [
      authGuard, 
      () => {
        const role = localStorage.getItem('role');
        const router = inject(Router);
        if (role === 'Student') { router.navigate(['/student-dashboard']); return false; }
        return true;
      }
    ] 
  },
  
  { 
    path: 'student-dashboard', 
    component: StudentDashboardComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role !== 'Student') { inject(Router).navigate(['/dashboard']); return false; }
      return true;
    }] 
  }, 
  { 
    path: 'my-profile', 
    component: StudentDashboardComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role !== 'Student') { inject(Router).navigate(['/dashboard']); return false; }
      return true;
    }] 
  },
  { 
    path: 'my-grades', 
    component: StudentDashboardComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role !== 'Student') { inject(Router).navigate(['/dashboard']); return false; }
      return true;
    }] 
  },
  { 
    path: 'my-schedule', 
    component: StudentDashboardComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role !== 'Student') { inject(Router).navigate(['/dashboard']); return false; }
      return true;
    }] 
  },
  
  { 
    path: 'students', 
    component: StudentsComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role === 'Student') { inject(Router).navigate(['/student-dashboard']); return false; }
      return true;
    }] 
  },
  { 
    path: 'classrooms', 
    component: ClassroomComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role === 'Student') { inject(Router).navigate(['/student-dashboard']); return false; }
      return true;
    }] 
  }, 
  { 
    path: 'teachers', 
    component: TeacherComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role === 'Student') { inject(Router).navigate(['/student-dashboard']); return false; }
      return true;
    }] 
  }, 
  { 
    path: 'grades', 
    component: GradesComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role === 'Student') { inject(Router).navigate(['/student-dashboard']); return false; }
      return true;
    }] 
  }, 
  { 
    path: 'schedule', 
    component: ScheduleComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role === 'Student') { inject(Router).navigate(['/student-dashboard']); return false; }
      return true;
    }] 
  },
  { 
    path: 'subjects', 
    component: SubjectComponent, 
    canActivate: [authGuard, () => {
      const role = localStorage.getItem('role');
      if (role === 'Student') { inject(Router).navigate(['/student-dashboard']); return false; }
      return true;
    }] 
  }, 
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];