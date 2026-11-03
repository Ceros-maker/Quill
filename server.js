require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const db = require('./db');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));

// res.locals.user middleware — BEFORE routes
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const result = await db.query(
        'SELECT id, username FROM users WHERE id = $1',
        [req.session.userId]
      );
      res.locals.user = result.rows[0];
    } catch (err) {
      return next(err);
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const storyRoutes = require('./routes/stories');
app.use('/', storyRoutes);

const chapterRoutes = require('./routes/chapters');
app.use('/', chapterRoutes);

const commentRoutes = require('./routes/comments');
app.use('/', commentRoutes);

const libraryRoutes = require('./routes/library');
app.use('/', libraryRoutes);

const userRoutes = require('./routes/users');
app.use('/', userRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/', reviewRoutes);

const storyRoleRoutes = require('./routes/storyRoles');
app.use('/', storyRoleRoutes);

app.get('/', (req, res) => {
  res.send('quill is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});