const contenedorProductos = document.querySelector('#contenedorProductos')
const carritoNode = document.querySelector('.carrito')
const finalizarCompra = document.querySelector('#finalizarCompra')
const vaciarCarrito = document.querySelector('#vaciarCarrito')
const total = document.querySelector('#total')
const carritoAcciones = document.querySelector('.carrito-acciones-contenedor')
const aside = document.querySelector('#aside')
//DOM NODE

let carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || []


fetch("./js/productos.json")
    .then(res => res.json())
    .then(data => renderProductos(data))

function renderProductos (data)  {
    data.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("tarjeta");
                div.innerHTML= `
                <img src="${producto.img}" alt="${producto.modelo}">
                <div class="tarjetaDatos">
                <h1 class="modelo">${producto.modelo}</h1>
                    <p class="talle">talle: ${producto.talle}</p>
                    <p class="precio">$${producto.precio}</p>
                    <button id="${producto.id}" class="anadirProd">Añadir producto</button>
                </div>
                `
                contenedorProductos.append(div);
            })
            const anadirProd = document.querySelectorAll('.anadirProd')
            anadirProd.forEach (boton => {
                boton.addEventListener("click", (e) => {
                    agregarAlCarrito(e.target.id, data)
                });
            });
}
//RENDERIZAR PRODUCTOS OBTENIDOS DE LA API


const mostrarCarrito = () => {
    carritoNode.innerHTML = "";
    carrito.forEach((producto) => {
        const {cantidad, id, modelo, talle, precio, img} = producto
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML= `
            <img src="${img}" alt="${modelo}">
            <h3 class="modelo">${modelo}</h3>
            <p class="cantidad">cantidad: ${cantidad}</p>
            <p class="talle">talle: ${talle}</p>
            <p class="precio">$${precio}</p>
            <button class="eliminarProd" id="${id}"><i class="bi bi-trash"></i></button>
        `
        carritoNode.append(div);
        })
        botonesElminar ()
        actualizarTotal ()
        mostrarAside()
}
//RENDERIZAR CARRITO

function agregarAlCarrito (id, data) {
    const productoAgregado = data.find(boton => boton.id === parseInt(id))
    const productoEnCarrito = carrito.find(prod => prod.id === parseInt(id))
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
    carrito.push(productoAgregado)
    }
    agregarAlert()
    mostrarCarrito()
    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito))
}
//AGREGAR AL CARRITO

function agregarAlert () {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'El producto ha sido agregado',
        showConfirmButton: false,
        timer: 700,
        width: 200
    })
}
function eliminarAlert () {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'El producto ha sido eliminado',
        showConfirmButton: false,
        timer: 700,
        width: 220
    })
}
//ALERTA AL ELIMINAR Y AGREGAR PRODUCTO, UTILIZANDO SWEETALERT2

function botonesElminar () {
    const eliminarProd = document.querySelectorAll('.eliminarProd');
    eliminarProd.forEach (boton => {
    boton.addEventListener("click",eliminarDelCarrito);
});
}

function eliminarDelCarrito (e) {
    const idBoton = parseInt(e.currentTarget.id);
    const index = carrito.findIndex(producto => producto.id === idBoton)
    carrito.splice(index, 1);
    mostrarCarrito()
    eliminarAlert ()
    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito))
}
//BORRAR PRODUCTOS EN CARRITO

vaciarCarrito.addEventListener("click",eliminarCarrito)
function eliminarCarrito () {
    carrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito))
    mostrarCarrito()
}
//VACIAR CARRITO POR COMPLETO

function actualizarTotal () {
    const precioTotal = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `Precio total: $${precioTotal}`;
}
//ACTUALIZADOR DE PRECIO DEPENDIENDO DE LA CANTIDAD DE PRODUCTOS

finalizarCompra.addEventListener("click",comprarCarrito)
function comprarCarrito () {
    Swal.fire({
        tittle: '¡GRACIAS!',
        text: 'Tu pedido fue recibido y en breves se hara el despacho',
        confirmButtonText: 'Seguir comprando'
    })
    carrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito))
    mostrarCarrito()
    
}
//FINALIZAR COMPRA

function mostrarAside () {
    if (carrito.length > 0) {
        aside.classList.add('active');
        aside.classList.remove('disabled');
    } else {
        aside.classList.remove('active');
        aside.classList.add('disabled');
    }
}
//FUNCION QUE MUESTRA O SACA EL CARRITO DEPENDIENDO SI TIENE PRODUCTOS

mostrarCarrito()
