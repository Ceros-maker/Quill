const StoryRole = require('../models/storyRole');

async function canEditStory(userId, story) {
    if (!userId) return false;
    if (story.author_id === userId) return true;
    const role = await StoryRole.getRole(userId, story.id);
    return role === 'editor';
}

async function canDeleteStory(userId, story) {
    return userId === story.author_id;
}

async function canEditChapter(userId, story) {
    if (!userId) return false;
    if (story.author_id === userId) return true;
    const role = await StoryRole.getRole(userId, story.id);
    return role === 'editor';
}

async function canDeleteChapter(userId, story) {
    return userId === story.author_id;
}

async function canModerateComments(userId, story) {
    if (!userId) return false;
    if (story.author_id === userId) return true;
    const role = await StoryRole.getRole(userId, story.id);
    return role === 'moderator';
}

async function canManageRoles(userId, story) {
    return userId === story.author_id;
}

module.exports = {
    canEditStory,
    canDeleteStory,
    canEditChapter,
    canDeleteChapter,
    canModerateComments,
    canManageRoles
}