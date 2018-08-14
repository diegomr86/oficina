function PrintEstimateCtrl($stateParams, $http, $scope, Config) {
  
  $scope.service_type_list = Config.service_type_list
  
  $http.get(Config.apiUrl + '/cars/'+$stateParams.id+'.json').success(function(data){
  
    $scope.car = data
  
    $scope.total_services = Object.keys($scope.car.services).map(function(k){
      return +$scope.car.services[k].value;
    }).reduce(function(a,b){ return a + b },0);
  
    $scope.total_materials = Object.keys($scope.car.materials).map(function(k){
      return +$scope.car.materials[k].value;
    }).reduce(function(a,b){ return a + b },0);
  
  });
};

angular
    .module('inspinia')
    .controller('PrintEstimateCtrl', PrintEstimateCtrl)