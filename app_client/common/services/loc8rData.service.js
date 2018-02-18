(function () {
    angular
        .module('loc8rApp')
        .service('loc8rData', function ($http) {
            var lng, lat;
            this.set = function (_lng, _lat) {
                lng = parseFloat(_lng);
                lat = parseFloat(_lat);
            }

            this.getLng = function () {
                return this.lng;
            }

            this.getData = function () {
                //don't know how this works it works but it only works when i switched the lat and lng :D
                return $http.get('/api/locations?lng=' + lat + '&lat=' + lng + '&maxDistance=20000');
            }

        })
})();