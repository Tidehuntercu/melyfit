/* Número de WhatsApp que recibe las solicitudes: código de país + número, solo dígitos (1 = EE. UU.). */
window.MELISSA_WHATSAPP = '17863170943';

/* Fotos y videos del sitio. Pon en src la ruta (assets/...) o una URL HTTPS.
   Si src está vacío, ese espacio no se muestra (intro vacío: la presentación se ve solo con texto).
   Usa MP4 para video; JPG, PNG o WebP para fotos.
   alt: descripción para lectores de pantalla, en español (es) e inglés (en). */
window.MELISSA_MEDIA = {
  hero: {
    src: 'assets/melissa-portada-brazos-cruzados.jpeg', type: 'image',
    alt: { es: 'Melissa Linares en el gimnasio', en: 'Melissa Linares at the gym' }
  },
  intro: {
    src: 'assets/get_to_know_me.mov', type: 'video',
    alt: { es: 'Presentación de Melissa', en: 'Meet Melissa' }
  }
};

/* Transformaciones (antes / después), en el orden en que se muestran.
   Para añadir una: copia una línea, cambia el título y las fotos (ej. assets/4.1.jpeg y assets/4.2.jpeg).
   caption es opcional. Si falta una de las dos fotos, esa transformación no se muestra. */
window.MELISSA_TRANSFORMATIONS = [
  { before: 'assets/1.1.jpeg', after: 'assets/1.2.jpeg', title: { es: 'Mi transformación', en: 'My transformation' } },
  { before: 'assets/2.1.jpeg', after: 'assets/2.2.jpeg', title: { es: 'Transformación de una clienta', en: 'Client transformation' } },
  { before: 'assets/3.1.jpeg', after: 'assets/3.2.jpeg', title: { es: 'Transformación de una clienta', en: 'Client transformation' } }
];
