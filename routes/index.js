var express = require('express');
var auth = require('./auth');
var users = require('./users');
var Joi = require('joi');
var config  = require('../config');

var redisClient = require('../app').redisClient;

// var authMiddleware = require('../middlewares/auth');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    return res.send("Home page");
});

// health check
// router.use('/api*', authMiddleware.apikey);
router.get('/api/', function(req, res) {
	return res.send('ok');
});

router.get('/api/stream', function(req, res) {
    console.log("config");
    redisClient.publish(config.conf_name)
	return res.send('ok');
});


// return token
// router.post('/api/auth/obtain-token', auth.login);
router.post('/api/emotion', function(req, res) {
	var schema = Joi.object().keys({
		faceId: Joi.number().integer(),
		anger: Joi.number(),
		contempt: Joi.number(),
		disgust: Joi.number(),
		fear: Joi.number(),
		happiness: Joi.number(),
		neutral: Joi.number(),
		sadness: Joi.number(),
		surprise: Joi.number(),
		faceRectangle: {
			alpha: Joi.number(),
			beta: Joi.number(),
			gamma: Joi.number(),
			delta: Joi.number()
		}
	}).required();

	Joi.validate({
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
	}, schema, function(err, value) {
		if (err === null) {
			// Data is valid
		};
	});
});

router.get('/api/data', function(req, res) {

})

module.exports = router;
