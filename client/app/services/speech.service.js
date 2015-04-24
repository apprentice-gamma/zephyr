(function() {
    angular
        .module('zephyr')
        .service('SpeechService', Service);

    function Service($rootScope, $controller, $geolocation, $modal, $log, $state, FlightFactory, DirectionFactory, ActivityFactory) {
        var service = this;
        service.restart = false;
        service.okZephyr = false;
        service.controllers = {};

        service.speak = speak;
        service.listen = listen;
        service.listenForCommands = listenForCommands;
        ////////////////

        function speak(message) {
            console.log("I'M A SPEECH SERVICE");
            var msg = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.speak(msg);
        }

        function listen(object, property) {
            console.log("I'M A RECOGNITION SERVICE");
            var recognition = new webkitSpeechRecognition();
            recognition.onstart = function() {
                console.log('BEGINING RECOGNITION');
            };
            recognition.onresult = function(event) {
                var result = event.results['0']['0'].transcript;
                console.log('RECOGNIZED: ' + result);
                object[property] = result;
                console.log('SAVED: ' + object[property]);
                $rootScope.$apply();

            };
            recognition.onend = function() {
                console.log('ENDING RECOGNITION');
            };
            recognition.start();
        }

        function listenForCommands() {
            console.log("I'M A RECOGNITION SERVICE THAT LISTENS CONTINUOUSLY");
            var startPosition, command, date;
                fetchControllers(service.controllers);
            var recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;

            recognition.onstart = handleStart;
            recognition.onresult = handleResult;
            recognition.onend = handleEnd;
            recognition.onerror = handleError;

            recognition.start();
        }

        function handleResult(data) {
            console.log('RESULTS', data.results);
            var result = data.results[data.results.length - 1]['0'].transcript.toLowerCase();
            var confidence = data.results[data.results.length - 1]['0'].confidence;
            
            if ((result.indexOf('okay zephyr') != -1) && (confidence >= 0.5)) {
                console.log("LISTENING...");
                speak('Now Listening for Command');
                service.okZephyr = true;
            }
            
            if ((result.indexOf('cancel') != -1) && (confidence >= 0.75)) {
                console.log("NOT LISTENING...");
                service.okZephyr = false;
            }
            
            if (result.toLowerCase().indexOf('stop') >= 0) {
                console.log("STOPING RECOGNITION");
                recognition.abort();
            }

            if ((result.indexOf('zephyr time') != -1) && service.okZephyr) {
                date =  FlightFactory.calculateCountdown(FlightFactory.connectionTime);
                speak('Driving ETA to Airport is about' + Math.round(DirectionFactory.drivingMinutes) + ' minutes');
                speak('ETA of flight event is about' + Math.round(date) + ' minutes');
                service.okZephyr = false;
            }

            if ((result.indexOf('departure') != -1) && service.okZephyr) {
                console.log('DEPARTURE');
                service.controllers.vmEntry.trackFlight('dep', service.controllers.vmMain);
                speak('Thank you, please drive carefully');
                service.okZephyr = false;

            }

            if ((result.indexOf('arrival') != -1) && service.okZephyr) {
                console.log('ARRIVAL');
                service.controllers.vmEntry.trackFlight('arr', service.controllers.vmMain);
                speak('Thank you, please drive carefully');
                service.okZephyr = false;
            }

            if ((result.indexOf('flight') != -1) && service.okZephyr) {
                startPosition = (result.indexOf('flight') + 6);
                command = result.slice(startPosition, result.length);
                if (confidence >= 0.88){
                    FlightFactory.flight = command;
                    speak('Thank you, please confirm your flight');
                    service.okZephyr = false;
                }
            }

            if ((result.indexOf('airport') != -1) && service.okZephyr) {
                startPosition = (result.indexOf('airport') + 6);
                command = result.slice(startPosition, result.length);
                if (confidence >= 0.88){
                    service.controllers.vmEntry.airport = command;
                    speak('Thank you, please confirm your airport');
                    service.okZephyr = false;
                }
            }


            console.log('RECOGNIZED: ', result);
            console.log('RESULTS', data.results);
            $rootScope.$apply();
        }

        // EVENT HANDLERS
        function handleStart() {
            console.log("Beginning Recognition");
            service.restart = false;

        }
        function handleEnd() {
            console.log('ENDING RECOGNITION');
            if (service.restart)
                recognition.start();
        }

        function handleError(error) {
            console.log('ERROR! ', error);
        }

        function fetchControllers(controllers) {
            service.controllers.vmEntry = $controller('flightEntry');
            service.controllers.vmMain = $controller('mainController', {
                '$scope': $rootScope, 
                '$geolocation': $geolocation, 
                '$modal': $modal, 
                '$log' : $log, 
                'DirectionFactory' : DirectionFactory, 
                'FlightFactory' : FlightFactory
            });
            service.controllers.vmTracker = $controller('flightTracker', {
                'FlightFactory': FlightFactory, 
                'ActivityFactory' : ActivityFactory, 
                'DirectionFactory' : DirectionFactory, 
                '$scope' : $rootScope
            });

            service.controllers.vmSearch = $controller('flightSearchController', {
                'FlightFactory': FlightFactory, 
                '$scope': $rootScope,
                '$state': $state
            });    
        }
    }
})();