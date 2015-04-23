(function() {
    angular
        .module('zephyr')
        .controller('mainController', mainController);

    function mainController($scope, $geolocation, $modal, $log, DirectionFactory, FlightFactory) {
        vm = this;

        vm.open = openModal;

        function openModal(size) {
            var modalInstance = $modal.open({
                templateUrl: './partials/spinner_modal.html',
                size: size,
                
            });

            modalInstance.result.then(function handleModal(selectedItem) {
                $scope.selected = selectedItem;
            }, function modalGone() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    }
})();