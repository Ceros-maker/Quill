const express = require('express');
const router = express.Router();
const library = require('../controllers/library');

router.get('/library', library.list);
router.post('/library/:storyId', library.add);
router.post('/library/:storyId/remove', library.remove);

module.exports = router;