/*
   NIVEL 5: INTELIGENCIA ARTIFICIAL (Teachable Machine)
   ----------------------------------------------------
   Este archivo agrega el "Reconocedor de productos" a la página.
   Va DESPUÉS de script.js, porque usa sus funciones
   buscarProducto(), formatearPrecio() y agregarAlCarrito().

   PARA ADAPTARLO A TU EMPRENDIMIENTO SOLO HAY QUE CAMBIAR LOS PASOS 1, 2, 3 y 4.
*/


/* PASO 1: el enlace de tu modelo */
const URL_MODELO = "https://teachablemachine.withgoogle.com/models/kU4ClG6IZ/";


/* PASO 2: conectá cada CLASE del modelo con un producto del catálogo */
const clasesIA = {
  "Asado Completo": 1,
  "Agua": null,
  "Flan Con Ddl": 7,
  "Empanada De Carne": 2,
  "Locro": 4,
  "Milanesa Napolitana": 3,
  "No Hay Producto": null,
  "Parrillada Veggie": 5,
  "Provoleta": 6,
  "Vino Tinto": 8
};


/* PASO 3: qué tan seguro tiene que estar el modelo para mostrar un resultado */
const CONFIANZA_MINIMA = 0.8;


/* PASO 4: reseñas de clientes para cada producto */
const RESENAS_DE_EJEMPLO = false;

const resenas = {
  1: [
    { autor: "Matías R.", estrellas: 5, texto: "El asado salió a punto, súper tierno y con el chorizo bien criollo." },
    { autor: "Valeria G.", estrellas: 5, texto: "Abundante y riquísimo, ideal para compartir en familia." }
  ],
  2: [
    { autor: "Lucas M.", estrellas: 5, texto: "Las empanadas de carne bien jugosas y con la masa crocante." },
    { autor: "Camila S.", estrellas: 5, texto: "Llegaron calentitas y con excelente sabor casero." }
  ],
  3: [
    { autor: "Diego P.", estrellas: 5, texto: "La milanesa napolitana enorme y con mucho queso, no falla nunca." }
  ],
  4: [
    { autor: "Lucía T.", estrellas: 5, texto: "El locro tiene el punto justo de condimentos y es bien sustancioso." }
  ],
  5: [
    { autor: "Sofía B.", estrellas: 5, texto: "La parrillada veggie súper sabrosa y con la provoleta bien dorada." }
  ],
  6: [
    { autor: "Nicolás F.", estrellas: 5, texto: "La provoleta a la parrilla con orégano queda espectacular." }
  ],
  7: [
    { autor: "Florencia C.", estrellas: 5, texto: "El flan con dulce de leche es el cierre perfecto para cualquier comida." },
    { autor: "Agustín L.", estrellas: 4, texto: "Muy casero y cremoso, lo pedimos siempre." }
  ],
  8: [
    { autor: "Martín D.", estrellas: 5, texto: "Un tinto que acompaña excelente las carnes y platos tradicionales." }
  ]
};


/* ============ De acá para abajo no hace falta tocar nada ============ */

const iaEstado = document.getElementById("ia-estado");
const iaVisor = document.getElementById("ia-visor");
const iaBarras = document.getElementById("ia-barras");
const iaResultado = document.getElementById("ia-resultado");
const iaArchivo = document.getElementById("ia-archivo");
const btnCamara = document.getElementById("btn-camara");
const btnFoto = document.getElementById("btn-foto");
const iaDemo = document.getElementById("ia-demo");

const modoDemo = URL_MODELO.trim() === "";
let modelo = null;
let webcam = null;
let camaraEncendida = false;
let ultimaClaseMostrada = "";


/* Carga el modelo una sola vez (la primera vez que se usa) */
async function cargarModelo() {
  if (modelo) return modelo;
  if (typeof tmImage === "undefined") {
    throw new Error("No se pudo cargar la librería de Teachable Machine. Revisá tu conexión a internet.");
  }
  let url = URL_MODELO.trim();
  if (!url.endsWith("/")) url += "/";
  iaEstado.textContent = "Cargando el modelo… ⏳";
  modelo = await tmImage.load(url + "model.json", url + "metadata.json");
  iaEstado.textContent = "Modelo listo ✅";
  return modelo;
}


/* Dibuja una barra por clase con su porcentaje */
function mostrarBarras(predicciones) {
  for (const p of predicciones) {
    let fila = iaBarras.querySelector('[data-clase="' + p.className + '"]');

    if (!fila) {
      fila = document.createElement("div");
      fila.className = "ia-fila";
      fila.dataset.clase = p.className;
      fila.innerHTML =
        '<span class="ia-nombre">' + p.className + "</span>" +
        '<span class="ia-pista"><span class="ia-relleno"></span></span>' +
        '<span class="ia-porcentaje">0%</span>';
      iaBarras.appendChild(fila);
    }

    const porcentaje = Math.round(p.probability * 100);
    fila.querySelector(".ia-relleno").style.width = porcentaje + "%";
    fila.querySelector(".ia-porcentaje").textContent = porcentaje + "%";
  }
}


/* Busca la clase con el porcentaje más alto y muestra el producto */
function mostrarResultado(predicciones) {
  const mejor = predicciones.reduce(function (a, b) {
    return a.probability > b.probability ? a : b;
  });

  iaBarras.querySelectorAll(".ia-fila").forEach(function (fila) {
    fila.classList.toggle("ganadora", fila.dataset.clase === mejor.className);
  });

  let clave;
  const id = clasesIA[mejor.className];
  if (mejor.probability < CONFIANZA_MINIMA) {
    clave = "duda";
  } else if (id === null || id === undefined) {
    clave = "nada:" + mejor.className;
  } else {
    clave = "producto:" + id;
  }

  if (clave === ultimaClaseMostrada) return;
  ultimaClaseMostrada = clave;

  if (clave === "duda") {
    iaResultado.innerHTML = '<p class="ia-aviso">🤔 No estoy seguro. Acercá el producto o probá con más luz.</p>';
  } else if (clave.startsWith("nada")) {
    iaResultado.innerHTML = '<p class="ia-aviso">👀 No veo ningún producto del menú. Mostrame uno.</p>';
  } else {
    const producto = buscarProducto(id);
    if (!producto) {
      iaResultado.innerHTML = '<p class="ia-aviso">⚠️ La clase "' + mejor.className +
        '" apunta al id ' + id + ", pero ese producto no existe en el catálogo.</p>";
      return;
    }
    iaResultado.innerHTML =
      '<div class="ia-tarjeta">' +
        '<div class="emoji">' + producto.emoji + "</div>" +
        "<div>" +
          '<p class="ia-etiqueta">Detectamos</p>' +
          "<h3>" + producto.nombre + "</h3>" +
          '<p class="descripcion">' + producto.descripcion + "</p>" +
          '<p class="precio">' + formatearPrecio(producto.precio) + "</p>" +
          '<button class="btn" data-ia-id="' + producto.id + '">Agregar al pedido</button>' +
        "</div>" +
      "</div>" +
      armarResenas(producto.id);
  }
}


/* Convierte un número en estrellas: 4 -> "★★★★☆" */
function dibujarEstrellas(cantidad) {
  const llenas = Math.round(cantidad);
  return "★".repeat(llenas) + "☆".repeat(5 - llenas);
}

/* Arma el bloque de reseñas de un producto (promedio + comentarios) */
function armarResenas(id) {
  const lista = resenas[id];
  if (!lista || lista.length === 0) {
    return '<p class="ia-aviso">Este producto todavía no tiene reseñas.</p>';
  }

  let suma = 0;
  for (const r of lista) {
    suma += r.estrellas;
  }
  const promedio = suma / lista.length;

  let html =
    '<div class="ia-resenas">' +
      '<div class="ia-resenas-cabecera">' +
        '<span class="estrellas" aria-label="' + promedio.toFixed(1) + ' de 5 estrellas">' + dibujarEstrellas(promedio) + "</span>" +
        "<strong>" + promedio.toFixed(1).replace(".", ",") + "</strong>" +
        "<span>(" + lista.length + " opiniones)</span>" +
        (RESENAS_DE_EJEMPLO ? '<span class="ia-ejemplo">Reseñas de ejemplo</span>' : "") +
      "</div>";

  for (const r of lista) {
    html +=
      '<blockquote class="ia-resena">' +
        '<span class="estrellas" aria-label="' + r.estrellas + ' de 5 estrellas">' + dibujarEstrellas(r.estrellas) + "</span>" +
        "<p>“" + r.texto + "”</p>" +
        "<cite>— " + r.autor + "</cite>" +
      "</blockquote>";
  }

  return html + "</div>";
}


/* Le pasa una imagen (foto, video o canvas) al modelo */
async function predecir(elemento) {
  const predicciones = await modelo.predict(elemento);
  mostrarBarras(predicciones);
  mostrarResultado(predicciones);
}


/* ---------- Opción A: cámara ---------- */
async function bucleCamara() {
  if (!camaraEncendida) return;
  webcam.update();
  await predecir(webcam.canvas);
  requestAnimationFrame(bucleCamara);
}

btnCamara.addEventListener("click", async function () {
  if (camaraEncendida) {
    camaraEncendida = false;
    webcam.stop();
    btnCamara.textContent = "📷 Usar cámara";
    iaEstado.textContent = "Cámara apagada.";
    return;
  }
  try {
    await cargarModelo();
    iaEstado.textContent = "Pidiendo permiso para la cámara…";
    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();
    iaVisor.innerHTML = "";
    iaVisor.appendChild(webcam.canvas);
    camaraEncendida = true;
    btnCamara.textContent = "⏹ Apagar cámara";
    iaEstado.textContent = "Mostrale un producto a la cámara 🎥";
    bucleCamara();
  } catch (error) {
    iaEstado.textContent = "❌ " + (error.message || "No se pudo usar la cámara. Revisá los permisos del navegador.");
  }
});


/* ---------- Opción B: subir una foto ---------- */
btnFoto.addEventListener("click", function () {
  iaArchivo.click();
});

iaArchivo.addEventListener("change", async function () {
  const archivo = iaArchivo.files[0];
  if (!archivo) return;

  if (camaraEncendida) btnCamara.click();

  const img = document.createElement("img");
  img.alt = "Foto subida";
  img.src = URL.createObjectURL(archivo);
  iaVisor.innerHTML = "";
  iaVisor.appendChild(img);

  img.onload = async function () {
    try {
      await cargarModelo();
      ultimaClaseMostrada = "";
      await predecir(img);
      iaEstado.textContent = "Listo ✅ Probá con otra foto si querés.";
    } catch (error) {
      iaEstado.textContent = "❌ " + error.message;
    }
  };
  iaArchivo.value = "";
});


/* ---------- Botón "Agregar al pedido" (usa el carrito de script.js) ---------- */
iaResultado.addEventListener("click", function (evento) {
  const id = evento.target.dataset.iaId;
  if (id) {
    agregarAlCarrito(Number(id));
    evento.target.textContent = "✅ Agregado";
  }
});


/* ---------- MODO DEMO ---------- */
function simularPredicciones(claseElegida) {
  const nombres = Object.keys(clasesIA);
  const confianza = 0.85 + Math.random() * 0.12;

  const azar = nombres.map(function () { return Math.random(); });
  let sumaOtras = 0;
  nombres.forEach(function (n, i) { if (n !== claseElegida) sumaOtras += azar[i]; });

  return nombres.map(function (nombre, i) {
    const probabilidad = nombre === claseElegida
      ? confianza
      : (1 - confianza) * azar[i] / sumaOtras;
    return { className: nombre, probability: probabilidad };
  });
}

if (modoDemo) {
  btnCamara.classList.add("oculto");
  btnFoto.classList.add("oculto");
  iaEstado.textContent = "Modo demo: los resultados son simulados. Tocá un producto para \"mostrárselo\" a la IA.";

  for (const nombre of Object.keys(clasesIA)) {
    const producto = clasesIA[nombre] ? buscarProducto(clasesIA[nombre]) : null;
    const boton = document.createElement("button");
    boton.className = "ia-muestra";
    boton.type = "button";
    boton.innerHTML = '<span class="emoji">' + (producto ? producto.emoji : "🫥") + "</span>" + nombre;

    boton.addEventListener("click", function () {
      iaDemo.querySelectorAll(".ia-muestra").forEach(function (b) { b.classList.remove("activo"); });
      boton.classList.add("activo");
      iaVisor.innerHTML = '<span class="ia-visor-emoji">' + (producto ? producto.emoji : "🫥") + "</span>";
      iaEstado.textContent = "Analizando… 🔍";
      setTimeout(function () {
        ultimaClaseMostrada = "";
        const predicciones = simularPredicciones(nombre);
        mostrarBarras(predicciones);
        mostrarResultado(predicciones);
        iaEstado.textContent = "Modo demo: los resultados son simulados.";
      }, 500);
    });

    iaDemo.appendChild(boton);
  }

  iaDemo.querySelector(".ia-muestra").click();
} else {
  iaDemo.classList.add("oculto");
}
