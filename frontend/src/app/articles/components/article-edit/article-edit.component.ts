import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Article, SingleArticleResponse, ArticleResponse } from '../../../core/models';

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
})
export class ArticleEditComponent implements OnInit {
  articleForm!: FormGroup;
  article: Article | null = null;
  articleId: string = '';
  isLoading = false;
  isLoadingArticle = false;
  errorMessage = '';
  canEdit = false;
  canPublish = false;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.canEdit = this.authService.hasPermission('edit');
    this.canPublish = this.authService.hasPermission('publish');

    if (!this.canEdit) {
      this.router.navigate(['/articles']);
      return;
    }

    this.articleId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadArticle();
  }

  private initializeForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
    });
  }

  private loadArticle(): void {
    this.isLoadingArticle = true;
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (response: SingleArticleResponse) => {
        if (response.success) {
          this.article = response.article;
          this.articleForm.patchValue({
            title: this.article.title,
            body: this.article.body,
            image: this.article.image || '',
          });
        }
        this.isLoadingArticle = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load article';
        this.isLoadingArticle = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid || !this.canEdit) {
      this.markFormGroupTouched(this.articleForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = {
      title: this.articleForm.value.title,
      body: this.articleForm.value.body,
      image: this.articleForm.value.image || null,
    };

    this.articleService
      .updateArticle(this.articleId, formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: ArticleResponse) => {
          if (response.success) {
            this.router.navigate(['/articles', this.articleId]);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to update article';
        },
      });
  }

  onTogglePublish(): void {
    if (!this.article || !this.canPublish) {
      return;
    }

    const newStatus = !this.article.isPublished;
    const action = newStatus ? 'publish' : 'unpublish';

    if (confirm(`Are you sure you want to ${action} this article?`)) {
      this.articleService.publishArticle(this.articleId, { isPublished: newStatus }).subscribe({
        next: (response: ArticleResponse) => {
          if (response.success && this.article) {
            this.article.isPublished = newStatus;
          }
        },
        error: (error: HttpErrorResponse) => {
          alert(error.error?.message || `Failed to ${action} article`);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/articles', this.articleId]);
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
