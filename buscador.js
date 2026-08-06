async function iniciarBuscador() {
  const respuesta = await fetch('buscador.json');
  const datos = await respuesta.json();

  const input = document.getElementById('campoBusqueda');
  const resultados = document.getElementById('resultadosBusqueda');

  input.addEventListener('input', () => {
    const texto = input.value.toLowerCase().trim();
    resultados.innerHTML = '';

    if (texto.length === 0) {
      resultados.style.display = 'none';
      return;
    }

    const coincidencias = datos.filter(item =>
      item.nombre.toLowerCase().includes(texto)
    );

    if (coincidencias.length === 0) {
      resultados.innerHTML = '<div class="resultado-item">Sin resultados</div>';
    } else {
      coincidencias.forEach(item => {
        const div = document.createElement('a');
        div.href = item.url;
        div.className = 'resultado-item';
        div.textContent = `${item.nombre} (${item.tipo})`;
        resultados.appendChild(div);
      });
    }
    resultados.style.display = 'block';
  });
}

document.addEventListener('DOMContentLoaded', iniciarBuscador);