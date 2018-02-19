(function () {
    angular
        .module('loc8rApp')
        .controller('homeCtrl', ['loc8rData', '$geolocation', function (loc8rData, $geolocation) {
            var vm = this;
            vm.pageHeader = {
                title: 'Loc8r',
                strapline: 'Find places to work with wifi near you!'
            };
            vm.sidebar = {
                content: "Looking for wifi and a seat? Etc etc..."
            };

            $geolocation.getCurrentPosition({
                timeout: 60000
            }).then(function (position) {
                vm.message = "Searching for nearby places";
                console.log(position.coords);
                console.log(position.coords.longitude + " " + position.coords.latitude);
                loc8rData.set(position.coords.longitude, position.coords.latitude);
                loc8rData.getData().then(function (data) {
                    console.dir(data.data)
                    vm.message = data.data.length > 0 ? "" : "No locations found";
                    vm.data = {
                        locations: data.data
                    };
                }, function (e) {
                    vm.message = "Sorry, something's gone wrong ";
                    console.log(e);
                });
            });
        }]);





})();