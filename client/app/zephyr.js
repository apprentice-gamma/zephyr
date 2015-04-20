angular.module('zephyr', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ui.router']);
angular.module('zephyr').config(Configuration);

function Configuration($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "../partials/flight_entry.html"
        })
        .state('search', {
            url: "/search",
            templateUrl: "../partials/flight_search.html"
          
        })
        .state('search.list', {
            url: "/search.list",
            templateUrl: "../partials/flight_search.list.html"
        })
        .state('airport', {
            url: "/airport",
            templateUrl: "../partials/airport.html"
            
        })
        .state('time', {
            url: "/time", 
            templateUrl: "../partials/time.html"
        });
}