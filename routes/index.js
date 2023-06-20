var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
var session = require('express-session');

router.use(session({
  secret: 'un secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: '', login: 'Login'});
});

router.get('/languages', function(req, res) {
  res.render('languages', { title: 'Languages' });
});

router.get('/chat', function(req, res) {
  res.render('chat', { title: 'Chat', name: req.session.name });
});

router.get('/error404', function(req, res) {
  res.render('404', { title: 'Error' });
});

router.get('/login', (req, res) => {
  res.render('login');
});


// Connexion
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

   // Check identifiants
    if (username === 'admin') {
    const hashedPassword = '$2b$10$U0jKzWVOMvGUM6fAIpB/.uj8DASWV6UZfAs9Kcgs1bLunTbwKBz92'; // Mot de passe hashé pour 'admin'
    const match = bcrypt.compare(password, hashedPassword);
    if (match) {
      req.session.loggedin = true;
      req.session.name = username;
      res.redirect('/home');
    } else {
      res.send('Username or password incorrect');
    }
  } else {
    res.send('Username or password incorrect');
  }
});

router.get('/home', (req, res) => {
  if (!req.session.loggedin) {
    return res.render('index', { name: '', login: 'Login' });
  } else {
    res.render('index', { name: req.session.name, login: req.session.loggedin });
  }
});

// Logout user
router.post('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
