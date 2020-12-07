// Ionic Starter App

//Ionic y firebase se encuentran en el index
//app.services está en services.js
//app.controllers' está en controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives','firebase'])
.config(function($ionicConfigProvider) {
    //Añadimos la configuración
    //Desactivamos el scrolling
    $ionicConfigProvider.scrolling.jsScrolling(false);
    //Añadimos los botones del tab a la parte de abajo
    $ionicConfigProvider.tabs.position('bottom'); 
})
//Desactivamos el sideBar
.run(function($ionicPlatform,$rootScope) {

  $rootScope.extras = false;

  $ionicPlatform.ready(function() {
   
    //Desactivamos el accesorio del teclado y el scroll
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      
      StatusBar.styleDefault();
    }
  });
})
