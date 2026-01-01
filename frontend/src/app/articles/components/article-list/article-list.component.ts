import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Article, ArticlesResponse, ArticleResponse } from '../../../core/models';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  isLoading = false;
  errorMessage = '';

  // User permissions
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canPublish = false;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.loadArticles();
  }

  private checkPermissions(): void {
    this.canCreate = this.authService.hasPermission('create');
    this.canEdit = this.authService.hasPermission('edit');
    this.canDelete = this.authService.hasPermission('delete');
    this.canPublish = this.authService.hasPermission('publish');
  }

  private loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Backend automatically filters based on user permissions
    // Viewer sees only published articles, others see all
    this.articleService
      .getArticles()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          console.log('Articles loading complete. Count:', this.articles.length);
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: ArticlesResponse) => {
          console.log('Articles response:', response);
          if (response && response.success && response.articles) {
            this.articles = response.articles;
          } else if (response && response.articles) {
            // Handle case where success field might be missing
            this.articles = response.articles;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Articles error:', error);
          this.errorMessage = error.error?.message || 'Failed to load articles';
        },
      });
  }

  onCreateArticle(): void {
    this.router.navigate(['/articles/create']);
  }

  onEditArticle(id: string): void {
    this.router.navigate(['/articles', id, 'edit']);
  }

  onTogglePublish(article: Article): void {
    if (!this.canPublish) {
      return;
    }

    const newStatus = !article.isPublished;
    const action = newStatus ? 'publish' : 'unpublish';

    if (confirm(`Are you sure you want to ${action} this article?`)) {
      this.articleService.publishArticle(article._id, { isPublished: newStatus }).subscribe({
        next: (response: ArticleResponse) => {
          if (response.success) {
            // Update article in list
            article.isPublished = newStatus;
            alert(`Article ${action}ed successfully!`);
          }
        },
        error: (error: HttpErrorResponse) => {
          alert(error.error?.message || `Failed to ${action} article`);
        },
      });
    }
  }

  onDeleteArticle(article: Article): void {
    if (!this.canDelete) {
      return;
    }

    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      this.articleService.deleteArticle(article._id).subscribe({
        next: (response: { success: boolean; message: string }) => {
          if (response.success) {
            // Remove article from list
            this.articles = this.articles.filter((a) => a._id !== article._id);
            alert('Article deleted successfully!');
          }
        },
        error: (error: HttpErrorResponse) => {
          alert(error.error?.message || 'Failed to delete article');
        },
      });
    }
  }

  getStatusBadgeClass(isPublished: boolean): string {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  }

  getStatusText(isPublished: boolean): string {
    return isPublished ? 'Published' : 'Draft';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
