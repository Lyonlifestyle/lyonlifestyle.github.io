function iniciarBuscador() {
  const input = document.getElementById('campoBusqueda');
  const resultados = document.getElementById('resultadosBusqueda');

  if (!input || !resultados) return;

  if (typeof productos === 'undefined') {
    console.error('buscador.js: no se encontró el arreglo "productos". Asegúrate de incluir <script src="productos.js"></script> ANTES de buscador.js en el HTML.');
    return;
  }

  input.addEventListener('input', () => {
    const texto = input.value.toLowerCase().trim();
    resultados.innerHTML = '';

    if (texto.length === 0) {
      resultados.style.display = 'none';
      return;
    }

    const coincidencias = productos.filter(item =>
      item.nombre.toLowerCase().includes(texto) ||
      (item.categoria && item.categoria.toLowerCase().includes(texto))
    );

    if (coincidencias.length === 0) {
      resultados.innerHTML = '<div class="resultado-item">Sin resultados</div>';
    } else {
      coincidencias.forEach(item => {
        const enlace = document.createElement('a');
        enlace.href = item.url;
        enlace.className = 'resultado-item';
        enlace.textContent = `${item.nombre} — $${item.precio}`;
        resultados.appendChild(enlace);
      });
    }
    resultados.style.display = 'block';
  });
}

document.addEventListener('DOMContentLoaded', iniciarBuscador);
