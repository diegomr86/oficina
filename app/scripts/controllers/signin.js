function SigninCtrl($scope, $auth, $state) {
  $scope.submit = function(){
    console.log("asdfasdf")
    console.log($scope)
    if ($scope.user) {
      $auth.submitLogin($scope.user)
        .then(function(resp) {
          console.log('then')
          console.log(resp)
          $state.go('dashboard.cars')
        })
        .catch(function(resp) {
          console.log('catch')
          console.log(resp)
          if (resp.errors) {
            $scope.user.errors = resp.errors
          }
        }
      );
    }
  }
};

angular
    .module('inspinia')
    .controller('SigninCtrl', SigninCtrl)