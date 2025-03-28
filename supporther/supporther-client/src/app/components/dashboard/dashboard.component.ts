import { Component, OnInit } from '@angular/core';
import { SupportCategory } from '../../models/category.model';
import { Resource } from '../../models/resource.model';
import { SupportSession } from '../../models/session.model';
import { CategoryService } from '../../services/category.service';
import { ResourceService } from '../../services/resource.service';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  categories: SupportCategory[] = [];
  featuredResources: Resource[] = [];
  upcomingSessions: SupportSession[] = [];
  isLoading = true;
  error = '';
  selectedCategory: SupportCategory | null = null;

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private resourceService: ResourceService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        
        // After loading categories, load other data
        this.loadResources();
        this.loadSessions();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load support categories. Please try refreshing the page.';
        this.isLoading = false;
      }
    });
  }

  loadResources(): void {
    this.resourceService.getAllResources().subscribe({
      next: (resources) => {
        // Get the most recent resources (up to 3)
        this.featuredResources = resources
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading resources:', error);
      }
    });
  }

  loadSessions(): void {
    this.sessionService.getUserSessions().subscribe({
      next: (sessions) => {
        // Get upcoming sessions (sessions with scheduled status and future date)
        const now = new Date();
        this.upcomingSessions = sessions
          .filter(session => 
            session.status === 'scheduled' && 
            new Date(session.scheduled_time) > now
          )
          .sort((a, b) => 
            new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
          )
          .slice(0, 3);
          
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.isLoading = false;
      }
    });
  }

  selectCategory(category: SupportCategory): void {
    this.selectedCategory = category;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
