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
        .state('results', {
            url: "/search/:airport/",
            templateUrl: "../partials/flight_search.results.html"
        })
        .state('airport', {
            url: "/airport",
            templateUrl: "../partials/airport.html"
            
        })
        .state('time', {
            url: "/time", 
            templateUrl: "../partials/flight_timer.html"
        });
}