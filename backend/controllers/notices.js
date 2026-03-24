const Notice = require('../models/Notice');

function normalizeStatus(value, fallback = 'draft') {
  if (value === 'published' || value === 'draft') {
    return value;
  }

  return fallback;
}

async function listPublishedNotices(req, res) {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    const notices = await Notice.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notices',
    });
  }
}

async function listAdminNotices(req, res) {
  try {
    const status = req.query.status === 'published' ? 'published' : req.query.status === 'draft' ? 'draft' : '';
    const filter = status ? { status } : {};

    const notices = await Notice.find(filter)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin notices',
    });
  }
}

async function createNotice(req, res) {
  try {
    const text = String(req.body.text || '').trim();
    const status = normalizeStatus(req.body.status, 'draft');

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Notice text is required',
      });
    }

    const notice = await Notice.create({
      text,
      status,
      publishedAt: status === 'published' ? new Date() : null,
      createdBy: req.user?.id || null,
      updatedBy: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create notice',
    });
  }
}

async function updateNotice(req, res) {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    const nextText =
      req.body.text === undefined ? notice.text : String(req.body.text || '').trim();
    const nextStatus =
      req.body.status === undefined
        ? notice.status
        : normalizeStatus(req.body.status, notice.status);

    if (!nextText) {
      return res.status(400).json({
        success: false,
        message: 'Notice text is required',
      });
    }

    notice.text = nextText;
    notice.status = nextStatus;
    notice.updatedBy = req.user?.id || null;

    if (nextStatus === 'published' && !notice.publishedAt) {
      notice.publishedAt = new Date();
    }

    if (nextStatus === 'draft') {
      notice.publishedAt = null;
    }

    await notice.save();

    return res.json({
      success: true,
      data: notice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update notice',
    });
  }
}

module.exports = {
  listPublishedNotices,
  listAdminNotices,
  createNotice,
  updateNotice,
};
