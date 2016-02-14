exports.apikey = function(req, res, next){
    var apikey = req.headers['emoemo-static'];
    if(apikey && apikey === "emoemo-static-test-key")
        return next();
    return next(new Error("api key is not valid"))
}
