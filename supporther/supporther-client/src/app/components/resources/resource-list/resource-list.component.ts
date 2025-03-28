import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../../services/resource.service';
import { CategoryService } from '../../../services/category.service';
import { Resource } from '../../../models/resource.model';
import { SupportCategory } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  resources: Resource[] = [];
  categories: SupportCategory[] = [];
  isLoading = true;
  error = '';
  filterForm: FormGroup;
  selectedCategory: number | null = null;
  searchQuery = '';

  constructor(
    private resourceService: ResourceService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      category: [null],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadResources();

    // Subscribe to form value changes
    this.filterForm.get('category')?.valueChanges.subscribe(value => {
      this.selectedCategory = value;
      this.applyFilters();
    });

    this.filterForm.get('search')?.valueChanges.subscribe(value => {
      this.searchQuery = value;
      this.applyFilters();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories.';
      }
    });
  }

  loadResources(): void {
    this.isLoading = true;
    this.resourceService.getAllResources().subscribe({
      next: (resources) => {
        this.resources = resources;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading resources:', error);
        this.error = 'Failed to load resources.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.selectedCategory) {
      this.isLoading = true;
      this.resourceService.getResourcesByCategory(this.selectedCategory).subscribe({
        next: (resources) => {
          this.resources = resources.filter(resource => 
            this.matchesSearchQuery(resource)
          );
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error filtering resources by category:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.resourceService.getAllResources().subscribe({
        next: (resources) => {
          this.resources = resources.filter(resource => 
            this.matchesSearchQuery(resource)
          );
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading all resources:', error);
          this.isLoading = false;
        }
      });
    }
  }

  matchesSearchQuery(resource: Resource): boolean {
    if (!this.searchQuery) return true;
    
    const query = this.searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) || 
      resource.description.toLowerCase().includes(query) ||
      resource.category_name.toLowerCase().includes(query)
    );
  }

  clearFilters(): void {
    this.filterForm.reset({
      category: null,
      search: ''
    });
    this.loadResources();
  }
}
