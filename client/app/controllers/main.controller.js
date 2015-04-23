(function() {
    angular
        .module('zephyr')
        .controller('mainController', mainController);

    function mainController($scope, $geolocation, $modal, $log, DirectionFactory, FlightFactory) {
        vm = this;

        vm.open = openModal;

        function openModal(size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    }
})();

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('zephyr').controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  // $scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  // $scope.ok = function () {
  //   $modalInstance.close($scope.selected.item);
  // };

  // $scope.cancel = function () {
  //   $modalInstance.dismiss('cancel');
  // };
});