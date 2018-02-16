var mongoose = require('mongoose');
var Loc = mongoose.model('Location');




//commen function to send json responses 
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};



//TODO: test the distanse calculations
//this function to get all location in the dist of 20km from the centre point send in the query in url
//
module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistanceValue = parseInt(req.query.maxDistance);

    console.log(maxDistanceValue);
    if ((!lng && lng!==0) || (!lat && lat!==0)) {
        sendJsonResponse(res, 404, {
            "message": "lng and lat query parameters are required"
        });
        return;
    }
    var locations = [];
    Loc.aggregate(
        [
            {
              $geoNear: {
                 near: { type: "Point", coordinates: [lng, lat ] },
                 distanceField: "dis",
                 maxDistance: maxDistanceValue,
                 num: 10,
                 spherical: true
              }
            }
         ],
        function (err, results) {
            if (err) throw err;
            results.forEach(function (doc) {
                locations.push({
                    distance: doc.dis,
                    name: doc.name,
                    address: doc.address,
                    rating: doc.rating,
                    facilities: doc.facilities,
                    _id: doc._id
                });
            });
            sendJsonResponse(res, 200, locations);

        }
    );
};



//post location
//return 400 if : 1 - error in database or creation
//return 201 if : 1 - success create 
module.exports.locationsCreate = function (req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
    }, function (err, location) {
        if (err) {
            console.log(err);
            sendJsonResponse(res, 400, err);
        } else {
            console.log(location);
            sendJsonResponse(res, 201, location);
        }
    });
};

//get location with the params.id send in the request
//return 404 if : 1 - location not found 
//              : 2 - error from database
//              : 3 - params not provided
//return 200 if : 1 - success return location 
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




//Put location (Update) with the params.id send in the request
//return 404 if : 1 - location not found 
//              : 2 - params not provided
//return 400 if : 1 - error from database
//return 200 if : 1 - success update 
module.exports.locationsUpdateOne = function (req, res) {
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('-reviews -rating') //to disSelect the reviews and rating 
        .exec(
            function (err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                location.name = req.body.name;
                location.address = req.body.address;
                location.facilities = req.body.facilities.split(",");
                location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
                location.openingTimes = [{
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1,
                }, {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2,
                }];
                location.save(function (err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, location);
                    }
                });
            }
        );
};




//Delete location (Update) with the params.id send in the request
//return 404 if : 1 - location not found 
//              : 2 - params not provided
//return 204 if : 1 - success Delete
module.exports.locationsDeleteOne = function (req, res) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc
            .findByIdAndRemove(locationid)
            .exec(
                function (err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);

                        return
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No locationid"
        });
    }
};




