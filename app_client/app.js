(function () {
    var app = angular.module('loc8rApp', ["ngRoute", "ngGeolocation"]);


    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    angular
        .module('loc8rApp')
        .config(['$routeProvider', config]);
})();