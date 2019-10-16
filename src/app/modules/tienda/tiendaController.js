app.controller('tiendaController',['Producto','Auth','SessionStorage','Compra','rutas',function(Producto,Auth,SessionStorage,Compra,rutas){
    var ctrl = this;
    ctrl.rutas = rutas;
    ctrl.productos = Producto.query(function(){});
    
    ctrl.getCarrito =   function(){
        if(Object.entries(SessionStorage.getObject('carrito')).length === 0){
            ctrl.carrito = {
                fecha: "",
                precioTotal: 0,
                cantidadTotal: 0,
                moneda: "CLP",
                usuario: Auth.parseToken(Auth.getToken()).email,
                estado: "enviada",
                items:[]
            };
        }else{
            ctrl.carrito =SessionStorage.getObject('carrito');
        }
    }
    ctrl.getCarrito();
    
    
    ctrl.addProducto = function(index){
       var itemIndex =  ctrl.carrito.items.findIndex(function(item){
            return item.id == ctrl.productos[index].id;
        })
        if(itemIndex==-1){
            var item =ctrl.productos[index];
            item.cantidad =ctrl.cant[index];
            ctrl.carrito.items.push(item);
        }else{
            ctrl.carrito.items[itemIndex].cantidad =ctrl.carrito.items[itemIndex].cantidad +ctrl.cant[index];
        }
        ctrl.carrito.cantidadTotal = ctrl.carrito.cantidadTotal+ ctrl.cant[index]
        ctrl.carrito.precioTotal = ctrl.carrito.precioTotal+ (ctrl.cant[index]*ctrl.productos[index].precio)
        ctrl.cant[index] = '';
        SessionStorage.setObject('carrito', ctrl.carrito);
    }

    ctrl.deleteProducto = function(index){
        var item = ctrl.carrito.items[index];
        ctrl.carrito.cantidadTotal = ctrl.carrito.cantidadTotal - item.cantidad;
        ctrl.carrito.precioTotal = ctrl.carrito.precioTotal - (item.cantidad*item.precio);
        ctrl.carrito.items.splice(index,1);
        SessionStorage.setObject('carrito', ctrl.carrito);
    }

    ctrl.comprar = function(){
        ctrl.carrito.fecha =  new Date();
        Compra.save(ctrl.carrito,function(carrito){
            SessionStorage.remove('carrito');
            ctrl.compraOk = true;
            ctrl.getCarrito();
        });
    }
}])