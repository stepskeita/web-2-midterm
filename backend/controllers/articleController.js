const Article = require('../models/Article');

/**
 * Create a new article
 * POST /api/articles
 * Permission: create
 */
const createArticle = async (req, res) => {
  try {
    const { title, body, image } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and body'
      });
    }

    // Create article
    const article = await Article.create({
      title,
      body,
      image: image || null,
      author: req.user._id,
      isPublished: false
    });

    // Populate author details
    const populatedArticle = await Article.findById(article._id)
      .populate('author', 'fullName email profilePhoto');

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      article: populatedArticle
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating article',
      error: error.message
    });
  }
};

/**
 * Get all articles
 * GET /api/articles
 * Viewer sees only published articles
 * Others see all articles
 */
const getAllArticles = async (req, res) => {
  try {
    let query = {};

    // If user only has 'view' permission (Viewer role), show only published articles
    const hasOnlyViewPermission =
      req.user.permissions.length === 1 &&
      req.user.permissions.includes('view');

    if (hasOnlyViewPermission) {
      query.isPublished = true;
    }

    const articles = await Article.find(query)
      .populate('author', 'fullName email profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      articles: articles
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles',
      error: error.message
    });
  }
};

/**
 * Get single article by ID
 * GET /api/articles/:id
 * Viewer can only see published articles
 */
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id)
      .populate('author', 'fullName email profilePhoto');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if user is Viewer and article is not published
    const hasOnlyViewPermission =
      req.user.permissions.length === 1 &&
      req.user.permissions.includes('view');

    if (hasOnlyViewPermission && !article.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view published articles.'
      });
    }

    res.status(200).json({
      success: true,
      article: article
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article',
      error: error.message
    });
  }
};

/**
 * Update article
 * PUT /api/articles/:id
 * Permission: edit
 */
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, image } = req.body;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Update fields if provided
    if (title) article.title = title;
    if (body) article.body = body;
    if (image !== undefined) article.image = image;

    await article.save();

    const updatedArticle = await Article.findById(id)
      .populate('author', 'fullName email profilePhoto');

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      article: updatedArticle
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating article',
      error: error.message
    });
  }
};

/**
 * Delete article
 * DELETE /api/articles/:id
 * Permission: delete
 */
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting article',
      error: error.message
    });
  }
};

/**
 * Publish/Unpublish article
 * PATCH /api/articles/:id/publish
 * Permission: publish (Manager & SuperAdmin only)
 */
const togglePublishArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide isPublished as boolean'
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    article.isPublished = isPublished;
    await article.save();

    const updatedArticle = await Article.findById(id)
      .populate('author', 'fullName email profilePhoto');

    res.status(200).json({
      success: true,
      message: `Article ${isPublished ? 'published' : 'unpublished'} successfully`,
      article: updatedArticle
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating article publish status',
      error: error.message
    });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  togglePublishArticle
};
