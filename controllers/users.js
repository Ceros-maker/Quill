const User = require('../models/user');
const Story = require('../models/story');
const Comment = require('../models/comment');

exports.show = async (req, res) => {
  const user = await User.findByUsername(req.params.username);
  if (!user) return res.status(404).send('User not found');

  const isSelf = req.session.userId === user.id;

  const publishedStories = await Story.listPublishedByAuthor(user.id);
  const drafts = isSelf ? await Story.listDraftsByAuthor(user.id) : [];
  const recentComments = await Comment.listRecentByUser(user.id, 5);

  res.render('users/show', {
    title: user.username,
    profileUser: user,
    isSelf,
    publishedStories,
    drafts,
    recentComments
  });
};

exports.editForm = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const user = await User.findByUsername(req.params.username);
  if (!user) return res.status(404).send('User not found');
  if (user.id !== req.session.userId) return res.status(403).send('Forbidden');

  res.render('users/edit', { title: 'Edit Profile', profileUser: user });
};

exports.update = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const user = await User.findByUsername(req.params.username);
  if (!user) return res.status(404).send('User not found');
  if (user.id !== req.session.userId) return res.status(403).send('Forbidden');

  const { bio, avatar_url } = req.body;

  await User.updateProfile(user.id, {
    bio: bio || null,
    avatarUrl: avatar_url || null
  });

  console.log(`[info] Profile ${user.username} updated`);
  res.redirect(`/users/${user.username}`);
};