const express = require('express');
const router = express.Router();
const chapters = require('../controllers/chapters');

router.get('/stories/:storyId/chapters/new', chapters.newForm);
router.post('/stories/:storyId/chapters', chapters.create);
router.get('/stories/:storyId/chapters/:id', chapters.show);
router.get('/stories/:storyId/chapters/:id/edit', chapters.editForm);
router.post('/stories/:storyId/chapters/:id/edit', chapters.update);
router.post('/stories/:storyId/chapters/:id/delete', chapters.remove);

module.exports = router;