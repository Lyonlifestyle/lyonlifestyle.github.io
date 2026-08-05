/* ======================================================
   PRODUCTOS-DEMO.JS
   Fuente única de datos de todo el catálogo.
   Cada producto se escribe UNA sola vez aquí.
   Cambia "precioOriginal" o "nuevo" y se refleja solo
   en ofertas.html / novedades.html / la categoría que sea.
   ====================================================== */

const productos = [
  {
    nombre: "Vini Jr. - Real Madrid",
    marca: "Real Madrid",
    categoria: "futbol",
    precio: 20,
    precioOriginal: 20,      // igual al precio = no está en oferta
    nuevo: true,
    img: "Futbol/RealMadrid/front-generic.jpg",
    link: "realmadrid-vinijr.html"
  },
  {
    nombre: "Bellingham - Real Madrid",
    marca: "Real Madrid",
    categoria: "futbol",
    precio: 20,
    precioOriginal: 20,      // bajó de precio -> aparece en Ofertas automáticamente
    nuevo: true,
    img: "Futbol/RealMadrid/bellingham.png",
    link: "realmadrid-bellingham.html"
  },
  {
    nombre: "D Habana - Set Hombre y Mujer",
    marca: "D Habana",
    categoria: "perfumes",
    precio: 40,
    precioOriginal: 45,
    nuevo: true,             // recién agregado -> aparece en Novedades automáticamente
    img: "Combos/DeHabana.png",
    link: "DeHabana.html"
  },
  {
    nombre: "Toalla Selección Francia",
    marca: "FFF",
    categoria: "accesorios",
    precio: 10,
    precioOriginal: 12,
    nuevo: false,
    img: "Accesorios/Toallas/toalla-francia.png",
    link: "toalla-francia.html"
  },
  {
    nombre: "Gorra Cuba - Edición Bandera",
    marca: "Cuba",
    categoria: "gorras",
    precio: 10,
    precioOriginal: 15,      // también bajó de precio -> Ofertas
    nuevo: false,
    img: "Gorras/Cuba.png",
    link: "Cuba.html"
  },
  {
    nombre: "Mariano Rivera - Yankees",
    marca: "Yankees",
    categoria: "beisbol",
    precio: 40,
    precioOriginal: 40,
    nuevo: true,              // recién agregado -> Novedades
    img: "Beisbol/Mariano/mariano.png",
    link: "Mariano.html"
  }
];

/* ======================================================
   MOTOR DE RENDERIZADO
   Genera las tarjetas .card a partir de una lista ya
   filtrada. Lo usan ofertas.html, novedades.html y
   cualquier página de categoría.
   ====================================================== */

function crearTarjeta(p){
  const enOferta = p.precio < p.precioOriginal;
  const descuento = enOferta
    ? Math.round(100 - (p.precio / p.precioOriginal) * 100)
    : 0;

  return `
    <div class="card" data-precio="${p.precio}" onclick="location.href='${p.link}'">
      <div class="img-wrap">
        ${p.nuevo ? '<div class="badge badge-nuevo">NUEVO</div>' : ''}
        ${enOferta ? `<div class="badge badge-oferta">-${descuento}%</div>` : ''}
        <img src="${p.img}" class="img-skeleton">
      </div>
      <div class="info">
        <div class="brand">${p.marca}</div>
        <div class="name">${p.nombre}</div>
        <div class="price">
          ${enOferta ? `<span class="precio-anterior">$${p.precioOriginal}</span>` : ''}
          $${p.precio}
        </div>
      </div>
    </div>
  `;
}

function renderizarProductos(lista, contenedorId){
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = lista.map(crearTarjeta).join('');
  const contador = document.getElementById('contadorProductos');
  if (contador) contador.textContent = lista.length + ' Productos';
}
