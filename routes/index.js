var express = require('express');
var auth = require('./auth');
var users = require('./users');

// var authMiddleware = require('../middlewares/auth');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    return res.send("Home page");
});

// health check
// router.use('/api*', authMiddleware.apikey);
router.get('/api/', function(req, res) {
	return res.send('/api/');
});

// return token
// router.post('/api/auth/obtain-token', auth.login);
router.post('/api/emotion', function(req, res) {
	var facialExpressions = {
		faceId: req.body.faceId,
		anger: req.body.anger,
		contempt: req.body.contempt,
		disgust: req.body.disgust,
		fear: req.body.fear,
		happiness: req.body.happiness,
		neutral: req.body.neutral,
		sadness: req.body.sadness,
		surprise: req.body.surprise,
		faceRectangle: [req.body.faceRectangle.alpha, req.body.faceRectangle.beta, req.body.faceRectangle.gamma, req.body.faceRectangle.delta]
	};

	return res.send('/api/data', facialExpressions);
});

router.get('/api/data', function(req, res) {

})

module.exports = router;