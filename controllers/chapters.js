const Chapter = require('../models/chapter');
const Story = require('../models/story');
const Comment = require('../models/comment');

// Show form for creating a chapter — story author only
exports.newForm = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.storyId);
  if (!story) return res.status(404).send('Story not found');
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  res.render('chapters/new', { title: 'New Chapter', story });
};

// Handle chapter creation — story author only
exports.create = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.storyId);
  if (!story) return res.status(404).send('Story not found');
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  const { title, content } = req.body;

  if (!title || !content) {
    return res.render('chapters/new', {
      title: 'New Chapter',
      story,
      error: 'Title and content are required.'
    });
  }

  const chapter = await Chapter.create({
    storyId: story.id,
    title,
    content
  });

  console.log(`[info] Chapter created: ${chapter.id} (story ${story.id}) by user ${req.session.userId}`);
  res.redirect(`/stories/${story.id}/chapters/${chapter.id}`);
};

// Show one chapter — anyone can read
exports.show = async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) return res.status(404).send('Chapter not found');

  const story = await Story.findById(chapter.story_id);
  if (!story) return res.status(404).send('Story not found');

  const comments = await Comment.listByChapter(chapter.id);

  res.render('chapters/show', { title: chapter.title, chapter, story, comments });
};

// Show edit form — story author only
exports.editForm = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) return res.status(404).send('Chapter not found');

  const story = await Story.findById(chapter.story_id);
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  res.render('chapters/edit', { title: 'Edit Chapter', chapter, story });
};

// Handle chapter update — story author only
exports.update = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) return res.status(404).send('Chapter not found');

  const story = await Story.findById(chapter.story_id);
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  const { title, content } = req.body;

  if (!title || !content) {
    return res.render('chapters/edit', {
      title: 'Edit Chapter',
      chapter,
      story,
      error: 'Title and content are required.'
    });
  }

  await Chapter.update(req.params.id, { title, content });

  console.log(`[info] Chapter ${req.params.id} updated by user ${req.session.userId}`);
  res.redirect(`/stories/${story.id}/chapters/${req.params.id}`);
};

// Handle chapter delete — story author only
exports.remove = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) return res.status(404).send('Chapter not found');

  const story = await Story.findById(chapter.story_id);
  if (story.author_id !== req.session.userId) return res.status(403).send('Forbidden');

  await Chapter.remove(req.params.id);

  console.log(`[info] Chapter ${req.params.id} deleted by user ${req.session.userId}`);
  res.redirect(`/stories/${story.id}`);
};