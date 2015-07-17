angular.module('veloApp', ['ionic', 'veloControllers', 'veloFilters', 'veloServices' ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function ($ionicConfigProvider) {
    // caching is great, except if it results in an avalanche of issues ;-)
    $ionicConfigProvider.views.maxCache(0);

    // force same layout on all devices
    $ionicConfigProvider.tabs.position('bottom');
  })
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('main', {
    url: '',
    abstract: true,
    templateUrl: 'templates/main.html'
  })

  // Each tab has its own nav history stack:

  .state('main.saved', {
    url: '/saved',
    views: {
      'saved': {
        templateUrl: 'templates/velo-saved.html',
        controller: 'VeloMainCtrl'
      },
      'header' : {
        templateUrl: 'templates/header.html',
        //controller: 'VeloMainCtrl'
      },
      'footer' : {
        templateUrl: 'templates/footer.html',
        //controller: 'VeloMainCtrl'
      }
    }
  })
  .state('main.station', {
      url: '/station/:stationId',
      views: {
        'station': {
          templateUrl: 'templates/velo-station.html',
          controller: 'VeloStationCtrl'
        },
        'header' : {
          templateUrl: 'templates/header.html',
          //controller: 'VeloMainCtrl'
        },
        'footer' : {
          templateUrl: 'templates/footer.html',
          //controller: 'VeloMainCtrl'
        }
      }
    })

  .state('main.search', {
      url: '/search',
      views: {
        'search': {
          templateUrl: 'templates/velo-search.html',
          //controller: 'VeloMainCtrl'
        },
        'header' : {
          templateUrl: 'templates/header.html',
          //controller: 'VeloMainCtrl'
        },
        'footer' : {
          templateUrl: 'templates/footer.html',
          //controller: 'VeloMainCtrl'
        }
      },
      abstract: true
  })
  .state('main.search.search-station', {
      url: '/station',
      views: {
        'search-station': {
          templateUrl: 'templates/velo-search-station.html',
          controller: 'VeloSearchStationCtrl'
        }
      }
    })
  .state('main.search.search-nearby', {
      url: '/nearby',
      views: {
        'search-nearby': {
          templateUrl: 'templates/velo-search-nearby.html',
          controller: 'VeloSearchNearbyCtrl'
        }
      }
    })
  .state('main.search.search-address', {
      url: '/address',
      views: {
        'search-address': {
          templateUrl: 'templates/velo-search-address.html',
          controller: 'VeloSearchAddressCtrl'
        }
      }
  })

  .state('main.route', {
      url: '/route',
      views: {
        'route': {
          templateUrl: 'templates/velo-route.html',
          controller: 'VeloRouteCtrl'
        },
        'header' : {
          templateUrl: 'templates/header.html',
        },
        'footer' : {
          templateUrl: 'templates/footer.html',
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/saved');

});

  /*function($routeProvider) {
          $routeProvider.
                when('/velo', {
                        templateUrl: 'templates/velo-main.html',
                        controller: 'VeloMainCtrl'
                }).
                when('/velo/:stationId', {
                        templateUrl: 'templates/velo-station.html',
                        controller: 'VeloStationCtrl'
                }).
                when('/search/:searchType', {
                        templateUrl: 'templates/velo-search.html',
                        controller: 'VeloSearchCtrl'
                }).
                otherwise({
                        redirectTo: '/velo'
                });
  }]);*/
