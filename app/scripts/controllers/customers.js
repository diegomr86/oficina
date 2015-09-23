function CustomersCtrl($http, $scope, $modal, Config, notify, SweetAlert) {

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
      templateUrl: 'views/customer.html'
    });
  }

  function list() {
    $http.get(Config.apiUrl + '/customers.json', { params: $scope.filter_form } ).success(function(data){
      $scope.customers = data
    });

    $scope.customer = undefined
    $scope.customer_form = undefined
  }

  $scope.filter = function(){
    list();
  }

  $scope.show = function(index){
    $scope.customer = $scope.customers[index]
    $scope.current_index = index
    $scope.openModal()
  }

  $scope.edit = function(index){
    $scope.customer = undefined
    $scope.customer_form = $scope.customers[index]
    $scope.current_index = index
    $scope.openModal()
  }

  $scope.new = function(){
    $scope.customer = undefined
    $scope.customer_form = {}
    $scope.openModal()
  }

  $scope.create = function(){
    if ($scope.customer_form) {
      $http.post(Config.apiUrl + '/customers.json', { customer: $scope.customer_form } ).success(function(data){
        $scope.customers.push(data)
        $scope.customer_form = {}
        $scope.closeModal()
        notify({ message: 'Cliente cadastrado com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
      }).error(function(error){
        $scope.customer_form.errors = error
      });      
    }
  }

  $scope.update = function(){
    if ($scope.customer_form) {
      $http.put(Config.apiUrl + '/customers/'+$scope.customer_form.id+'.json', { customer: $scope.customer_form } ).success(function(data){
        $scope.customer_form = {}
        $scope.closeModal()
        notify({ message: 'Cliente atualizado com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
      }).error(function(error){
        $scope.customer_form.errors = error
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
        $http.delete(Config.apiUrl + '/customers/'+$scope.customers[index].id+'.json' ).success(function(data){
          $scope.customers.splice(index, 1)
          if ($scope.current_index == index) {
            $scope.customer = undefined
            $scope.customer_form = undefined
            $scope.current_index = undefined
          }
          $scope.closeModal()
          notify({ message: 'Cliente excluído com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
        }).error(function(error){
          notify({ message: 'Não foi possível excluir este cliente', classes: 'alert-error', position: 'right', templateUrl: 'views/common/notify.html'});
        });      
      }
    });
      
  }

  list();

};

angular
    .module('inspinia')
    .controller('CustomersCtrl', CustomersCtrl)