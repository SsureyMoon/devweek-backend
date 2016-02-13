'use strict';

var express = require('express'),
  auth = require('./auth'),
  users = require('./users');

var authMiddleware = require('../middlewares/auth');

var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    return res.render('index', {title: "Express"});
});

// health check
router.use('/api*', authMiddleware.apikey);
router.get('/api/', (req, res) => {return res.status(200).send('ok')});

// return token
router.post('/api/auth/obtain-token', auth.login);

module.exports = router;
