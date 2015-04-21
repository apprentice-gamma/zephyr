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

        function listen() {
            console.log("I'M A RECOGNITION SERVICE");
            var recognition = new webkitSpeechRecognition();
            recognition.onresult = function(event) { 
                console.log(event.results['0']['0'].transcript);
                console.log(event);
                var result = event.results['0']['0'].transcript;
                $rootscope.$broadcast('SPEECH_RECOGNIZED', result);

            };
            recognition.start();
        }
    }
})();