const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

router.get('/login', auth.loginForm);
router.post('/login', auth.login);
router.get('/register', auth.registerForm);
router.post('/register', auth.register);
router.get('/dashboard', auth.dashboard);
router.post('/logout', auth.logout);

module.exports = router;