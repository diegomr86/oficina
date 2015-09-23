function CarsCtrl($http, $scope, $modal, Config, notify, SweetAlert) {

var modalInstance = undefined;

  $scope.closeModal = function() {
    if (modalInstance) {
      modalInstance.close()
    }
  }

  $scope.openModal = function() {
    $scope.closeModal()
    modalInstance = $modal.open({
      scope: $scope,
      templateUrl: 'views/car.html'
    });
  }

  function load_customers(){
    $http.get(Config.apiUrl + '/customers.json' ).success(function(data){
      $scope.customers = data
    });
  }

  function list() {
    $http.get(Config.apiUrl + '/cars.json', { params: $scope.filter_form } ).success(function(data){
      $scope.cars = data
    });

    $scope.car = undefined
    $scope.car_form = {}
  }

  $scope.filter = function(){
    list();
  }

  $scope.show = function(index){
    $scope.car = $scope.cars[index]
    $scope.current_index = index
    $scope.openModal()
  }

  $scope.edit = function(index){
    $scope.car = undefined
    $scope.car_form = $scope.cars[index]
    $scope.current_index = index
    $scope.openModal()
  }

  $scope.new = function(){
    $scope.car = undefined
    $scope.car_form = {}
    $scope.openModal()
  }

  $scope.create = function(){
    if ($scope.car_form) {
      $http.post(Config.apiUrl + '/cars.json', { car: $scope.car_form } ).success(function(data){
        $scope.cars.push(data)
        $scope.car_form = {}
        $scope.closeModal()
        notify({ message: 'Carro cadastrado com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
      }).error(function(error){
        $scope.car_form.errors = error
      });      
    }
  }

  $scope.update = function(){
    if ($scope.car_form) {
      $http.put(Config.apiUrl + '/cars/'+$scope.car_form.id+'.json', { car: $scope.car_form } ).success(function(data){
        $scope.car_form.customer = $scope.car_form.customer_attributes
        $scope.car = $scope.car_form
        $scope.car_form = {}
        $scope.closeModal()
        notify({ message: 'Carro atualizado com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
      }).error(function(error){
        $scope.car_form.errors = error
      });      
    }
  }

  $scope.destroy = function(index){
    SweetAlert.swal({
        title: "Você tem certeza?",
        text: "Cuidado, esta operação não pode ser desfeita!",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim, pode excluír!",
        closeOnConfirm: true
    }, function (choise) {
      if (choise) {
        $http.delete(Config.apiUrl + '/cars/'+$scope.cars[index].id+'.json' ).success(function(data){
          $scope.cars.splice(index, 1)
          if ($scope.current_index == index) {
            $scope.car = undefined
            $scope.car_form = undefined
            $scope.current_index = undefined
          }
          $scope.closeModal()
          notify({ message: 'Carro excluído com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
        }).error(function(error){
          notify({ message: 'Não foi possível excluir este carro', classes: 'alert-error', position: 'right', templateUrl: 'views/common/notify.html'});
        });      
      }
    });
      
  }

  list();
  load_customers();

};

angular
    .module('inspinia')
    .controller('CarsCtrl', CarsCtrl)