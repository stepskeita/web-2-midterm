const express = require('express');
const router = express.Router();
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  togglePublishArticle
} = require('../controllers/articleController');
const auth = require('../middleware/auth');
const requirePermission = require('../middleware/requirePermission');

// @route   GET /api/articles
// @desc    Get all articles (Viewer sees only published, others see all)
// @access  Private (requires view permission)
router.get('/', auth, requirePermission('view'), getAllArticles);

// @route   GET /api/articles/:id
// @desc    Get single article by ID
// @access  Private (requires view permission)
router.get('/:id', auth, requirePermission('view'), getArticleById);

// @route   POST /api/articles
// @desc    Create a new article
// @access  Private (requires create permission)
router.post('/', auth, requirePermission('create'), createArticle);

// @route   PUT /api/articles/:id
// @desc    Update article
// @access  Private (requires edit permission)
router.put('/:id', auth, requirePermission('edit'), updateArticle);

// @route   PATCH /api/articles/:id/publish
// @desc    Publish/Unpublish article
// @access  Private (requires publish permission - Manager & SuperAdmin only)
router.patch('/:id/publish', auth, requirePermission('publish'), togglePublishArticle);

// @route   DELETE /api/articles/:id
// @desc    Delete article
// @access  Private (requires delete permission)
router.delete('/:id', auth, requirePermission('delete'), deleteArticle);

module.exports = router;
