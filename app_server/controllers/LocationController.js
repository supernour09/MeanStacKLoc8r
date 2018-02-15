var request = require('request');

var apiOptions = {
  server: "http://localhost:3000"
};

/* Home page Page  */
module.exports.listLocations = function (req, res) {
  res.render('LocationList', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about.Perhaps with coffee, cake or a pint ? Let Loc8r"
  });

};

var _formatDistance = function (distance) {
  var numDistance, unit;
  if (distance > 1) {
    numDistance = parseFloat(distance).toFixed(1);
    unit = 'km';
  } else {
    numDistance = parseInt(distance * 1000, 10);
    unit = 'm';
  }
  return numDistance + unit;
};

/* Location Details Page  */
module.exports.locationDetails = function (req, res) {
  getLocationInfo(req, res, renderDetailsLocation);

};

var getLocationInfo = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationId;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };

  request(
    requestOptions,
    function (err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
}


var _showError = function (req, res, status) {
  var message;
  if (status === 404) {
    message = "404, page not found ";
  } else {
    message = status + ", something's gone wrong";
  }
  res.status(status);
  res.render('error', {
    message: message,
    error: {
      status: status
    }
  });
};

var renderDetailsLocation = function (req, res, locDetail) {
  res.render('Details', {
    title: locDetail.name,
    pageHeader: {
      title: locDetail.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sitdown with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
}



/* Add Review Page  */
module.exports.addReview = function (req, res) {
  getLocationInfo(req, res, renderReviewForm);

};

var renderReviewForm = function (req, res, data) {
  res.render('Add Review', {
    title: 'Review ' + data.name + ' on Loc8r',
    pageHeader: {
      title: 'Review ' + data.name
    },
    error: req.query.err
  });

}


module.exports.doAddReview = function (req, res) {
  var requestOptions, path, locationid, postdata;
  console.dir(req.body);
  locationid = req.params.locationid;
  path = "/api/locations/" + locationid + '/reviews';
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect('/location/' + locationid + '/review/new?err=val');
    } else {
  request(requestOptions,
    function (err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/location/' + locationid);
      }else if (response.statusCode === 400 && body.name && body.name ===
        "ValidationError" ) {
        res.redirect('/location/' + locationid + '/review/new?err=val');
        } 
      else {
        _showError(req, res, response.statusCode);
      }
    }
  );}
};