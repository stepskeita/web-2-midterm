import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ArticlesResponse,
  ArticleResponse,
  SingleArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
  PublishArticleRequest,
} from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly API_URL = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  /**
   * Get all articles
   * Backend automatically filters based on user permissions:
   * - Viewer sees only published articles
   * - Others see all articles
   */
  getArticles(): Observable<ArticlesResponse> {
    return this.http.get<ArticlesResponse>(this.API_URL);
  }

  /**
   * Get single article by ID
   */
  getArticleById(id: string): Observable<SingleArticleResponse> {
    return this.http.get<SingleArticleResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Create a new article
   * Requires 'create' permission
   */
  createArticle(data: CreateArticleRequest): Observable<ArticleResponse> {
    return this.http.post<ArticleResponse>(this.API_URL, data);
  }

  /**
   * Update an existing article
   * Requires 'edit' permission
   */
  updateArticle(id: string, data: UpdateArticleRequest): Observable<ArticleResponse> {
    return this.http.put<ArticleResponse>(`${this.API_URL}/${id}`, data);
  }

  /**
   * Delete an article
   * Requires 'delete' permission
   */
  deleteArticle(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }

  /**
   * Publish or unpublish an article
   * Requires 'publish' permission (Manager & SuperAdmin only)
   */
  publishArticle(id: string, data: PublishArticleRequest): Observable<ArticleResponse> {
    return this.http.patch<ArticleResponse>(`${this.API_URL}/${id}/publish`, data);
  }
}
