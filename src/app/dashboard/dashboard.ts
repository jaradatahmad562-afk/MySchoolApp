import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './dashboard.html', 
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  
  totalTeachersCount: number = 12; 
  totalStudentsCount: number = 245;

  ngOnInit(): void {
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin';
  }
}