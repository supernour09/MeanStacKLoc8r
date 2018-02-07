var mongoose = require('mongoose');
var Loc = mongoose.model('Location')


module.exports.locationsListByDistance = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

module.exports.locationsCreate = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

//get location with the params.id send in the request
//return 404 if : 1 - location not found 
//              : 2 - error from database
//              : 3 - params not provided
module.exports.locationsReadOne = function (req, res) {
    //over protuection just better to be safe as if the request /location with no params
    //it will be routed to onther function anyway 
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function (err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};

module.exports.locationsUpdateOne = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

module.exports.locationsDeleteOne = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};






var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};