let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", () => {
    mostrarProductos();
    cargarCarrito();

    document
        .getElementById("vaciar-carrito")
        .addEventListener("click", vaciarCarrito);

    document
        .getElementById("finalizar-compra")
        .addEventListener("click", finalizarCompra);
});


// MOSTRAR PRODUCTOS


async function mostrarProductos() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products");
        productos = await respuesta.json();

        const contenedor = document.getElementById("productos-container");
        contenedor.innerHTML = "";

        productos.forEach(producto => {

            contenedor.innerHTML += `
                <div class="card">

                    <img src="${producto.image}" alt="${producto.title}">

                    <h3>${producto.title}</h3>

                    <p>$${producto.price}</p>

                    <div class="botones">

                        <button class="agregar"
                                onclick="agregarAlCarrito(${producto.id})">
                            Añadir
                        </button>

                        <button class="quitar"
                                onclick="quitarProductoPorId(${producto.id})">
                            Quitar
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}


// AGREGAR AL CARRITO


function agregarAlCarrito(id) {

    const producto = productos.find(p => p.id === id);

    carrito.push({
        id: producto.id,
        nombre: producto.title,
        precio: Number(producto.price)
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));

    cargarCarrito();
}


// CARGAR CARRITO


function cargarCarrito() {

    const lista = document.getElementById("lista-carrito");

    lista.innerHTML = "";

    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.forEach((producto, indice) => {

        lista.innerHTML += `
            <li>

                ${producto.nombre}

                <strong>$${producto.precio}</strong>

                <button onclick="quitarProducto(${indice})">
                    ❌
                </button>

            </li>
        `;

    });

    document.getElementById("total").textContent = calcularTotal();
}


// QUITAR PRODUCTO


function quitarProducto(indice) {

    carrito.splice(indice, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    cargarCarrito();
}

function quitarProductoPorId(id) {

    const indice = carrito.findIndex(producto => producto.id === id);

    if (indice !== -1) {

        carrito.splice(indice, 1);

        localStorage.setItem("carrito", JSON.stringify(carrito));

        cargarCarrito();
    }
}


// TOTAL

function calcularTotal() {

    let total = 0;

    carrito.forEach(producto => {
        total += Number(producto.precio);
    });

    return total.toFixed(2);
}


// VACIAR CARRITO


function vaciarCarrito() {

    carrito = [];

    localStorage.removeItem("carrito");

    cargarCarrito();
}


// FINALIZAR COMPRA


function finalizarCompra() {

    if (carrito.length === 0) {

        Swal.fire({
            icon: "info",
            title: "Carrito vacío",
            text: "Agregá productos antes de comprar."
        });

        return;
    }

    Swal.fire({
        icon: "success",
        title: "¡Gracias por tu compra!",
        html: "<h2>Total pagado: $" + calcularTotal() + "</h2>",
        confirmButtonText: "Aceptar"
    });

    carrito = [];

    localStorage.removeItem("carrito");

    cargarCarrito();
}