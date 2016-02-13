var Users = require("../models/users")
var jwt = require('jsonwebtoken');

exports.login = function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if(!(email && password)){
        throw new Error("input parameter not valid");
    }
    
    return res.status(200).send("ok")
};
