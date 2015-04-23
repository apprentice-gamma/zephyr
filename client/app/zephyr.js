angular.module('zephyr', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ui.router', 'ngGeolocation', 'timer']);
angular.module('zephyr').config(Configuration);

function Configuration($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "../partials/flight_entry.html"
        })
        .state('results', {
            url: "/search/:airport/",
            templateUrl: "../partials/flight_search.results.html"
        })
        .state('track', {
            url: "/track", 
            templateUrl: "../partials/flight_tracker.html"
        });
}
