var mongoose = require('mongoose');
var Loc = mongoose.model('Location')


//post Review
//return 400 if : 1 - error in database or creation
//return 404 if : 1 - locationId not provided
//return 201 if : 1 - success create 
module.exports.reviewsCreate = function (req, res) {
    var locationid = req.params.locationid;
   
    if (locationid) {
        Loc
            .findById(locationid)
            .select('reviews')
            .exec(
            function (err, location) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(res, 400, err);
                } else {
                    //to add the Review
                    doAddReview(req, res, location);
                }
            }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
};
//push review to the location array 
//fire updateAverageRating to calc the average Rating 
var doAddReview = function (req, res, location) {
    if (!location) {
        sendJsonResponse(res, 404, {
            "message": "locationid not found"
        });
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save(function (err, location) {
            var thisReview;
            if (err) {
                console.log(err);
                sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                sendJsonResponse(res, 201, thisReview);
            }
        });
    }
};


// loop through all review and average them 
//TODO: check if we can use aggregation for it 
/* experamentail query for mongo untested yet 

db.locations.aggregate(
    [ 
        { $group : { "_id" : "_id",
                      AvgReviewRating:{$avg:"reviews.rating"} } }
       

    ]
);



*/

var updateAverageRating = function (locationid) {
    Loc
        .findById(locationid)
        .select('rating reviews')
        .exec(
        function (err, location) {
            if (!err) {
                var i, reviewCount, ratingAverage, ratingTotal;
                if (location.reviews && location.reviews.length > 0) {
                    reviewCount = location.reviews.length;
                    ratingTotal = 0;
                    for (i = 0; i < reviewCount; i++) {
                        ratingTotal = ratingTotal + location.reviews[i].rating;
                    }
                    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
                    location.rating = ratingAverage;
                    location.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Average rating updated to", ratingAverage);
                        }
                    });
                }
            }
        });
};


//Get function to get review
//Params  locationId
//        ReviewId
//Return  404 : for location Id or Review Id not Found
//        400 : for Database err
module.exports.reviewsReadOne = function (req, res) {
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc
            .findById(req.params.locationid)
            .select('name reviews')
            .exec(
            function (err, location) {
                var response, review;
                if (!location) {
                    sendJsonResponse(res, 404, { "message": "locationid not found" });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (location.reviews && location.reviews.length > 0) {
                    review = location.reviews.id(req.params.reviewid);
                    if (!review) {
                        sendJsonResponse(res, 404, { "message": "reviewid not found" });
                    } else {
                        response = {
                            location: {
                                name: location.name,

                                id: req.params.locationid
                            },
                            review: review
                        };
                        sendJsonResponse(res, 200, response);
                    }
                } else {
                    sendJsonResponse(res, 404, { "message": "No reviews found" });
                }
            }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
    }
};




//Put Review (Update) with the params.locationid && params.reviewid send in the request
//return 404 if : 1 - location id or review id not found 
//              : 2 - params not provided
//return 400 if : 1 - error from database
//return 200 if : 1 - success update
module.exports.reviewsUpdateOne = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(
        function (err, location) {
            var thisReview;
            if (!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0) {
                subdocument
                thisReview = location.reviews.id(req.params.reviewid);
                if (!thisReview) {
                    sendJsonResponse(res, 404, {
                        "message": "reviewid not found"
                    });
                } else {
                    thisReview.author = req.body.author;
                    thisReview.rating = req.body.rating;
                    thisReview.reviewText = req.body.reviewText;
                    location.save(function (err, location) {
                        if (err) {
                            sendJsonResponse(res, 400, err);

                        } else {
                            updateAverageRating(location._id); e
                            sendJsonResponse(res, 200, thisReview);
                        }
                    });
                }
            } else {
                sendJsonResponse(res, 404, {
                    "message": "No review to update"
                });
            }
        }
        );
};



//Delete Review (Update) with the params.id send in the request
//return 404 if : 1 - location id or review id not found 
//              : 2 - params not provided
//return 204 if : 1 - success Delete
module.exports.reviewsDeleteOne = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
        return;
    }

    Loc
        .findById(req.params.locationid)
        .select('reviews')
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
            if (location.reviews && location.reviews.length > 0) {
                if (!location.reviews.id(req.params.reviewid)) {
                    sendJsonResponse(res, 404, {
                        "message": "reviewid not found"
                    });
                } else {
                    location.reviews.id(req.params.reviewid).remove();
                    location.save(function (err) {
                        if (err) {
                            sendJsonResponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 204, null);
                        }
                    });
                }
            } else {
                sendJsonResponse(res, 404, {
                    "message": "No review to delete"
                });
            }
        }
        );
};



var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

