const Bug = require('../models/Bug');

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = async (req, res, next) => {
  try {
    console.log('🔍 Fetching bugs with query:', req.query); // Debug log

    const { status, priority, severity, search, sort = '-createdAt', limit = 10, page = 1 } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;

    if (search) {
      query.$text = { $search: search };
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const bugs = await Bug.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get total count for pagination
    const total = await Bug.countDocuments(query);

    console.log(`✅ Found ${bugs.length} bugs out of ${total} total`); // Debug log

    res.status(200).json({
      success: true,
      count: bugs.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: bugs
    });
  } catch (error) {
    console.error('❌ Error fetching bugs:', error); // Debug log
    next(error);
  }
};

// @desc    Get single bug
// @route   GET /api/bugs/:id
// @access  Public
const getBug = async (req, res, next) => {
  try {
    console.log('🔍 Fetching bug with ID:', req.params.id); // Debug log

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      console.log('❌ Bug not found with ID:', req.params.id); // Debug log
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    console.log('✅ Bug found:', bug.title); // Debug log

    res.status(200).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('❌ Error fetching bug:', error); // Debug log
    next(error);
  }
};

// @desc    Create new bug
// @route   POST /api/bugs
// @access  Public
const createBug = async (req, res, next) => {
  try {
    console.log('📝 Creating new bug with data:', req.body); // Debug log

    const bug = await Bug.create(req.body);

    console.log('✅ Bug created successfully:', bug._id); // Debug log

    res.status(201).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('❌ Error creating bug:', error); // Debug log

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    next(error);
  }
};

// @desc    Update bug
// @route   PUT /api/bugs/:id
// @access  Public
const updateBug = async (req, res, next) => {
  try {
    console.log('🔄 Updating bug with ID:', req.params.id); // Debug log
    console.log('📝 Update data:', req.body); // Debug log

    let bug = await Bug.findById(req.params.id);

    if (!bug) {
      console.log('❌ Bug not found for update:', req.params.id); // Debug log
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    console.log('✅ Bug updated successfully:', bug._id); // Debug log

    res.status(200).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('❌ Error updating bug:', error); // Debug log
    next(error);
  }
};

// @desc    Delete bug
// @route   DELETE /api/bugs/:id
// @access  Public
const deleteBug = async (req, res, next) => {
  try {
    console.log('🗑️ Deleting bug with ID:', req.params.id); // Debug log

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      console.log('❌ Bug not found for deletion:', req.params.id); // Debug log
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    await bug.deleteOne();

    console.log('✅ Bug deleted successfully:', req.params.id); // Debug log

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('❌ Error deleting bug:', error); // Debug log
    next(error);
  }
};

// @desc    Add comment to bug
// @route   POST /api/bugs/:id/comments
// @access  Public
const addComment = async (req, res, next) => {
  try {
    console.log('💬 Adding comment to bug:', req.params.id); // Debug log
    console.log('📝 Comment data:', req.body); // Debug log

    const { author, content } = req.body;

    if (!author || !content) {
      return res.status(400).json({
        success: false,
        error: 'Author and content are required'
      });
    }

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    await bug.addComment(author, content);

    console.log('✅ Comment added successfully'); // Debug log

    res.status(200).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('❌ Error adding comment:', error); // Debug log
    next(error);
  }
};

// @desc    Update bug status
// @route   PATCH /api/bugs/:id/status
// @access  Public
const updateBugStatus = async (req, res, next) => {
  try {
    console.log('🔄 Updating status for bug:', req.params.id); // Debug log
    console.log('📝 New status:', req.body.status); // Debug log

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: open, in-progress, resolved, closed'
      });
    }

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    await bug.updateStatus(status);

    console.log('✅ Bug status updated successfully'); // Debug log

    res.status(200).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('❌ Error updating bug status:', error); // Debug log
    next(error);
  }
};

// @desc    Get bugs by status
// @route   GET /api/bugs/status/:status
// @access  Public
const getBugsByStatus = async (req, res, next) => {
  try {
    console.log('🔍 Fetching bugs with status:', req.params.status); // Debug log

    const bugs = await Bug.getBugsByStatus(req.params.status);

    console.log(`✅ Found ${bugs.length} bugs with status: ${req.params.status}`); // Debug log

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    console.error('❌ Error fetching bugs by status:', error); // Debug log
    next(error);
  }
};

// @desc    Get bug statistics
// @route   GET /api/bugs/stats
// @access  Public
const getBugStats = async (req, res, next) => {
  try {
    console.log('📊 Fetching bug statistics'); // Debug log

    const stats = await Bug.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Bug.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalBugs = await Bug.countDocuments();
    const openBugs = await Bug.countDocuments({ status: 'open' });
    const resolvedBugs = await Bug.countDocuments({ status: 'resolved' });

    console.log('✅ Statistics fetched successfully'); // Debug log

    res.status(200).json({
      success: true,
      data: {
        total: totalBugs,
        open: openBugs,
        resolved: resolvedBugs,
        statusBreakdown: stats,
        priorityBreakdown: priorityStats
      }
    });
  } catch (error) {
    console.error('❌ Error fetching bug statistics:', error); // Debug log
    next(error);
  }
};

module.exports = {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  addComment,
  updateBugStatus,
  getBugsByStatus,
  getBugStats
};