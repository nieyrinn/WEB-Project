import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="not-found">
      <div class="container">
        <div class="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <a routerLink="/" class="btn-primary">Go to Homepage</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 140px);
      background-color: #f8f9fa;
    }
    
    .not-found-content {
      text-align: center;
      padding: 3rem;
      max-width: 600px;
      
      h1 {
        font-size: 6rem;
        color: #e83e8c;
        margin-bottom: 1rem;
      }
      
      h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #343a40;
      }
      
      p {
        font-size: 1.1rem;
        color: #6c757d;
        margin-bottom: 2rem;
      }
      
      .btn-primary {
        display: inline-block;
        background-color: #e83e8c;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: #e83e8c;
        }
      }
    }
  `]
})
export class NotFoundComponent {}