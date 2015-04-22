(function() {
    angular
        .module('zephyr')
        .service('SpeechService', Service);

    function Service($rootScope) {
        this.speak = speak;
        this.listen = listen;
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
    }
})();