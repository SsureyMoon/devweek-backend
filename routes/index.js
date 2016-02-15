var express = require('express');
var auth = require('./auth');
var users = require('./users');
// var Joi = require('joi');

var config  = require('../config');
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

// router.get('/api/stream', function(req, res) {
//     var redisClient = req.app.utils.redisClient
//     io = require('socket.io-emitter')(redisClient)
//         io.of('/'+config.socket.namespace).to(config.conf_name).emit("streaming", {data:"hello"})
//     //redisClient.publish(config.conf_name, "stream!!")
//     return res.send('ok');
//  });


router.post('/api/emotion/done/', function(req, res) {
    var io = req.app.utils.io;
    io.of('/'+config.socket.namespace).to(config.conf_name).emit("done", "profit!")
    //redisClient.publish(config.conf_name, "stream!!")
    return res.send('ok');
})

// return token
// router.post('/api/auth/obtain-token', auth.login);
router.post('/api/emotion/', function(req, res) {
	// var schema = Joi.object().keys({
	// 	faceId: Joi.number().integer().required(),
	// 	anger: Joi.number().required(),
	// 	contempt: Joi.number().required(),
	// 	disgust: Joi.number().required(),
	// 	fear: Joi.number().required(),
	// 	happiness: Joi.number().required(),
	// 	neutral: Joi.number().required(),
	// 	sadness: Joi.number().required(),
	// 	surprise: Joi.number().required(),
	// 	faceRectangle: Joi.array().length(4).required()
	// });

	// Joi.validate({
	// 	faceId: req.body.faceId,
	// 	anger: req.body.anger,
	// 	contempt: req.body.contempt,
	// 	disgust: req.body.disgust,
	// 	fear: req.body.fear,
	// 	happiness: req.body.happiness,
	// 	neutral: req.body.neutral,
	// 	sadness: req.body.sadness,
	// 	surprise: req.body.surprise,
	// 	faceRectangle: req.body.faceRectangle
	// }, schema, function(err, value) {
	// 	if (err === null) {
	// 		console.log("Data is valid");
	// 		return res.send('ok')
	// 	} else {
	// 		console.log("Data is not valid");
	// 		return res.status(500).send('error')
	// 	}
	// });

    var io = req.app.utils.io
    io.of('/'+config.socket.namespace).to(config.conf_name).emit("streaming", req.body)
    //redisClient.publish(config.conf_name, "stream!!")
    return res.send('ok');


});

router.get('/api/data', function(req, res) {
    
})

module.exports = router;
