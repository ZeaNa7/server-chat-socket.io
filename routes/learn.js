var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {  
  res.render('learn');
});

router.get('/frensh', function(req, res, next) {
  res.render('frensh');
});

router.get('/thai', function(req, res, next) {
  res.render('thai');
});

router.get('/korean', function(req, res, next) {
  res.render('korean');
});

module.exports = router;
