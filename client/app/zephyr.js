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
        .state('track', {
            url: "/track", 
            templateUrl: "../partials/flight_tracker.html"
        });
}

angular.module('zephyr').config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;


    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});