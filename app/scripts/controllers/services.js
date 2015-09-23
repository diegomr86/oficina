function ServicesCtrl($http, $scope, $modal, Config, notify, SweetAlert) {

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
      templateUrl: 'views/service.html'
    });
  }

  function load_customers(){
    $http.get(Config.apiUrl + '/customers.json' ).success(function(data){
      $scope.customers = data
    });
  }

  $scope.list = function() {
    $http.get(Config.apiUrl + '/services.json', { params: $scope.filter_form } ).success(function(data){
      $scope.services = data
    });

    $scope.service = undefined
    $scope.service_form = {}
  }

  $scope.filter = function(){
    $scope.list();
  }

  $scope.show = function(index){
    $scope.service = $scope.services[index]
    $scope.current_index = index
    $scope.openModal()
  }

  $scope.edit = function(index){
    $scope.service = undefined
    $scope.service_form = $scope.services[index]
    $scope.current_index = index
    $scope.openModal()
  }

  $scope.new = function(){
    $scope.service = undefined
    $scope.service_form = {}
    $scope.openModal()

    $scope.$watch("service_form.customer_id", function(newValue, oldValue) {
      $scope.cars = []
      if (newValue) {
        $http.get(Config.apiUrl + '/cars.json', { params: { customer_id: newValue } } ).success(function(data){
          $scope.cars = data
        });  
      }
      console.log(newValue)
    });
  }

  $scope.create = function(){
    console.log('asdfasdfadsf')
    if ($scope.service_form) {
      $http.post(Config.apiUrl + '/services.json', { service: $scope.service_form } ).success(function(data){
        $scope.services.push(data)
        $scope.service_form = {}
        $scope.closeModal()
        notify({ message: 'Serviço cadastrado com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
      }).error(function(error){
        $scope.service_form.errors = error
      });      
    }
  }

  $scope.update = function(){
    if ($scope.service_form) {
      $http.put(Config.apiUrl + '/services/'+$scope.service_form.id+'.json', { service: $scope.service_form } ).success(function(data){
        $scope.service_form.customer = $scope.service_form.customer_attributes
        $scope.service_form = {}
        $scope.closeModal()
        notify({ message: 'Serviço atualizado com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
      }).error(function(error){
        $scope.service_form.errors = error
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
        $http.delete(Config.apiUrl + '/services/'+$scope.services[index].id+'.json' ).success(function(data){
          $scope.services.splice(index, 1)
          if ($scope.current_index == index) {
            $scope.service = undefined
            $scope.service_form = undefined
            $scope.current_index = undefined
          }
          $scope.closeModal()
          notify({ message: 'Serviço excluído com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
        }).error(function(error){
          notify({ message: 'Não foi possível excluir este serviço', classes: 'alert-error', position: 'right', templateUrl: 'views/common/notify.html'});
        });      
      }
    });
      
  }

  $scope.list();
  load_customers();

};

angular
    .module('inspinia')
    .controller('ServicesCtrl', ServicesCtrl)