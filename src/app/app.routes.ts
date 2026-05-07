import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { StudentsComponent } from './students/students';
import { ClassroomComponent } from './classroom/classroom'; 
import { TeacherComponent } from './teacher/teacher'; 
import { ScheduleComponent } from './schedule/schedule';
import { SubjectComponent } from './subject/subject'; 

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  
  { path: 'students', component: StudentsComponent },
  
  { path: 'classrooms', component: ClassroomComponent }, 
  
  { path: 'teachers', component: TeacherComponent }, 
  
  { path: 'schedule', component: ScheduleComponent },
  
  { path: 'subjects', component: SubjectComponent }, 
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  { path: '**', redirectTo: '/dashboard' }
];