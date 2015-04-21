(function() {
    angular
        .module('module')
        .service('Service', Service);

    function Service() {
        this.speak = speak;

        ////////////////

        function speak(message) {
        	var msg = new SpeechSynthesisUtterance(message);
			window.speechSynthesis.speak(msg);
        }
    }
})();