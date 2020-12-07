angular.module('app.controllers', [])
//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas, está definida en services.js
//$ionicHistory realiza un seguimiento de las vistas mientras el usuario navega por la aplicación
// $state para cambiar de página
//$ionicSideMenuDelegate para permitir que se pueda arrastrar el contenido

.controller('loginCtrl', function($scope,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate) {
    $rootScope.extras = false;  // Se esconde el sidebar

    // Cuando un usuario cierra sesión y va a la pantalla de inicio
    // se limpia todo el historial y caché 
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });



    
    //Comprueba si un usuario ha iniciado sesión
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $ionicSideMenuDelegate.canDragContent(true);  // Permite que puedas arrastrar el contenido del Menu del sidebar
        $rootScope.extras = true;
        sharedUtils.hideLoading();
        $state.go('menu2', {}, {location: "replace"});

      }
    });


    $scope.loginEmail = function(formName,cred) {


      if(formName.$valid) {  //Comprueba si los datos del formulario son válidos o no

          sharedUtils.showLoading();
          

          //Iniciar sesión con email
          firebase.auth().signInWithEmailAndPassword(cred.email,cred.password).then(function(result) {
                //No necesitas guardar la sesión de los usuarios, eso lo controla firebase
             
                //  Limpiar el historial de la pagina de inicio
                
              $ionicHistory.nextViewOptions({
                historyRoot: true
              });
               // Asingarle un valor a $rootScope.extra
              $rootScope.extras = true;
              // Desactivar el cargado
              sharedUtils.hideLoading();
                // Ir a la página del menú
              $state.go('menu2', {}, {location: "replace"});

            },
            //Error de autentificación
            function(error) {
              sharedUtils.hideLoading();
              sharedUtils.showAlert("Error","Error de autentificación");
            }
        );

      }else{
        //Error de los datos introducidos
        sharedUtils.showAlert("Error","Los datos introducidos no son válidos");
      }



    };


 


})
  //Controlador de registro

//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas, está definida en services.js
//$ionicSideMenuDelegate para permitir que se pueda arrastrar el contenido 
//$state para cambiar de página
//fireBaseData sirve para obtener datos de Firebase
//$ionicHistory realiza un seguimiento de las vistas mientras el usuario navega por la aplicación


.controller('signupCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
                                   $state,fireBaseData,$ionicHistory) {
    $rootScope.extras = false; // Se utiliza para esconder el side bar

    $scope.signupEmail = function (formName, cred) {
      
      if (formName.$valid) {  // Comprueba si los datos del formulario son válidos

        sharedUtils.showLoading();

        //Autentificación de Firebase con email y contraseña
        firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function (result) {

            //Añade el nombre y la URL de la imagen al perfil
            result.updateProfile({
              displayName: cred.name,
              photoURL: "default_dp"
            }).then(function() {}, function(error) {});
        

            //Añade los datos del usuario registrado a la base de datos
            fireBaseData.refUser().child(result.uid).set({
              name:cred.name,
              email: cred.email,
              password: cred.password,
              telephone: cred.phone
            });

            //Si se registra correctamente
            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $ionicSideMenuDelegate.canDragContent(true);  // Permite que puedas arrastrar el contenido del Menu del sidebar
            $rootScope.extras = true;
            sharedUtils.hideLoading();
            $state.go('menu2', {}, {location: "replace"}); // Va al menú

        }, function (error) {
            sharedUtils.hideLoading();
            sharedUtils.showAlert("Error","Error al registrarse");
        });

      }else{
        sharedUtils.showAlert("Error","Los datos introducidos no son válidos");
      }

    }

  })

  //Controlador del menú

//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//$ionicSideMenuDelegate para permitir que se pueda arrastrar el contenido 
//fireBaseData sirve para obtener datos de Firebase
//$state para cambiar de página
//$ionicHistory realiza un seguimiento de las vistas mientras el usuario navega por la aplicación
//$firebaseArray se utiliza para recuperar los datos de una de las referencias definidas en services.js
//sharedCartService nos permite realizar las operaciones sobre el carrito ya sea incrementar,disminuir o eliminar el producto del mismo, está definida en services.js
//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas, está definida en services.js

.controller('menu2Ctrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
                                  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils) {

  //Comprueba si el usuario esta logueado
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.user_info=user; //Guarda los datos en user_info
    }else {

      $ionicSideMenuDelegate.toggleLeft(); //Cierra el menú
      $ionicSideMenuDelegate.canDragContent(false);  //Desactivamos que pueda arrastrar el contenido

      //Nos manda a la vista de inicio de sesión
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $rootScope.extras = false;
      sharedUtils.hideLoading();
      $state.go('tabsController.login', {}, {location: "replace"});

    }
  });

  // Cuando navegamos al menú permitimos que podamos arrastrar el menú del sidebar
  $ionicSideMenuDelegate.canDragContent(true);
  $rootScope.extras=true;

  //limpia el historial y el cache
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }
  });


//Carga el menú obteniendo los datos de Firebase
  $scope.loadMenu = function() {
    sharedUtils.showLoading();
    $scope.menu=$firebaseArray(fireBaseData.refMenu());
    sharedUtils.hideLoading();
  }
//Añade el producto al carrito 
  $scope.addToCart=function(item){
    sharedCartService.add(item);
  };

})

//.controller('offersCtrl', function($scope,$rootScope) {

    //We initialise it on all the Main Controllers because, $rootScope.extra has default value false
    // So if you happen to refresh the Offer page, you will get $rootScope.extra = false
    //We need $ionicSideMenuDelegate.canDragContent(true) only on the menu, ie after login page
 //   $rootScope.extras=true;
//})


  //Controlador de la página principal

//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas, está definida en services.js
//$ionicHistory realiza un seguimiento de las vistas mientras el usuario navega por la aplicación
//$state para cambiar de página
//$ionicSideMenuDelegate para permitir que se pueda arrastrar el contenido 
//sharedCartService nos permite realizar las operaciones sobre el carrito ya sea incrementar,disminuir o eliminar el producto del mismo, está definida en services.js

.controller('indexCtrl', function($scope,$rootScope,sharedUtils,$ionicHistory,$state,$ionicSideMenuDelegate,sharedCartService) {

  
    //Comprueba si el usuario esta logueado
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user_info=user; //Guarda los datos en user_info
        $scope.user_info.password=user.password;
        $scope.user_info.email=user.email;
       
        //Solamente cuando el usuario haya iniciado sesión la cantidad en el carrito
        //se monstrará. Si no se mostrará un error por consola hasta que obtengamos el
        //objeto usuario
        $scope.get_total= function() {
          var total_qty=0;
          for (var i = 0; i < sharedCartService.cart_items.length; i++) {
            total_qty += sharedCartService.cart_items[i].item_qty;
          }
          return total_qty;
        };

      }else {

        $ionicSideMenuDelegate.toggleLeft(); //Cierra el menú
        $ionicSideMenuDelegate.canDragContent(false);  //Para borrar el espacio en blanco que queda en el menú

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {location: "replace"});

      }
    });
    //Función para cerrar sesión
    $scope.logout=function(){

      sharedUtils.showLoading();

      // Cierra sesión de firebase
      firebase.auth().signOut().then(function() {


        $ionicSideMenuDelegate.toggleLeft(); //Cierra el menú
        $ionicSideMenuDelegate.canDragContent(false);  //Para borrar el espacio en blanco que queda en el menú

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });


        $rootScope.extras = false;
        sharedUtils.hideLoading();
        //Nos lleva a la página de inicio de sesión
        $state.go('tabsController.login', {}, {location: "replace"});

      }, function(error) {
         sharedUtils.showAlert("Error","Error al cerrar sesión")
      });

    }

  })
//Controlador del carrito

//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//$state para cambiar de página
//sharedCartService nos permite realizar las operaciones sobre el carrito ya sea incrementar,disminuir o eliminar el producto del mismo, está definida en services.js
.controller('myCartCtrl', function($scope,$rootScope,$state,sharedCartService) {

    $rootScope.extras=true;

    //Comprueba si el usuario ha iniciado sesión
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        $scope.cart=sharedCartService.cart_items;  //Carga el carrito del usuario

        $scope.get_qty = function() {
          $scope.total_qty=0;
          $scope.total_amount=0;
          //Obtiene la cantidad de productos u el precio
          for (var i = 0; i < sharedCartService.cart_items.length; i++) {
            $scope.total_qty += sharedCartService.cart_items[i].item_qty;
            $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);
          }
          return $scope.total_qty;
        };
      }

    });
    //Función para cuando eliminamos un producto del carrito
    $scope.removeFromCart=function(c_id){
      sharedCartService.drop(c_id);
    };
    //Función para aumentar la cantidad de productos del carrito
    $scope.inc=function(c_id){
      sharedCartService.increment(c_id);
    };
    //Función para disminuir la cantidad de productos del carrito
    $scope.dec=function(c_id){
      sharedCartService.decrement(c_id);
    };
    //Función para navegar a la página de pagos
    $scope.checkout=function(){
      $state.go('checkout', {}, {location: "replace"});
    };



})
//Controlador de últimos pedidos

//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//fireBaseData sirve para obtener datos de Firebase
//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas, está definida en services.js
.controller('lastOrdersCtrl', function($scope,$rootScope,fireBaseData,sharedUtils) {

    $rootScope.extras = true;
    sharedUtils.showLoading();

    //Comprueba si un usuario ha iniciado sesión
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        $scope.user_info = user;
        //Obtiene los pedidos de la base de datos
        fireBaseData.refOrder()
        //Ordena los pedidos por la id del usuario
          .orderByChild('user_id')
        //Recupera todos los pedidos de un usuario con su id
          .startAt($scope.user_info.uid).endAt($scope.user_info.uid)
          //Obtiene el valor del pedido
          .once('value', function (snapshot) {
            $scope.orders = snapshot.val();
            $scope.$apply();
          });
          sharedUtils.hideLoading();
      }
    });





})

//.controller('favouriteCtrl', function($scope,$rootScope) {

 //   $rootScope.extras=true;
//})


//Controlador del menú de opciones

//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//fireBaseData sirve para obtener datos de Firebase
//$firebaseObject se utiliza para acceder a un objeto concreto, por ejemplo la dirección de un usuario
//$ionicPopuppermite crear y mostrar ventanas emergentes que requieren que el usuario interactue para continuar
//$window nos permite realizar varias operaciones en la ventana por ejemplo recargarla
//$firebaseArray se utiliza para recuperar los datos de una de las referencias definidas en services.js
//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas, está definida en services.js
.controller('settingsCtrl', function($scope,$rootScope,fireBaseData,$firebaseObject,
                                     $ionicPopup,$state,$window,$firebaseArray,
                                     sharedUtils) {
  
    $rootScope.extras=true;

    //Muestra la barra de carga
    sharedUtils.showLoading();

    //Comprueba si un usuario ha iniciado sesión
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //Accede a un array de objectos usando firebaseObject no te proporciona el $id, asi que hay que usar $firebaseArray para obtener el $id
       
        $scope.addresses= $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));

        
        $scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));

        $scope.user_info=user; //Guarda los datos en user_info
        
        //NOTE: $scope.user_info is not writable ie you can't use it inside ng-model of <input>
        //Debes crear una variable local para almacenar los emails
       
        $scope.data_editable={};
        $scope.data_editable.email=$scope.user_info.email;  
        $scope.data_editable.password="";

        $scope.$apply();

        sharedUtils.hideLoading();

      }

    });

    $scope.addManipulation = function(edit_val) { //Se encarga de añadir y editar las direcciones 


      if(edit_val!=null) {
        $scope.data = edit_val; // Para editar una dirección
        var title="Editar dirección";
        var sub_title="Edita tu dirección";
      }
      else {
        $scope.data = {};    // Para añadir una dirección
        var title="Añadir dirección";
        var sub_title="Añade tu nueva dirección";
      }
      // Un popup para añadir una nueva dirección
      var addressPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="Nombre"  ng-model="data.nickname"> <br/> ' +
                  '<input type="text"   placeholder="Dirección" ng-model="data.address"> <br/> ' +
                  '<input type="number" placeholder="Código postal" ng-model="data.pin"> <br/> ' +
                  '<input type="number" placeholder="Teléfono" ng-model="data.phone">',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [
          { text: 'Cerrar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
                e.preventDefault(); //No deja al usuario cerrarlo hasta que haya introducido todos los campos     
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });

      addressPopup.then(function(res) {

        if(edit_val!=null) {
          //Actualiza la dirección
          if(res!=null){ // res ==null  => se cierra 
            fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // Cambia el valor de la dirección en firebase
              nickname: res.nickname,
              address: res.address,
              pin: res.pin,
              phone: res.phone
            });
          }
        }else{
          //Añade una nueva dirección
          fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // Añade una nueva dirección a firebase
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }

      });

    };

    // Aparece un popup de confirmación para borrar una dirección
    $scope.deleteAddress = function(del_id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Borrar dirección',
        template: 'Estas seguro de que quieres borrar esta dirección?',
        buttons: [
          { text: 'No' , type: 'button-stable' },
          { text: 'Si', type: 'button-assertive' , onTap: function(){return del_id;} }
        ]
      });
      //Si pulsa Si en confirmPopup borra la dirección de Firebase
      confirmPopup.then(function(res) {
        if(res) {
          fireBaseData.refUser().child($scope.user_info.uid).child("address").child(res).remove();
        }
      });
    };

    $scope.save= function (extras,editable) {
      //Editar el teléfono no muestra un popup 
     
      if(extras.telephone!="" && extras.telephone!=null ){
        //Actualiza el teléfono
        fireBaseData.refUser().child($scope.user_info.uid).update({    // Cambia el valor en firebase
          telephone: extras.telephone
        });
      }

      //Editar la contraseña
      if(editable.password!="" && editable.password!=null && editable.password!=extras.password){
        //Cambia el valor de la contraseña en firebase
     
        
       
          fireBaseData.refUser().child($scope.user_info.uid).update({
            password: editable.password
          })
          console.log("Actualizada")
        
        
        sharedUtils.showAlert("Cuenta","Contraseña actualizada");
      
        }
      //Editar email
      
      if(editable.email!="" && editable.email!=null  && editable.email!=$scope.user_info.email){
        
        //Edita el email en firebase
        firebase.auth().currentUser.updateEmail($scope.user_info.email).then(function(ok) {

          //$window.location.reload(true);
          sharedUtils.showAlert("Cuenta","Email actualizado ");
          fireBaseData.refUser().child($scope.user_info.uid).update({
            email:editable.email
          })
        }, function(error) {
          sharedUtils.showAlert("ERROR","Error al actualizar el email");
        });
      }

    };

    $scope.cancel=function(){
      // Recarga la ventana
      $window.location.reload(true);
      console.log("CANCEL");
    }

})

//.controller('supportCtrl', function($scope,$rootScope) {

   // $rootScope.extras=true;

//})

//.controller('forgotPasswordCtrl', function($scope,$rootScope) {
 //   $rootScope.extras=false;
 // })


//Controlador de la página de pagos

//$scope obtener datos de un html para usarlo en js
//$rootScope podemos obtener datos de cualquier html para usarlo en js
//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas, está definida en services.js
//$state para cambiar de página
//$firebaseArray se utiliza para recuperar los datos de una de las referencias definidas en services.js
//$ionicHistory realiza un seguimiento de las vistas mientras el usuario navega por la aplicación.
//fireBaseData sirve para obtener datos de Firebase
//$ionicPopup permite crear y mostrar ventanas emergentes que requieren que el usuario interactue para continuar
//sharedCartService nos permite realizar las operaciones sobre el carrito ya sea incrementar,disminuir o eliminar el producto del mismo, está definida en services.js




.controller('checkoutCtrl', function($scope,$rootScope,sharedUtils,$state,$firebaseArray,
                                     $ionicHistory,fireBaseData, $ionicPopup,sharedCartService) {

    $rootScope.extras=true;

    //Comprueba si un usuario ha iniciado sesión
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.addresses= $firebaseArray( fireBaseData.refUser().child(user.uid).child("address") );
        $scope.user_info=user;
      }
    });

    $scope.payments = [
      {id: 'CREDIT', name: 'Tarjeta de crédito'},
      
      {id: 'COD', name: 'Pagar en la entrega'}
    ];

    $scope.pay=function(address,payment){
   //Comprueba a ver si los checkbox no están marcados
      if(address==null || payment==null){
     
        sharedUtils.showAlert("Error","Por favor seleccione una dirección y un método de pago.")
      }
      else {
        // Hace un bucle de todos los productos del carrito
        for (var i = 0; i < sharedCartService.cart_items.length; i++) {
          //Añade los productos del carrito a la tabla de pedidos
          fireBaseData.refOrder().push({
            //Los datos de los productos se simplifican añadiendolos a estas variables
            
            product_name: sharedCartService.cart_items[i].item_name,
            product_price: sharedCartService.cart_items[i].item_price,
            product_image: sharedCartService.cart_items[i].item_image,
            product_id: sharedCartService.cart_items[i].$id,

            //Datos de los productos
            item_qty: sharedCartService.cart_items[i].item_qty,

            //Datos de los pedidos
            user_id: $scope.user_info.uid,
            user_name:$scope.user_info.displayName,
            address_id: address,
            payment_id: payment,
            status: "En cola"
          });

        }

        //Borra el contenido del carrito del usuario
        fireBaseData.refCart().child($scope.user_info.uid).remove();

        sharedUtils.showAlert("Info", "Pedido exitoso");

        // Navegamos a la página de los pedidos
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('lastOrders', {}, {location: "replace", reload: true});
      }
    }



    $scope.addManipulation = function(edit_val) {  //Se encarga de añadir y editar las direcciones


      if(edit_val!=null) {
        $scope.data = edit_val; // Edita las direcciones
        var title="Editar dirección";
        var sub_title="Editar tu dirección";
      }
      else {
        $scope.data = {};    // Añade una nueva dirección
        var title="Añadir dirección";
        var sub_title="Añade tu nueva dirección";
      }
       // Un popup para añadir una nueva dirección
      var addressPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="Nombre"  ng-model="data.nickname"> <br/> ' +
        '<input type="text"   placeholder="Dirección" ng-model="data.address"> <br/> ' +
        '<input type="number" placeholder="Código postal" ng-model="data.pin"> <br/> ' +
        '<input type="number" placeholder="Teléfono" ng-model="data.phone">',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [
          { text: 'Cerrar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
                e.preventDefault(); //No deja al usuario cerrarlo hasta que haya introducido todos los campos  
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });

      addressPopup.then(function(res) {

        if(edit_val!=null) {
         //Actualiza la dirección
          fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // Cambia el valor de la dirección en firebase
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }else{
          //Añade una nueva dirección
          fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // Añade una nueva dirección a firebase
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }

      });

    };


  })

