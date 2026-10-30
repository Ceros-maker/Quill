const Review = require('../models/review');
const Story = require('../models/story');

exports.create = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.storyId);
  if (!story) return res.status(404).send('Story not found');

  if (story.author_id === req.session.userId) {
    return res.status(403).send('You cannot review your own story.');
  }

  const existing = await Review.findByUserAndStory(req.session.userId, story.id);
  if (existing) {
    return res.status(400).send('You have already reviewed this story.');
  }

  const rating = parseInt(req.body.rating, 10);
  const body = req.body.body || null;

  if (!rating || rating < 1 || rating > 5) {
    return res.redirect(`/stories/${story.id}`);
  }

  await Review.create({
    storyId: story.id,
    userId: req.session.userId,
    rating,
    body
  });

  console.log(`[info] Review on story ${story.id} by user ${req.session.userId}`);
  res.redirect(`/stories/${story.id}#reviews`);
};

exports.update = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const review = await Review.findByUserAndStory(req.session.userId, req.params.storyId);
  if (!review) return res.status(404).send('No review to update.');

  const rating = parseInt(req.body.rating, 10);
  const body = req.body.body || null;

  if (!rating || rating < 1 || rating > 5) {
    return res.redirect(`/stories/${req.params.storyId}#reviews`);
  }

  await Review.update(review.id, { rating, body });

  console.log(`[info] Review ${review.id} updated by user ${req.session.userId}`);
  res.redirect(`/stories/${req.params.storyId}#reviews`);
};