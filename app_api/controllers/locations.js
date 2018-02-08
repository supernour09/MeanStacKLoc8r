var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
//var op = mongoose.model('openingTime');

//TODO: test the distanse calculations
//this function to get all location in the dist of 20km from the centre point send in the query in url
//
module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if (!lng || !lat) {
        sendJsonResponse(res, 404, { "message": "lng and lat query parameters are required" });
        return;
    }
    var locations = [];
    Loc.aggregate(
        [
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [2, 4]
                    },
                    "spherical": true,
                    "distanceField": "dis",
                    "maxDistance": "20000"
                }
            },
            { "$skip": 0 },
            { "$limit": 10 }

        ],
        function (err, results) {
            if (err) throw err;
            results.forEach(function (doc) {
                locations.push({
                    distance: theEarth.getDistanceFromRads(doc.dis),
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


var theEarth = (function () {
    var earthRadius = 6371; // km, miles is 3959 Define fixed value
    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };
    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };
    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();

module.exports.locationsCreate = function (req, res) {
    console.log(req.body);
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