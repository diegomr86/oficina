/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function DashboardCtrl($scope, $auth, $location, notify) {

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
};


angular
    .module('inspinia')
    .controller('DashboardCtrl', DashboardCtrl)