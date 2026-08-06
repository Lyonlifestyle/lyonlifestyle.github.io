document.addEventListener('DOMContentLoaded', () => {
  const imagenes = document.querySelectorAll('.img-skeleton');

  imagenes.forEach(img => {
    if (img.complete) {
      img.classList.add('img-cargada');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('img-cargada');
      });
    }
  });
});



