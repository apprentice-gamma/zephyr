(function() {
    angular
        .module('zephyr')
        .service('SpeechService', Service);

    function Service($rootScope) {
        this.speak = speak;
        this.listen = listen;
        this.restart = false;
        this.listenForCommands = listenForCommands;
        ////////////////

        function speak(message) {
        	console.log("I'M A SPEECH SERVICE");
        	var msg = new SpeechSynthesisUtterance(message);
			window.speechSynthesis.speak(msg);
        }

        function listenForCommands(vm) {
            console.log("I'M A RECOGNITION SERVICE THAT LISTENS CONTINUOUSLY");
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function handleStart() {
                console.log("Beginning Recognition");
                this.restart = false;

            };
            recognition.onresult = function handleResult(data) {
                console.log('RESULTS', data.results);
                var result = data.results[data.results.length - 1]['0'].transcript;
                if (result.toLowerCase().indexOf('stop') >= 0){
                    alert("STOPING RECOGNITION");
                    recognition.abort();
                }
                if (result.toLowerCase().indexOf('banana') >= 0) {
                    if(data.results[data.results.length - 1]['0'].confidence > 0.75) {
                        alert("TACO");
                        recognition.abort();
                        this.restart = true;
                    }

                }

                if (result.toLowerCase().indexOf('flight') >= 0) {
                    vm.flight = 'banana';
                }
                if (result.toLowerCase().indexOf('airport') >= 0) {
                    vm.test = 'apple';
                }

                console.log('RECOGNIZED: ', result);
                console.log('RESULTS', data.results);
                $rootScope.$apply();
            };
            recognition.onsoundend = function handleSound() {
                console.log("SOUND END");
            };
            recognition.onend = function handleEnd() {
                console.log('ENDING RECOGNITION');
                if (this.restart)
                    recognition.start();
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