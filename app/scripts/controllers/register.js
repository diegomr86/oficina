function RegisterCtrl($scope, $auth, $state) {
  $scope.submit = function(){
    console.log("asdfasdf")
    console.log($scope)
    if ($scope.user) {
      $auth.submitRegistration($scope.user)
        .then(function(resp) {
          console.log('then')
          console.log(resp)
          $state.go('dashboard.index')
        })
        .catch(function(resp) {
          console.log('catch')
          if (resp.data && resp.data.errors) {
            $scope.user.errors = resp.data.errors
          }
        });
    }
  }

}; 

angular
    .module('inspinia')
    .controller('RegisterCtrl', RegisterCtrl)