const express = require('express');
const router = express.Router();
const comments = require('../controllers/comments');

router.post('/stories/:storyId/chapters/:id/comments', comments.create);

module.exports = router;