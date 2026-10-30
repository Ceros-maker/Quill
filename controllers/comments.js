const Comment = require('../models/comment');
const Chapter = require('../models/chapter');

exports.create = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) return res.status(404).send('Chapter not found');

  const { body } = req.body;

  if (!body || !body.trim()) {
    return res.redirect(`/stories/${chapter.story_id}/chapters/${chapter.id}`);
  }

  await Comment.create({
    chapterId: chapter.id,
    userId: req.session.userId,
    body: body.trim()
  });

  console.log(`[info] Comment on chapter ${chapter.id} by user ${req.session.userId}`);
  res.redirect(`/stories/${chapter.story_id}/chapters/${chapter.id}`);
};