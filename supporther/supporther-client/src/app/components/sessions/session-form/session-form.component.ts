import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { CategoryService } from '../../../services/category.service';
import { SupportCategory } from '../../../models/category.model';
import { SupportSession } from '../../../models/session.model';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss']
})
export class SessionFormComponent implements OnInit {
  sessionForm: FormGroup;
  categories: SupportCategory[] = [];
  mentors: User[] = [];
  isLoading = false;
  isSubmitting = false;
  error = '';
  success = '';
  isEditMode = false;
  sessionId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sessionForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category_id: [null, [Validators.required]],
      mentor_id: [null, [Validators.required]],
      scheduled_time: ['', [Validators.required]],
      duration_minutes: [60, [Validators.required, Validators.min(15)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    
    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.sessionId = +id;
        this.loadSessionData(+id);
      }
    });
    
    // Load categories regardless of mode
    this.loadCategories();
    
    // Load mentors (simulating mentor list - in a real app, you'd have a service for this)
    this.mentors = [
      { id: 1, username: 'mentor1', email: 'mentor1@example.com', first_name: 'Jane', last_name: 'Doe' },
      { id: 2, username: 'mentor2', email: 'mentor2@example.com', first_name: 'John', last_name: 'Smith' },
      { id: 3, username: 'mentor3', email: 'mentor3@example.com', first_name: 'Maria', last_name: 'Garcia' }
    ];
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories.';
        this.isLoading = false;
      }
    });
  }

  loadSessionData(sessionId: number): void {
    this.isLoading = true;
    this.sessionService.getSessionById(sessionId).subscribe({
      next: (session) => {
        // Format date for input
        const scheduledDate = new Date(session.scheduled_time);
        const formattedDate = scheduledDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
        
        // Patch form values
        this.sessionForm.patchValue({
          title: session.title,
          description: session.description,
          category_id: session.category_id,
          mentor_id: session.mentor_id,
          scheduled_time: formattedDate,
          duration_minutes: session.duration_minutes,
          notes: session.notes
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading session:', error);
        this.error = 'Failed to load session data.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.error = '';
    this.success = '';
    
    if (this.isEditMode && this.sessionId) {
      // Update existing session
      this.sessionService.updateSession(this.sessionId, this.sessionForm.value).subscribe({
        next: () => {
          this.success = 'Session updated successfully!';
          this.isSubmitting = false;
          
          // Navigate after a short delay
          setTimeout(() => {
            this.router.navigate(['/sessions', this.sessionId]);
          }, 1500);
        },
        error: (error) => {
          console.error('Error updating session:', error);
          this.error = 'Failed to update session. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new session
      this.sessionService.createSession(this.sessionForm.value).subscribe({
        next: (newSession) => {
          this.success = 'Session scheduled successfully!';
          this.isSubmitting = false;
          
          // Navigate after a short delay
          setTimeout(() => {
            this.router.navigate(['/sessions', newSession.id]);
          }, 1500);
        },
        error: (error) => {
          console.error('Error creating session:', error);
          this.error = 'Failed to schedule session. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  get title() { return this.sessionForm.get('title'); }
  get description() { return this.sessionForm.get('description'); }
  get category_id() { return this.sessionForm.get('category_id'); }
  get mentor_id() { return this.sessionForm.get('mentor_id'); }
  get scheduled_time() { return this.sessionForm.get('scheduled_time'); }
  get duration_minutes() { return this.sessionForm.get('duration_minutes'); }
}
