const bcrypt = require('bcrypt');
const User = require('../models/user');
const Story = require('../models/story');

exports.loginForm = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Login' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  console.log(`[info] Login: ${user.username} (user ${user.id})`);
  res.redirect('/dashboard');
};

exports.registerForm = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/register', { title: 'Register' });
};

exports.register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.render('auth/register', { title: 'Register', error: 'All fields required.' });
  }
  if (password.length < 6) {
    return res.render('auth/register', { title: 'Register', error: 'Password must be at least 6 characters.' });
  }

  const existingEmail = await User.findByEmail(email);
  if (existingEmail) {
    return res.render('auth/register', { title: 'Register', error: 'Email already registered.' });
  }

  const existingUsername = await User.findByUsername(username);
  if (existingUsername) {
    return res.render('auth/register', { title: 'Register', error: 'Username already taken.' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const user = await User.create({
    email,
    username,
    passwordHash: hash,
    roleId: 1
  });

  req.session.userId = user.id;
  req.session.username = user.username;
  console.log(`[info] Registered: ${username} (user ${user.id})`);
  res.redirect('/dashboard');
};

exports.dashboard = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const user = await User.findById(req.session.userId);
  const stories = await Story.listByAuthor(req.session.userId);

  res.render('dashboard', { title: 'Dashboard', user, stories });
};

exports.logout = (req, res) => {
  const username = req.session.username;
  req.session.destroy(() => {
    console.log(`[info] Logout: ${username}`);
    res.redirect('/login');
  });
};