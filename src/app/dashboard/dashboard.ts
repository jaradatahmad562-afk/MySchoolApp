import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 1. استيراد المكتبة الخاصة بالتنقل

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink], // 2. إضافة RouterLink هون عشان الـ HTML يتعرف على الكبسات
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent { 
  // كود الـ Logic الخاص بالداشبورد بكون هون مستقبلاً
}