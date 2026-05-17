import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { StudentsComponent } from './students/students';
import { ClassroomComponent } from './classroom/classroom'; 
import { TeacherComponent } from './teacher/teacher'; 
import { ScheduleComponent } from './schedule/schedule';
import { SubjectComponent } from './subject/subject'; 
import { LoginComponent } from './login/login';
import { GradesComponent } from './grades/grades'; 
import { authGuard } from './auth.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  { path: 'students', component: StudentsComponent, canActivate: [authGuard] },
  
  { path: 'classrooms', component: ClassroomComponent, canActivate: [authGuard] }, 
  
  { path: 'teachers', component: TeacherComponent, canActivate: [authGuard] }, 
  
  { path: 'grades', component: GradesComponent, canActivate: [authGuard] }, 

  { path: 'schedule', component: ScheduleComponent, canActivate: [authGuard] },
  
  { path: 'subjects', component: SubjectComponent, canActivate: [authGuard] }, 
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];