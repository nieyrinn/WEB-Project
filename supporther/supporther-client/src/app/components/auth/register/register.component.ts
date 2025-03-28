import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    const registrationData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      first_name: this.registerForm.value.firstName,
      last_name: this.registerForm.value.lastName
    };

    this.authService.register(registrationData).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = 'Registration successful! You can now login.';
          setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error.error && typeof error.error === 'object') {
          let errorMsg = '';
          for (const key in error.error) {
            if (error.error.hasOwnProperty(key)) {
              errorMsg += `${key}: ${error.error[key]} `;
            }
          }
          this.error = errorMsg || 'Registration failed. Please check your information.';
        } else {
          this.error = error.message || 'Registration failed. Please try again.';
        }
      }
    });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get agreeToTerms() { return this.registerForm.get('agreeToTerms'); }
}