import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <span class="logo-text">SupportHer</span>
            <p>Women's Support Platform</p>
          </div>
          <div class="footer-links">
            <ul>
              <li><a routerLink="/dashboard">Home</a></li>
              <li><a routerLink="/resources">Resources</a></li>
              <li><a routerLink="/sessions">Support Sessions</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} SupportHer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #343a40;
      color: white;
      padding: 2rem 0 1rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    
    .footer-logo {
      margin-bottom: 1rem;
    }
    
    .footer-logo .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #e83e8c;
    }
    
    .footer-logo p {
      margin-top: 0.5rem;
      opacity: 0.7;
    }
    
    .footer-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links li {
      margin-bottom: 0.5rem;
    }
    
    .footer-links a {
      color: white;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-links a:hover {
      color: #e83e8c;
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1rem;
      text-align: center;
    }
    
    .footer-bottom p {
      font-size: 0.875rem;
      opacity: 0.7;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}