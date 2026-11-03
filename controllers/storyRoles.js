const Story = require('../models/story');
const StoryRole = require('../models/storyRole');
const User = require('../models/user');
const Permissions = require('../utils/permissions');

exports.list = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.storyId);
  if (!story) return res.status(404).send('Story not found');

  if (!(await Permissions.canManageRoles(req.session.userId, story))) {
    return res.status(403).send('Forbidden');
  }

  const roles = await StoryRole.listByStory(story.id);

  res.render('story-roles', { title: `Manage Roles — ${story.title}`, story, roles });
};

exports.assign = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.storyId);
  if (!story) return res.status(404).send('Story not found');

  if (!(await Permissions.canManageRoles(req.session.userId, story))) {
    return res.status(403).send('Forbidden');
  }

  const { username, role } = req.body;

  if (!username || !role || !['editor', 'moderator'].includes(role)) {
    return res.redirect(`/stories/${story.id}/roles`);
  }

  const targetUser = await User.findByUsername(username);
  if (!targetUser) {
    return res.redirect(`/stories/${story.id}/roles`);
  }

  if (targetUser.id === story.author_id) {
    return res.redirect(`/stories/${story.id}/roles`);
  }

  await StoryRole.assign({
    storyId: story.id,
    userId: targetUser.id,
    role
  });

  console.log(`[info] ${targetUser.username} assigned as ${role} on story ${story.id}`);
  res.redirect(`/stories/${story.id}/roles`);
};

exports.remove = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const story = await Story.findById(req.params.storyId);
  if (!story) return res.status(404).send('Story not found');

  if (!(await Permissions.canManageRoles(req.session.userId, story))) {
    return res.status(403).send('Forbidden');
  }

  await StoryRole.remove(story.id, req.params.userId);

  console.log(`[info] User ${req.params.userId} removed from story ${story.id}`);
  res.redirect(`/stories/${story.id}/roles`);
};