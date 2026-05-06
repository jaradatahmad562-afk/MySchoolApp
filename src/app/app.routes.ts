import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { StudentsComponent } from './students/students';
import { ClassroomComponent } from './classroom/classroom'; 
import { TeacherComponent } from './teacher/teacher'; 
// 1. استيراد المكون الجديد للمواد
import { SubjectComponent } from './subject/subject'; 

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'classrooms', component: ClassroomComponent }, 
  { path: 'teachers', component: TeacherComponent }, 
  // 2. إضافة مسار صفحة المواد (Subjects)
  { path: 'subject', component: SubjectComponent }, 
  
  // المسار الافتراضي
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // مسار "Catch-all" في حال كتب اليوزر مسار غلط يرجعه للداشبورد
  { path: '**', redirectTo: '/dashboard' }
];