const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviews');

router.post('/stories/:storyId/reviews', reviews.create);
router.post('/stories/:storyId/reviews/edit', reviews.update);

module.exports = router;