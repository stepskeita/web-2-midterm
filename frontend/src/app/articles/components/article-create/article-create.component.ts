import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ArticleResponse } from '../../../core/models';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css'],
})
export class ArticleCreateComponent implements OnInit {
  articleForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  canCreate = false;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.canCreate = this.authService.hasPermission('create');

    if (!this.canCreate) {
      this.router.navigate(['/articles']);
      return;
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid || !this.canCreate) {
      this.markFormGroupTouched(this.articleForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = {
      title: this.articleForm.value.title,
      body: this.articleForm.value.body,
      ...(this.articleForm.value.image && { image: this.articleForm.value.image }),
    };

    this.articleService
      .createArticle(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: ArticleResponse) => {
          if (response.success) {
            this.router.navigate(['/articles', response.article._id]);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to create article';
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/articles']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get title() {
    return this.articleForm.get('title');
  }

  get body() {
    return this.articleForm.get('body');
  }

  get image() {
    return this.articleForm.get('image');
  }
}
