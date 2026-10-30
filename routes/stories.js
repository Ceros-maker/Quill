const express = require('express');
const router = express.Router();
const stories = require('../controllers/stories');

router.get('/stories', stories.list);
router.get('/stories/new', stories.newForm);
router.post('/stories', stories.create);
router.get('/stories/:id', stories.show);
router.get('/stories/:id/edit', stories.editForm);
router.post('/stories/:id/edit', stories.update);
router.post('/stories/:id/delete', stories.remove);
router.post('/stories/:id/publish', stories.publish);

module.exports = router;