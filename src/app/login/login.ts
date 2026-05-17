import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginUrl = 'https://localhost:7264/api/Auth/login'; 

    this.http.post<any>(loginUrl, this.loginData).subscribe({
      next: (response) => {
        if (response && response.token) {
          // 1. Store the token
          localStorage.setItem('token', response.token);
          
          let userRole = 'Teacher'; 

          try {
            const decodedToken: any = jwtDecode(response.token);
            
            userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Teacher';
            
            localStorage.setItem('role', userRole);
            
            console.log('Login successful! Current role:', userRole);
          } catch (error) {
            console.error('Failed to decode JWT token:', error);
            localStorage.setItem('role', 'Teacher'); 
          }

          if (userRole === 'Admin') {
            this.router.navigate(['/dashboard']); 
          } else if (userRole === 'Teacher') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/dashboard']); 
          }

        } else {
          this.errorMessage = 'Token was not received correctly from the server.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password.';
        console.error(err);
      }
    });
  }
}