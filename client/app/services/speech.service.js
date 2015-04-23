(function() {
    angular
        .module('zephyr')
        .service('SpeechService', Service);

    function Service() {
        this.speak = speak;
        ////////////////

        function speak(message) {
        	console.log("I'M A SPEECH SERVICE");
        	var msg = new SpeechSynthesisUtterance(message);
			window.speechSynthesis.speak(msg);
        }
    }
})();
