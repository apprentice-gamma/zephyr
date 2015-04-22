(function(){
  angular
    .module('zephyr')
    .controller('mainController', mainController);

  function mainController($scope, uiGmapGoogleMapApi, $geolocation) {
    var vm = this;
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    uiGmapGoogleMapApi.then(function(maps) {

    });

    $geolocation.getCurrentPosition({
      timeout: 60000
    }).then(function(position) {
      $scope.myPosition = position;
      console.log($scope.myPosition);
    });
  }
})();