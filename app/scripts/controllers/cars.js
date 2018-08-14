function CarsCtrl($http, $scope, $rootScope, $modal, Config, notify, SweetAlert, $state, $filter, Upload) {


  $rootScope.pageTitle = "asdfasdf"
  var modalInstance = undefined;

  $scope.PieChart5 = {
        data: [226, 134],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
  };

  function load_customers(){
    $http.get(Config.apiUrl + '/customers.json' ).success(function(data){
      $scope.customers = data
    });
  }

  $scope.list = function(){
    $http.get(Config.apiUrl + '/cars.json', { params: $scope.filter_form } ).success(function(data){
      $scope.cars = data
    });

    $scope.car = undefined
  }

  $scope.print = function() {
    $rootScope.print_car = $scope.car
    $state.go('print_estimate')
  }

  $scope.filter = function(){
    $scope.list();
  }

  $scope.$watch('car.services', function(newValue, oldValue) {
    
    if (newValue && oldValue) {
      console.log(newValue)
      angular.forEach(newValue, function(service, index){
        if (service.checked != oldValue[index].checked) {
          $http.put(Config.apiUrl + '/services/'+service.id+'.json', { service: service } ).success(function(data){
            console.log(data)
          }).error(function(error){
            console.log(error)
          }); 

        }

      });
    }
  },true);

  $scope.$watch('car.materials', function(newValue, oldValue) {
    
    if (newValue && oldValue) {
      console.log(newValue)
      angular.forEach(newValue, function(material, index){
        if (material.checked != oldValue[index].checked) {
          $http.put(Config.apiUrl + '/materials/'+material.id+'.json', { material: material } ).success(function(data){
            console.log(data)
          }).error(function(error){
            console.log(error)
          }); 

        }

      });
    }
  },true);


  $scope.show = function(index){
    $scope.car_form = undefined
    $scope.car = $scope.cars[index]
    $scope.current_index = index
    $scope.service_form = { car_id: $scope.car.id }
    $scope.material_form = { car_id: $scope.car.id }
    $scope.car_view = 'servicos'
  }

  $scope.uploadFiles = function(files){
    console.log(files)
    $scope.files = files;
    if (!$scope.files) return;
    angular.forEach(files, function(file){
      if (file && !file.$error) {
        p = {
          url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
          fields: {
            upload_preset: $.cloudinary.config().upload_preset,
            tags: 'myphotoalbum',
            context: 'photo=' + $scope.car.id
          },
          file: file
        }
        console.log(p)
        file.upload = Upload.upload(p).progress(function (e) {
          file.progress = Math.round((e.loaded * 100.0) / e.total);
          file.status = "Uploading... " + file.progress + "%";
          console.log(file)
        }).success(function (data, status, headers, config) {
          $rootScope.photos = $rootScope.photos || [];
          data.context = {custom: {photo: $scope.title}};
          $scope.files = $filter('filter')($scope.files, {blobUrl: '!'+file.blobUrl})
          $scope.files = $filter('filter')($scope.files, {blobUrl: '!'+file.blobUrl})
          console.log($scope.files)
          $http.post(Config.apiUrl + '/cars/'+$scope.car.id+'/pictures.json', { picture: { public_id: data.public_id } } ).success(function(data){
            $scope.car.pictures.push(data);
          }).error(function(error){
            console.log(error)
          });
        }).error(function (data, status, headers, config) {
          console.log(data)
          console.log(status)
          console.log(headers)
          console.log(config)
          file.result = data;
        });
      }
    });
  };

  $scope.edit = function(index){
    $scope.car = undefined
    $scope.car_form = $scope.cars[index]
    console.log($scope.car_form)

    $scope.current_index = index
  }

  $scope.new = function(){
    $scope.car = undefined
    $scope.car_form = { }
  }

  $scope.create = function(){
    if ($scope.car_form) {
      $http.post(Config.apiUrl + '/cars.json', { car: $scope.car_form } ).success(function(data){
        $scope.cars.push(data)
        $scope.show($scope.cars.length - 1)
        notify({ message: 'Carro cadastrado com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
      }).error(function(error){
        $scope.car_form.errors = error
      });      
    }
  }

  $scope.update = function(){
    if ($scope.car_form) {
      $http.put(Config.apiUrl + '/cars/'+$scope.car_form.id+'.json', { car: $scope.car_form } ).success(function(data){
        $scope.cars[$scope.current_index] = data
        $scope.show($scope.current_index)
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
          notify({ message: 'Carro excluído com sucesso', classes: 'alert-info', position: 'right', templateUrl: 'views/common/notify.html'});
        }).error(function(error){
          notify({ message: 'Não foi possível excluir este carro', classes: 'alert-error', position: 'right', templateUrl: 'views/common/notify.html'});
        });      
      }
    });
      
  }

  $scope.create_service = function(){
    console.log('asdfasdfadsf', $scope.service_form)

    if ($scope.service_form) {
      $http.post(Config.apiUrl + '/services.json', { service: $scope.service_form } ).success(function(data){
        $scope.car.services.push(data)
        $scope.service_form = { car_id: $scope.car.id }
      }).error(function(error){
        $scope.service_form.errors = error
      });      
    }
  }

  $scope.create_material = function(){
    console.log('asdfasdfadsf', $scope.material_form)

    if ($scope.material_form) {
      $http.post(Config.apiUrl + '/materials.json', { material: $scope.material_form } ).success(function(data){
        $scope.car.materials.push(data)
        $scope.material_form = { car_id: $scope.car.id }
      }).error(function(error){
        $scope.material_form.errors = error
      });      
    }
  }

  $scope.list();
  load_customers();

};

angular
    .module('inspinia')
    .controller('CarsCtrl', CarsCtrl)