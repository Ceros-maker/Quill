const Story = require('../models/story');
const Chapter = require('../models/chapter');
const Library = require('../models/library');
const Review = require('../models/review');

exports.list = async (req, res) => {
  const stories = await Story.listPublished();
  res.render('stories/index', { title: 'Stories', stories });
};

exports.newForm = (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('stories/new', { title: 'New Story' });
};

exports.create = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const { title, description, cover_url, publish } = req.body;

  if (!title) {
    return res.render('stories/new', { title: 'New Story', error: 'Title is required.' });
  }

  const story = await Story.create({
    authorId: req.session.userId,
    title,
    description: description || null,
    coverUrl: cover_url || null,
    published: publish === 'on'
  });

  console.log(`[info] Story created: ${story.id} by user ${req.session.userId}`);
  res.redirect(`/stories/${story.id}`);
};

exports.publish = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).send('Story not found');
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');
  if (story.published_at) return res.redirect(`/stories/${story.id}`);

  await Story.publish(story.id);
  console.log(`[info] Story ${story.id} published by user ${req.session.userId}`);
  res.redirect(`/stories/${story.id}`);
};

exports.show = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).send('Story not found');
  if (!story.published_at) {
    if (!req.session.userId || story.author_id !== req.session.userId) {
      return res.status(404).send('Story not found');
    }
  }

  const chapters = await Chapter.listByStory(story.id);
  const reviews = await Review.listByStory(story.id);
  const ratingStats = await Review.getAverage(story.id);
  const userReview = req.session.userId
    ? await Review.findByUserAndStory(req.session.userId, story.id)
    : null;

  const canEdit = await Permissions.canEditStory(req.session.userId, story);
  const canDelete = await Permissions.canDeleteStory(req.session.userId, story);
  const canManageRoles = await Permissions.canManageRoles(req.session.userId, story);

  // Also need to know: for each comment, can the current user delete it?
  // That's per-comment, so the template will need the moderator flag.
  const isModerator = await Permissions.canModerateComments(req.session.userId, story);

  res.render('stories/show', {
    title: story.title,
    story,
    chapters,
    reviews,
    ratingStats,
    userReview,
    canEdit,
    canDelete,
    canManageRoles,
    isModerator
  });
};

exports.editForm = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.id);

  if (!story) return res.status(404).send('Story not found');
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  res.render('stories/edit', { title: 'Edit Story', story });
};

exports.update = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.id);

  if (!story) return res.status(404).send('Story not found');
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  const { title, description, cover_url } = req.body;

  if (!title) {
    return res.render('stories/edit', { title: 'Edit Story', story, error: 'Title is required.' });
  }

  await Story.update(req.params.id, {
    title,
    description: description || null,
    coverUrl: cover_url || null
  });

  console.log(`[info] Story ${req.params.id} updated by user ${req.session.userId}`);
  res.redirect(`/stories/${req.params.id}`);
};

exports.remove = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.id);

  if (!story) return res.status(404).send('Story not found');
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  await Story.remove(req.params.id);

  console.log(`[info] Story ${req.params.id} deleted by user ${req.session.userId}`);
  res.redirect('/stories');
};