const Library = require('../models/library');
const Story = require('../models/story');

exports.list = async (req, res) => {
    console.log('[debug] library list handler running');

  if (!req.session.userId) return res.redirect('/login');

  const stories = await Library.listByUser(req.session.userId);
  console.log('[debug] stories:', stories);
  console.log('[debug] is array:', Array.isArray(stories));
  
  res.render('library', { title: 'My Library', stories });
};

exports.add = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.storyId);
  if (!story) return res.status(404).send('Story not found');

  // Can't save your own story
  if (story.author_id === req.session.userId) {
    return res.redirect(`/stories/${story.id}`);
  }

  await Library.add(req.session.userId, story.id);
  res.redirect(`/stories/${story.id}`);
};

exports.remove = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  await Library.remove(req.session.userId, req.params.storyId);
  res.redirect(`/stories/${req.params.storyId}`);
};