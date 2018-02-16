var app = angular.module("loc8rApp", []);







var locationListCtrl = function ($scope, loc8rData, $geolocation) {
    $geolocation.getCurrentPosition({
        timeout: 60000
    }).then(function (position) {
        $scope.myPosition = position;
        $scope.message = "Searching for nearby places";
        console.log(position.coords);
        console.log(position.coords.longitude+" "+ position.coords.latitude);
        loc8rData.set(position.coords.longitude, position.coords.latitude);
        loc8rData.getData().then(function (data) {
            $scope.message = data.data.length > 0 ? "" : "No locations found";
            $scope.data = {
                locations: data.data
            };
        }, function (e) {
            $scope.message = "Sorry, something's gone wrong ";
            console.log(e);
        });
    });

};

var _isNumeric = function (n) {

    return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function () {

    return function (distance) {
        var numDistance, unit;
        if ((distance && _isNumeric(distance)) || distance === 0) {
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';

            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }

            return numDistance + unit;
        } else {
            return "?";
        }
    };
};


var ratingStars = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/angularJs/rating-stars.html'
    };
};


var loc8rData = function ($http) {
    var lng, lat;
    this.set = function (_lng, _lat) {
        lng = parseFloat(_lng);
        lat = parseFloat(_lat);
    }

    this.getData = function () {
        //don't know how this works it works but it only works when i switched the lat and lng :D
        return $http.get('/api/locations?lng=' + lat + '&lat=' + lng + '&maxDistance=20000');
    }

};



angular
    .module('loc8rApp', ['ngGeolocation'])
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData);







/*
db.locations.aggregate([{
    '$geoNear': {
        near: {
            type: 'Point',
            coordinates: [30.053825200000002 ,31.381926600000003]
        },
        distanceField: 'dis',
        maxDistance: 20000,
        num: 10,
        spherical: true
    }
}], {}).pretty()
*/