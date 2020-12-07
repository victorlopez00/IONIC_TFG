angular.module('app.services', [])


.factory('fireBaseData', function($firebase) {
	var 
    refCart = new Firebase("https://ecommerce-para-moviles.firebaseio.com/cart"),
    refUser = new Firebase("https://ecommerce-para-moviles.firebaseio.com/users"),
    refOrder = new Firebase("https://ecommerce-para-moviles.firebaseio.com/orders"),
    refMenu = new Firebase("https://ecommerce-para-moviles.firebaseio.com/menu");
  return {
    
    refCart: function() {
      return refCart;
    },
    refUser: function() {
      return refUser;
    },
  
    refOrder: function() {
      return refOrder;
    },
   
   refMenu: function() {
     return refMenu;
    }
  }
})
//Factory es una funcion que permite añadir lógica a un objeto creado y devolver ese objeto
//Se utiliza para crear/devolver una funcion como código reutilizable que puede ser utilizado en toda la aplicación


//sharedUtils nos permite modificar las animaciones de carga y mostrar alertas
.factory('sharedUtils',['$ionicLoading','$ionicPopup', function($ionicLoading,$ionicPopup){


    var functionObj={};

    functionObj.showLoading=function(){
      $ionicLoading.show({
        content: '<i class=" ion-loading-c">Cargando...</i> ', // El texto que se monstrará mientras se carga
        animation: 'fade-in', // La animación que va a utilizar
        showBackdrop: true, // La vista se cubrirá de un colo gris
        maxWidth: 200, // La anchura máxima de la pantalla de carga. 
    
      });
    };
    //Esconde el la pantalla de carga
    functionObj.hideLoading=function(){
      $ionicLoading.hide();
    };

    //Muestra una alerta con un título y mensaje
    functionObj.showAlert = function(title,message) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });
    };

    return functionObj;

}])


//sharedCartService nos permite realizar las operaciones sobre el carrito ya sea incrementar,disminuir o eliminar el producto del mismo

  .factory('sharedCartService', ['$ionicPopup','fireBaseData','$firebaseArray',function($ionicPopup, fireBaseData, $firebaseArray){

    var uid ;//uid es la id del usuario

    var cart={}; //El objeto principal


    //Comprueba si un usuario ha iniciado sesión, si lo ha hecho recupera los items del carro
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        uid=user.uid;
        cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
      }
    });




    //Añadir al carrito
    cart.add = function(item) {
      //Comprueba si el producto se ha añadido al carrito o no
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {

        if( snapshot.hasChild(item.$id) == true ){

          //Si el producto ya está en el carrito
          var currentQty = snapshot.child(item.$id).val().item_qty;

          //Actualiza los productos del carro
          fireBaseData.refCart().child(uid).child(item.$id).update({   
            item_qty : currentQty+1
          });

        }else{
          //Si el producto es nuevo en el carro
          
          fireBaseData.refCart().child(uid).child(item.$id).set({    //Lo añade a Firebase
            item_name: item.name,
            item_image: item.image,
            item_price: item.price,
            item_qty: 1
          });
        }
      });
    };
    //Esta función nos permite eliminar el producto del carrito
    cart.drop=function(item_id){
      fireBaseData.refCart().child(uid).child(item_id).remove();
    };
    //Esta función nos permite aumentar la cantidad de productos en el carrito
    cart.increment=function(item_id){
      //Comprueba si el producto existe y si está en el carrito o no
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {
        if( snapshot.hasChild(item_id) == true ){

          var currentQty = snapshot.child(item_id).val().item_qty;
          //Comprueba si la cantidad+1 es menor al stock disponible
         
          fireBaseData.refCart().child(uid).child(item_id).update({
            item_qty : currentQty+1
          });

        }else{
          //Mensaje de error
          sharedUtils.showAlert("Error","Error al aumentar la cantidad de productos del carrito");
        }
      });

    };
    //Esta función nos permite disminuir la cantidad de productos en el carrito
    cart.decrement=function(item_id){
      //Comprueba si el producto existe en el carrito o no
      
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {
        if( snapshot.hasChild(item_id) == true ){

          var currentQty = snapshot.child(item_id).val().item_qty;
          //Si la cantidad es menor a 0 elimina el producto del carrito
          if( currentQty-1 <= 0){
            cart.drop(item_id);
          }else{
          //Si todo es correcto actualiza el valor en la base de datos
            fireBaseData.refCart().child(uid).child(item_id).update({
              item_qty : currentQty-1
            });
          }

        }else{
          //Mensaje de error
          sharedUtils.showAlert("Error","Error al disminuir la cantidad de productos del carrito");
        }
      });

    };

    return cart;
  }])



.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);

