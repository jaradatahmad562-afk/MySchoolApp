import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; 
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  localStorage = localStorage;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      console.log('Route changed, current URL:', this.router.url);
    });
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin';
  }

  isStudent(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Student';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
    console.log('Storage cleared successfully!');
    this.router.navigate(['/login']);
  }
}