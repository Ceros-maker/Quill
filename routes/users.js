const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.get('/users/:username', users.show);
router.get('/users/:username/edit', users.editForm);
router.post('/users/:username/edit', users.update);

module.exports = router;