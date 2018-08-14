/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function DashboardCtrl($scope, $auth, $location, notify, Config) {

    notify.config({ position: 'right'} )

    $scope.signout = function(){
      $auth.signOut()
        .then(function(resp) {
          $location.path("/signin")
        })
        .catch(function(resp) {
        });
    }
    console.log("dashboard")

    $scope.service_type_list = Config.service_type_list
};


angular
    .module('inspinia')
    .controller('DashboardCtrl', DashboardCtrl)