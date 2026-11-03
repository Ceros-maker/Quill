const express = require('express');
const router = express.Router();
const storyRoles = require('../controllers/storyRoles');

router.get('/stories/:storyId/roles', storyRoles.list);
router.post('/stories/:storyId/roles', storyRoles.assign);
router.post('/stories/:storyId/roles/:userId/remove', storyRoles.remove);

module.exports = router;