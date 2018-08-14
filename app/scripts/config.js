/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */
$.cloudinary.config().cloud_name = 'dsoz5vac0';
$.cloudinary.config().upload_preset = 'ovjrkvfl';

function config($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, Config) {

    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    delete $httpProvider.defaults.headers.post["If-Modified-Since"]
    console.log($httpProvider.defaults.headers.post )

    $authProvider.configure({
        apiUrl: Config.apiUrl,
        emailRegistrationPath:   '/auth.json'
    });

    $urlRouterProvider.otherwise("/dashboard/cars");
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
        .state('print_estimate', {
            url: '/print_estimate/:id',
            templateUrl: 'views/print_estimate.html',
            controller: 'PrintEstimateCtrl',
            pageTitle: 'Orçamento'
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
            controller: 'CarsCtrl',
            pageTitle: 'Carros'
        })
        .state('dashboard.car', {
            url: '/cars/:id',
            templateUrl: 'views/car.html',
            controller: 'CarCtrl'
        })
        .state('dashboard.services', {
            url: '/services',
            templateUrl: 'views/services.html',
            controller: 'ServicesCtrl'
        });
        
}
angular
    .module('inspinia')
    .constant('Config', { 
        // apiUrl: 'http://localhost:3000',
        apiUrl: 'http://oficina-api.herokuapp.com',
        service_type_list: { 
            manutencao: { description: 'Manutenção', class: 'primary' },
            polimento: { description: 'Polimento', class: 'info' },
            pintura: { description: 'Pintura', class: 'success' },
            solda: { description: 'Solda', class: 'warning' },
            lanternagem: { description: 'Lanternagem', class: 'danger' }
        }
    })
    .config(config)
    .run(function($rootScope, $state) {
        // $rootScope.$on('auth:validation-error', function(ev) {
        //     alert('goodbye');
        // });
        $rootScope.$state = $state;
    });