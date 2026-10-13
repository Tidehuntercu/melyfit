'use strict';

const media = window.MELISSA_MEDIA || {};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Idioma ------------------------------------------------------------------ */

const LANGS = ['es', 'en'];
const I18N = window.MELISSA_I18N || { es: {}, en: {} };
let lang = 'es';

// El español se lee del propio HTML, así no hay que duplicarlo en i18n.js.
document.querySelectorAll('[data-i18n]').forEach(el => {
  if (!(el.dataset.i18n in I18N.es)) I18N.es[el.dataset.i18n] = el.innerHTML;
});
document.querySelectorAll('[data-i18n-attr]').forEach(el => {
  const [attr, key] = el.dataset.i18nAttr.split(':');
  if (!(key in I18N.es)) I18N.es[key] = el.getAttribute(attr);
});

function t(key) {
  const dict = I18N[lang] || {};
  return key in dict ? dict[key] : I18N.es[key];
}

function altText(item) {
  if (!item.alt || typeof item.alt === 'string') return item.alt || '';
  return item.alt[lang] || item.alt.es || '';
}

function readSavedLanguage() {
  try { return localStorage.getItem('lang'); } catch (error) { return null; }
}

function saveLanguage(value) {
  try { localStorage.setItem('lang', value); } catch (error) { /* almacenamiento no disponible */ }
}

function setLanguage(next) {
  lang = LANGS.includes(next) ? next : 'es';
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const text = t(el.dataset.i18n);
    if (text != null) el.innerHTML = text;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const [attr, key] = el.dataset.i18nAttr.split(':');
    const text = t(key);
    if (text != null) el.setAttribute(attr, text);
  });
  document.querySelectorAll('[data-media] > img, [data-media] > video').forEach(el => {
    const item = media[el.parentElement.dataset.media];
    if (!item) return;
    if (el.tagName === 'IMG') el.alt = altText(item);
    else el.setAttribute('aria-label', altText(item) || 'Video');
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
  });
}

function initialLanguage() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  const saved = readSavedLanguage();
  if (LANGS.includes(saved)) return saved;
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
}

document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
    saveLanguage(lang);
  });
});

/* Fotos y video ------------------------------------------------------------ */

function createMediaElement(key, item) {
  const isVideo = item.type === 'video';
  const element = document.createElement(isVideo ? 'video' : 'img');
  element.src = item.src;

  if (isVideo) {
    element.playsInline = true;
    element.preload = 'metadata';
    if (key === 'hero') {
      // Portada: sin sonido y en bucle; con controles solo si no se reproduce sola.
      element.muted = true;
      element.loop = true;
      element.autoplay = !reducedMotion;
      element.controls = reducedMotion;
    } else {
      element.controls = true;
      // Muestra un fotograma como vista previa (iPhone deja el recuadro negro sin esto).
      element.src = `${item.src}#t=0.1`;
    }
  } else {
    element.loading = key === 'hero' ? 'eager' : 'lazy';
  }
  return element;
}

function mediaUrl(item) {
  if (!item || !item.src) return null;
  const url = new URL(item.src, location.href);
  return ['https:', 'http:', 'file:'].includes(url.protocol) ? url.href : null;
}

function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

// Crea una tarjeta de antes/después por cada transformación de content.js.
// Sus textos se registran en I18N para que cambien con el idioma como el resto.
function renderTransformations() {
  const grid = document.getElementById('transformations');
  (window.MELISSA_TRANSFORMATIONS || []).forEach((item, index) => {
    const before = mediaUrl({ src: item.before });
    const after = mediaUrl({ src: item.after });
    if (!before || !after) return;

    const key = `transformation.${index}`;
    const register = (suffix, text) => {
      I18N.es[`${key}.${suffix}`] = text.es || text.en || '';
      I18N.en[`${key}.${suffix}`] = text.en || text.es || '';
    };
    const title = item.title || {};
    register('title', title);

    const article = createElement('article');
    const pair = createElement('div', { class: 'comparison' });
    [['before', before, 'Antes', 'Before'], ['after', after, 'Después', 'After']].forEach(([side, src, es, en]) => {
      register(`${side}Alt`, { es: `${es}: ${title.es || ''}`, en: `${en}: ${title.en || ''}` });
      const slot = createElement('div', { class: 'media compare-slot' });
      const img = createElement('img', { src, loading: 'lazy', 'data-i18n-attr': `alt:${key}.${side}Alt` });
      img.addEventListener('error', () => {
        article.remove();
        tidyEmptySections();
      });
      slot.append(img, createElement('span', { class: 'photo-label', 'data-i18n': `results.${side}` }));
      pair.append(slot);
    });

    article.append(createElement('h3', { 'data-i18n': `${key}.title` }), pair);
    if (item.caption) {
      register('caption', item.caption);
      article.append(createElement('p', { class: 'result-caption', 'data-i18n': `${key}.caption` }));
    }
    grid.append(article);
  });
}

// Oculta lo que se queda sin fotos o video para que nunca se vean espacios vacíos.
function tidyEmptySections() {
  const results = document.getElementById('historia');
  if (!results.hidden && !results.querySelector('article')) {
    results.hidden = true;
    document.querySelectorAll('a[href="#historia"]').forEach(link => { link.hidden = true; });
  }
  const intro = document.getElementById('conoceme');
  intro.classList.toggle('is-text-only', !intro.querySelector('[data-media]'));
}

document.querySelectorAll('[data-media]').forEach(slot => {
  const key = slot.dataset.media;
  const src = mediaUrl(media[key]);
  if (!src) {
    slot.remove();
    return;
  }
  const element = createMediaElement(key, { ...media[key], src });
  // Si el archivo falta o el navegador no puede reproducirlo, se quita el espacio.
  element.addEventListener('error', () => {
    slot.remove();
    tidyEmptySections();
  });
  // El recuadro del video toma la forma del video (vertical u horizontal).
  if (key === 'intro') {
    element.addEventListener('loadedmetadata', () => {
      if (!element.videoWidth) return;
      slot.style.aspectRatio = `${element.videoWidth} / ${element.videoHeight}`;
      slot.classList.toggle('is-portrait', element.videoHeight > element.videoWidth);
    });
  }
  slot.prepend(element);
});
renderTransformations();
tidyEmptySections();
setLanguage(initialLanguage());

/* Formulario por WhatsApp ---------------------------------------------------- */

const whatsappNumber = String(window.MELISSA_WHATSAPP || '').replace(/\D/g, '');
document.querySelectorAll('[data-whatsapp-link]').forEach(link => {
  link.href = `https://wa.me/${whatsappNumber}`;
});

const form = document.getElementById('application-form');

function goToForm() {
  document.getElementById('aplica').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
}

document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    form.elements.service.value = button.dataset.service;
    goToForm();
  });
});

document.getElementById('nutrition-interest').addEventListener('click', () => {
  form.elements.nutrition_addon.checked = true;
  goToForm();
});

function selectedText(select) {
  return select.value ? select.options[select.selectedIndex].text : '';
}

// El mensaje se escribe en el idioma que la clienta está usando.
function buildWhatsAppMessage() {
  const { name, email, contact, service, nutrition_addon, goal, story } = form.elements;
  const lines = [
    t('wa.greeting'),
    '',
    `*${t('wa.name')}:* ${name.value.trim()}`,
    `*${t('wa.email')}:* ${email.value.trim()}`
  ];
  if (contact.value.trim()) lines.push(`*${t('wa.contact')}:* ${contact.value.trim()}`);
  lines.push(`*${t('wa.service')}:* ${selectedText(service)}`, `*${t('wa.goal')}:* ${selectedText(goal)}`);
  if (nutrition_addon.checked) lines.push(`*${t('wa.addon')}*`);
  lines.push('', story.value.trim());
  return lines.join('\n');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
  // Abre WhatsApp en otra pestaña; si el navegador lo bloquea, navega en la misma.
  const tab = window.open(url, '_blank');
  if (tab) tab.opener = null;
  else location.href = url;
  document.getElementById('form-status').textContent = t('status.sent');
});
