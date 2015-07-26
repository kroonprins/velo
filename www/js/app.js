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

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('main', {
    url: '',
    abstract: true,
    templateUrl: 'templates/main.html'
  })

  .state('main.saved', {
    url: '/saved',
    views: {
      'saved': {
        templateUrl: 'templates/velo-saved.html',
        controller: 'VeloMainCtrl'
      }
    }
  })
  .state('main.station', {
      url: '/station/:stationId',
      views: {
        'station': {
          templateUrl: 'templates/velo-station.html',
          controller: 'VeloStationCtrl'
        }
      }
    })

  .state('main.search', {
      url: '/search',
      views: {
        'search': {
          templateUrl: 'templates/velo-search.html',
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
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/saved');

});
