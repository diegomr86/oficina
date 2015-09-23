/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $authProvider, Config) {

    $authProvider.configure({
        apiUrl: Config.apiUrl,
        emailRegistrationPath:   '/auth.json'
    });

    $urlRouterProvider.otherwise("/dashboard");
    $stateProvider
        .state('index', {
            url: "/index",
            templateUrl: "views/index.html",
        })

        .state('signin', {
            url: "/signin",
            templateUrl: "views/signin.html",
            data: { pageTitle: 'Entrar' }
        })
        .state('register', {
            url: "/register",
            templateUrl: "views/register.html",
            data: { pageTitle: 'Entrar' }
        })

        // only authenticated users will be able to see routes that are
        // children of this state
        .state('dashboard', {
            abstract: true,
            url: '/dashboard',
            templateUrl: "views/common/content.html",
            controller: 'DashboardCtrl',
            resolve: {
              auth: function($auth, $state) {
                return $auth.validateUser().catch(function(){
                  // redirect unauthorized users to the login page
                  $state.go('signin');
                });
              }
            }
        })
        .state('dashboard.index', {
            url: '',
            templateUrl: 'views/dashboard.html'            
        })
        // this route will only be available to authenticated users
        .state('dashboard.customers', {
            url: '/customers',
            templateUrl: 'views/customers.html',
            controller: 'CustomersCtrl'
        })
        .state('dashboard.cars', {
            url: '/cars',
            templateUrl: 'views/cars.html',
            controller: 'CarsCtrl'
        })
        .state('dashboard.services', {
            url: '/services',
            templateUrl: 'views/services.html',
            controller: 'ServicesCtrl'
        });
}
angular
    .module('inspinia')
    .constant('Config', { apiUrl: 'http://localhost:3000' })
    .config(config)
    .run(function($rootScope, $state) {
        // $rootScope.$on('auth:validation-error', function(ev) {
        //     alert('goodbye');
        // });
        $rootScope.$state = $state;
    });