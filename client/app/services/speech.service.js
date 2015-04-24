(function() {
    angular
        .module('zephyr')
        .service('SpeechService', Service);

    function Service($rootScope, $controller, $geolocation, $modal, $log, FlightFactory, DirectionFactory, ActivityFactory) {
        this.speak = speak;
        this.listen = listen;
        this.restart = false;
        this.okZephyr = false;
        this.listenForCommands = listenForCommands;
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
            var recognition = new webkitSpeechRecognition();
            var startPosition, command, date;

            var vmEntry = $controller('flightEntry');
            var vmMain = $controller('mainController', {
                '$scope': $rootScope, 
                '$geolocation': $geolocation, 
                '$modal': $modal, 
                '$log' : $log, 
                'DirectionFactory' : DirectionFactory, 
                'FlightFactory' : FlightFactory
            });
            var vmTracker = $controller('flightTracker', {
                'FlightFactory': FlightFactory, 
                'ActivityFactory' : ActivityFactory, 
                'DirectionFactory' : DirectionFactory, 
                '$scope' : $rootScope
            });

            console.log(vmTracker);
            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.onstart = function handleStart() {
                console.log("Beginning Recognition");
                this.restart = false;

            };
            recognition.onresult = function handleResult(data) {
                console.log('RESULTS', data.results);
                var result = data.results[data.results.length - 1]['0'].transcript.toLowerCase();
                var confidence = data.results[data.results.length - 1]['0'].confidence;
                if ((result.indexOf('okay zephyr') != -1) && (confidence >= 0.5)) {
                    console.log("LISTENING...");
                    speak('Now Listening for Command');
                    this.okZephyr = true;
                }
                if ((result.indexOf('cancel') != -1) && (confidence >= 0.75)) {
                    console.log("NOT LISTENING...");
                    this.okZephyr = false;
                }

                if ((result.indexOf('zephyr time') != -1) && this.okZephyr) {
                    date =  FlightFactory.calculateCountdown(FlightFactory.connectionTime);
                    speak('Driving ETA to Airport is about' + Math.round(DirectionFactory.drivingMinutes) + ' minutes');
                    speak('ETA of flight event is ' + Math.round(date) + ' minutes');
                    this.okZephyr = false;
                }

                if ((result.indexOf('departure') != -1) && this.okZephyr) {
                    console.log('DEPARTURE');
                    vmEntry.trackFlight('dep', vmMain);
                    speak('Thank you, please drive carefully');
                    this.okZephyr = false;

                }

                if ((result.indexOf('arrival') != -1) && this.okZephyr) {
                    console.log('ARRIVAL');
                    vmEntry.trackFlight('arr', vmMain);
                    speak('Thank you, please drive carefully');
                    this.okZephyr = false;
                }

                if ((result.indexOf('flight') != -1) && this.okZephyr) {
                    startPosition = (result.indexOf('flight') + 6);
                    command = result.slice(startPosition, result.length);
                    if (confidence >= 0.88){
                        vmEntry.FlightFactory.flight = command;
                        speak('Thank you, please confirm your flight');
                        this.okZephyr = false;
                    }
                }

                if ((result.indexOf('airport') != -1) && this.okZephyr) {
                    startPosition = (result.indexOf('airport') + 6);
                    command = result.slice(startPosition, result.length);
                    if (confidence >= 0.88){
                        vmEntry.airport = command;
                        speak('Thank you, please confirm your airport');
                        this.okZephyr = false;
                    }
                }

                if (result.toLowerCase().indexOf('stop') >= 0) {
                    console.log("STOPING RECOGNITION");
                    recognition.abort();
                }

                console.log('RECOGNIZED: ', result);
                console.log('RESULTS', data.results);
                $rootScope.$apply();
            };

            recognition.onend = function handleEnd() {
                console.log('ENDING RECOGNITION');
                if (this.restart)
                    recognition.start();
            };

            recognition.onerror = function handleError(error) {
                console.log('ERROR! ', error);
            };

            recognition.start();
        }

    }
})();