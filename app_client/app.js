(function () {
    var app = angular.module('loc8rApp', ["ngRoute", "ngGeolocation"]);


    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: 'common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/location/:locationid', {
                templateUrl: '/locationDetail/locationDetail.view.html',
                controller: 'locationDetailCtrl',
                controllerAs: 'vm'
                })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }



    angular
        .module('loc8rApp')
        .config(['$routeProvider', '$locationProvider', config]);
})();