const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  addComment,
  updateBugStatus,
  getBugsByStatus,
  getBugStats
} = require('../controllers/bugController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array().map(err => err.msg).join(', ')
    });
  }
  next();
};

// Validation rules
const bugValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Status must be one of: open, in-progress, resolved, closed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be one of: low, medium, high, critical'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be one of: low, medium, high, critical'),
  body('reporter')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Reporter name is required'),
  body('assignedTo')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Assigned to cannot be empty if provided'),
  body('stepsToReproduce')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Steps to reproduce cannot exceed 500 characters'),
  body('expectedBehavior')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Expected behavior cannot exceed 300 characters'),
  body('actualBehavior')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Actual behavior cannot exceed 300 characters'),
  body('environment')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Environment cannot exceed 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Tag cannot be empty')
];

const commentValidation = [
  body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author name is required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment content must be between 1 and 500 characters')
];

const statusValidation = [
  body('status')
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Status must be one of: open, in-progress, resolved, closed')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid bug ID format')
];

const queryValidation = [
  query('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority filter'),
  query('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity filter'),
  query('sort')
    .optional()
    .matches(/^[+-]?(title|description|status|priority|severity|createdAt|updatedAt)$/)
    .withMessage('Invalid sort field'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

// Routes
router.get('/', queryValidation, handleValidationErrors, getBugs);
router.get('/stats', getBugStats);
router.get('/status/:status', getBugsByStatus);
router.get('/:id', idValidation, handleValidationErrors, getBug);

router.post('/', bugValidation, handleValidationErrors, createBug);
router.post('/:id/comments', [...idValidation, ...commentValidation], handleValidationErrors, addComment);

router.put('/:id', [...idValidation, ...bugValidation], handleValidationErrors, updateBug);
router.patch('/:id/status', [...idValidation, ...statusValidation], handleValidationErrors, updateBugStatus);

router.delete('/:id', idValidation, handleValidationErrors, deleteBug);

module.exports = router;