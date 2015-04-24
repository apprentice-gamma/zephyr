(function() {
    angular
        .module('zephyr')
        .service('SpeechService', Service);

    function Service($rootScope) {
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

        function listenForCommands(vmEntry, vmMain) {
            console.log("I'M A RECOGNITION SERVICE THAT LISTENS CONTINUOUSLY");
            var recognition = new webkitSpeechRecognition();
            var startPosition, command;
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
                if ((result.indexOf('departure') != -1) && this.okZephyr) {
                    console.log('DEPARTURE');
                    vmEntry.trackFlight('dep', vmMain);

                }

                if ((result.indexOf('arrival') != -1) && this.okZephyr) {
                    console.log('ARRIVAL');
                    vmEntry.trackFlight('arr', vmMain);
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
    }
})();