const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");

btnMenu.addEventListener("click", function () {
  const abierto = menu.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
  btnMenu.textContent = abierto ? "✕" : "☰";
});

menu.querySelectorAll("a").forEach(function (enlace) {
  enlace.addEventListener("click", function () {
    menu.classList.remove("abierto");
    btnMenu.textContent = "☰";
  });
});

const btnTema = document.getElementById("btn-tema");

function aplicarTema(oscuro) {
  document.body.classList.toggle("oscuro", oscuro);
  btnTema.textContent = oscuro ? "☀️" : "🌙";
}

aplicarTema(localStorage.getItem("tema") === "oscuro");

btnTema.addEventListener("click", function () {
  const ahoraOscuro = !document.body.classList.contains("oscuro");
  aplicarTema(ahoraOscuro);
  localStorage.setItem("tema", ahoraOscuro ? "oscuro" : "claro");
});

const btnArriba = document.getElementById("btn-arriba");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    btnArriba.classList.remove("oculto");
  } else {
    btnArriba.classList.add("oculto");
  }
});

btnArriba.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function obtenerSaludo() {
  const hora = new Date().getHours();
  if (hora < 12) {
    return "¡Buen día! ☀️";
  } else if (hora < 20) {
    return "¡Buenas tardes! 🌤️";
  } else {
    return "¡Buenas noches! 🌙";
  }
}

document.getElementById("saludo").textContent = obtenerSaludo() + " Bienvenidos a Sabores Patrios";
document.getElementById("anio").textContent = new Date().getFullYear();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".miniatura").forEach(function (miniatura) {
  miniatura.addEventListener("click", function () {
    lightboxImg.src = miniatura.src;
    lightboxImg.alt = miniatura.alt;
    lightbox.classList.remove("oculto");
  });
});

lightbox.addEventListener("click", function () {
  lightbox.classList.add("oculto");
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    lightbox.classList.add("oculto");
  }
});

const productos = [
  { id: 1, nombre: "Asado Completo", categoria: "parrilla", precio: 12500, emoji: "🥩", descripcion: "Tira de asado, vacío y chorizo criollo." },
  { id: 2, nombre: "Empanadas de Carne (x12)", categoria: "minutas", precio: 8500, emoji: "🥟", descripcion: "Cortadas a cuchillo, jugosas y caseras." },
  { id: 3, nombre: "Milanesa Napolitana", categoria: "minutas", precio: 9200, emoji: "🧀", descripcion: "Con jamón, queso, salsa de tomate y papas fritas." },
  { id: 4, nombre: "Locro Criollo", categoria: "minutas", precio: 7800, emoji: "🍲", descripcion: "Tradicional receta con panceta, chorizo colorado y zapallo." },
  { id: 5, nombre: "Parrillada Veggie", categoria: "parrilla", precio: 8200, emoji: "🌽", descripcion: "Verduras asadas a la provenzal con queso provoleta." },
  { id: 6, nombre: "Provoleta a la Parrilla", categoria: "parrilla", precio: 5400, emoji: "🧀", descripcion: "Queso provoleta dorado con orégano y ají molido." },
  { id: 7, nombre: "Flan con Dulce de Leche", categoria: "bebidas", precio: 3200, emoji: "🍮", descripcion: "Casero, acompañado con crema y dulce de leche." },
  { id: 8, nombre: "Vino Malbec (750ml)", categoria: "bebidas", precio: 6500, emoji: "🍷", descripcion: "Reserva de la casa, origen Mendoza." }
];

const listaProductos = document.getElementById("lista-productos");
const sinResultados = document.getElementById("sin-resultados");

function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-AR");
}

function mostrarProductos(lista) {
  listaProductos.innerHTML = "";
  for (let i = 0; i < lista.length; i++) {
    const p = lista[i];
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML =
      '<div class="emoji">' + p.emoji + "</div>" +
      "<h3>" + p.nombre + "</h3>" +
      '<p class="descripcion">' + p.descripcion + "</p>" +
      '<p class="precio">' + formatearPrecio(p.precio) + "</p>" +
      '<button class="btn" data-id="' + p.id + '">Agregar al pedido</button>';
    listaProductos.appendChild(tarjeta);
  }
  sinResultados.classList.toggle("oculto", lista.length > 0);
}

let categoriaActual = "todos";
let textoBusqueda = "";

function aplicarFiltros() {
  const filtrados = productos.filter(function (p) {
    const coincideCategoria = categoriaActual === "todos" || p.categoria === categoriaActual;
    const coincideTexto = p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideTexto;
  });
  mostrarProductos(filtrados);
}

const botonesFiltro = document.querySelectorAll(".filtro");
botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    categoriaActual = boton.dataset.categoria;
    botonesFiltro.forEach(function (b) { b.classList.remove("activo"); });
    boton.classList.add("activo");
    aplicarFiltros();
  });
});

document.getElementById("buscador").addEventListener("input", function (evento) {
  textoBusqueda = evento.target.value;
  aplicarFiltros();
});

aplicarFiltros();

const testimonios = [
  { texto: "¡El mejor asado de la zona! La carne súper tierna y las empanadas increíbles.", autor: "Gonzalo M." },
  { texto: "Excelente atención y el flan casero con dulce de leche es imperdible.", autor: "Mariana R." },
  { texto: "Pedimos para un almuerzo familiar y llegó todo caliente y a tiempo.", autor: "Carlos P." }
];

const carrusel = document.getElementById("carrusel");
const carruselTexto = document.getElementById("carrusel-texto");
const carruselAutor = document.getElementById("carrusel-autor");
let posicionTestimonio = 0;

function mostrarTestimonio() {
  carruselTexto.textContent = "“" + testimonios[posicionTestimonio].texto + "”";
  carruselAutor.textContent = "— " + testimonios[posicionTestimonio].autor;
}

function siguienteTestimonio() {
  carrusel.classList.add("desvanecido");
  setTimeout(function () {
    posicionTestimonio = (posicionTestimonio + 1) % testimonios.length;
    mostrarTestimonio();
    carrusel.classList.remove("desvanecido");
  }, 400);
}

mostrarTestimonio();
let temporizadorCarrusel = setInterval(siguienteTestimonio, 4000);

carrusel.addEventListener("mouseenter", function () { clearInterval(temporizadorCarrusel); });
carrusel.addEventListener("mouseleave", function () {
  temporizadorCarrusel = setInterval(siguienteTestimonio, 4000);
});

document.querySelectorAll(".faq-pregunta").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const item = boton.parentElement;
    const abierto = item.classList.toggle("abierto");
    boton.querySelector("span").textContent = abierto ? "−" : "+";
  });
});

let carrito = [];
const carritoItems = document.getElementById("carrito-items");
const carritoContador = document.getElementById("carrito-contador");
const carritoTotal = document.getElementById("carrito-total");

function buscarProducto(id) {
  return productos.find(function (p) { return p.id === id; });
}

function contarItems() {
  let total = 0;
  for (const item of carrito) {
    total += item.cantidad;
  }
  return total;
}

function calcularTotal() {
  let total = 0;
  for (const item of carrito) {
    total += buscarProducto(item.id).precio * item.cantidad;
  }
  return total;
}

function agregarAlCarrito(id) {
  const existente = carrito.find(function (item) { return item.id === id; });
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }
  actualizarCarrito();
}

function quitarDelCarrito(id) {
  const item = carrito.find(function (i) { return i.id === id; });
  if (!item) return;
  item.cantidad--;
  if (item.cantidad === 0) {
    carrito = carrito.filter(function (i) { return i.id !== id; });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoItems.innerHTML = "";
  if (carrito.length === 0) {
    carritoItems.innerHTML = "<li>Aún no agregaste platos al pedido 🙂</li>";
  }

  for (const item of carrito) {
    const p = buscarProducto(item.id);
    const li = document.createElement("li");
    li.innerHTML =
      "<span>" + p.emoji + " " + p.nombre + "</span>" +
      "<span>" +
        '<button data-quitar="' + p.id + '">−</button> ' +
        item.cantidad + " " +
        '<button data-sumar="' + p.id + '">+</button>' +
      "</span>" +
      "<span>" + formatearPrecio(p.precio * item.cantidad) + "</span>";
    carritoItems.appendChild(li);
  }

  carritoContador.textContent = contarItems();
  carritoTotal.textContent = formatearPrecio(calcularTotal());
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

listaProductos.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;
  if (id) agregarAlCarrito(Number(id));
});

carritoItems.addEventListener("click", function (evento) {
  if (evento.target.dataset.sumar) agregarAlCarrito(Number(evento.target.dataset.sumar));
  if (evento.target.dataset.quitar) quitarDelCarrito(Number(evento.target.dataset.quitar));
});

document.getElementById("btn-vaciar").addEventListener("click", function () {
  carrito = [];
  actualizarCarrito();
});

try {
  const guardado = JSON.parse(localStorage.getItem("carrito"));
  if (Array.isArray(guardado)) carrito = guardado;
} catch (error) {
  carrito = [];
}
actualizarCarrito();

const NUMERO_WHATSAPP = "5493420000000";

function armarMensajePedido() {
  let mensaje = "¡Hola! Quisiera realizar este pedido en Sabores Patrios:\n";
  for (const item of carrito) {
    const p = buscarProducto(item.id);
    mensaje += "• " + item.cantidad + " x " + p.nombre + " (" + formatearPrecio(p.precio * item.cantidad) + ")\n";
  }
  mensaje += "\nTotal estimado: " + formatearPrecio(calcularTotal());
  return mensaje;
}

document.getElementById("btn-whatsapp").addEventListener("click", function () {
  if (carrito.length === 0) {
    alert("Primero agregá algún plato al pedido 🙂");
    return;
  }
  const url = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(armarMensajePedido());
  window.open(url, "_blank");
});

const selectProducto = document.getElementById("pres-producto");
const inputCantidad = document.getElementById("pres-cantidad");
const resultadoPres = document.getElementById("pres-resultado");

for (const p of productos) {
  const opcion = document.createElement("option");
  opcion.value = p.id;
  opcion.textContent = p.nombre + " - " + formatearPrecio(p.precio);
  selectProducto.appendChild(opcion);
}

function calcularPresupuesto(precio, cantidad) {
  const subtotal = precio * cantidad;
  let porcentajeDescuento = 0;

  if (cantidad >= 12) {
    porcentajeDescuento = 15;
  } else if (cantidad >= 6) {
    porcentajeDescuento = 10;
  }

  const descuento = (subtotal * porcentajeDescuento) / 100;
  return {
    subtotal: subtotal,
    porcentaje: porcentajeDescuento,
    descuento: descuento,
    total: subtotal - descuento
  };
}

document.getElementById("form-presupuesto").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const producto = buscarProducto(Number(selectProducto.value));
  const cantidad = Number(inputCantidad.value);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    resultadoPres.textContent = "Ingresá una cantidad válida (1 o más).";
    return;
  }

  const r = calcularPresupuesto(producto.precio, cantidad);
  resultadoPres.innerHTML =
    "<p>" + cantidad + " porción(es) x " + producto.nombre + "</p>" +
    "<p>Subtotal: " + formatearPrecio(r.subtotal) + "</p>" +
    "<p>Descuento (" + r.porcentaje + "%): -" + formatearPrecio(r.descuento) + "</p>" +
    "<p><strong>Total: " + formatearPrecio(r.total) + "</strong></p>";
});

const formContacto = document.getElementById("form-contacto");
const campoNombre = document.getElementById("nombre");
const campoEmail = document.getElementById("email");
const campoMensaje = document.getElementById("mensaje");
const mensajeExito = document.getElementById("form-exito");

function validarNombre(valor) {
  if (valor.trim() === "") return "Escribí tu nombre.";
  if (valor.trim().length < 3) return "El nombre es muy corto.";
  return "";
}

function validarEmail(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (valor.trim() === "") return "Escribí tu correo electrónico.";
  if (!patron.test(valor)) return "El correo no es válido.";
  return "";
}

function validarMensaje(valor) {
  if (valor.trim() === "") return "Escribí tu mensaje o detalle de reserva.";
  if (valor.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres.";
  return "";
}

function mostrarError(campo, idError, texto) {
  document.getElementById(idError).textContent = texto;
  campo.classList.toggle("invalido", texto !== "");
}

formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeExito.classList.add("oculto");

  const errorNombre = validarNombre(campoNombre.value);
  const errorEmail = validarEmail(campoEmail.value);
  const errorMensaje = validarMensaje(campoMensaje.value);

  mostrarError(campoNombre, "error-nombre", errorNombre);
  mostrarError(campoEmail, "error-email", errorEmail);
  mostrarError(campoMensaje, "error-mensaje", errorMensaje);

  if (errorNombre === "" && errorEmail === "" && errorMensaje === "") {
    mensajeExito.classList.remove("oculto");
    formContacto.reset();
  }
});

const fechaPromo = new Date("2026-12-25T00:00:00");
const cuentaRegresiva = document.getElementById("cuenta-regresiva");

function actualizarCuentaRegresiva() {
  const ahora = new Date();
  const diferencia = fechaPromo - ahora;

  if (diferencia <= 0) {
    cuentaRegresiva.textContent = "¡La promo finalizó!";
    clearInterval(temporizadorCuenta);
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  cuentaRegresiva.textContent =
    dias + " días · " + horas + " h · " + minutos + " min · " + segundos + " s";
}

const temporizadorCuenta = setInterval(actualizarCuentaRegresiva, 1000);
actualizarCuentaRegresiva();