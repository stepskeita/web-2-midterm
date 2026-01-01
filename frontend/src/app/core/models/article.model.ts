export interface Article {
  _id: string;
  title: string;
  body: string;
  image: string | null;
  isPublished: boolean;
  author: {
    _id: string;
    fullName: string;
    email: string;
    profilePhoto: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  success: boolean;
  count: number;
  articles: Article[];
}

export interface ArticleResponse {
  success: boolean;
  message: string;
  article: Article;
}

export interface SingleArticleResponse {
  success: boolean;
  article: Article;
}

export interface CreateArticleRequest {
  title: string;
  body: string;
  image?: string;
}

export interface UpdateArticleRequest {
  title?: string;
  body?: string;
  image?: string;
}

export interface PublishArticleRequest {
  isPublished: boolean;
}
