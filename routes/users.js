var Users = require("../models/users")

/* GET users listing. */
exports.getList = function (req, res, next) {
    Users.query()
    .then(function(records){
        return res.send(records);
    }).fail(function(err){
        throw new Error(err);
    })
};

exports.getProfile = function (req, res, next) {
    return res.send(new Users(req.aspuser).sanitize());
};
