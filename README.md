# Melissa Linares · Personal Training & Online Coaching

Sitio estático sin dependencias: sin React, npm ni compilación.

## Publicar
Sube estos archivos a cualquier hosting estático (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.):

```
index.html
style.css
app.js
content.js
i18n.js
favicon.svg
assets/
```

## Idiomas (español / inglés)
El botón ES / EN de la cabecera cambia todo el sitio de idioma, incluido el mensaje de WhatsApp. Se recuerda la elección; la primera visita usa el idioma del navegador (inglés si el navegador está en inglés, si no español). Para enlazar directo a un idioma: `?lang=en` o `?lang=es`.

- El español está en `index.html`. Cada texto traducible lleva `data-i18n="clave"` (o `data-i18n-attr="placeholder:clave"` para atributos).
- El inglés está en `i18n.js`, con la misma clave.
- Para cambiar un texto, edítalo en los dos sitios. Para añadir uno nuevo, ponle `data-i18n` en el HTML y añade su clave en inglés en `i18n.js`.
- Las descripciones de fotos (`alt`) de `content.js` tienen versión `es` y `en`.

## Secciones
Portada; presentación; transformaciones; servicios presencial/online; complemento de hábitos de alimentación; preguntas frecuentes; solicitud.

## Solicitudes por WhatsApp
Al enviar el formulario se abre WhatsApp (wa.me) con la solicitud ya escrita para el número en `MELISSA_WHATSAPP` de `content.js`. La clienta solo tiene que tocar "Enviar" en el chat. El sitio no guarda datos. El enlace "WhatsApp" del pie usa el mismo número.

## Fotos y video
Añade los archivos en `assets/` y pon su ruta en `content.js`. Los espacios con `src` vacío no se muestran:
- **intro** (video de presentación): sin video, la sección se ve solo con texto.
- **Transformaciones**: lista `MELISSA_TRANSFORMATIONS` en `content.js`. Cada una tiene título (es/en), foto de antes y foto de después (fotos `assets/1.1.jpeg` = antes, `assets/1.2.jpeg` = después, y así). Para añadir una, copia una línea y cambia los datos. Sin ninguna, la sección y su enlace del menú se ocultan.

La numeración de las secciones (01, 02…) se ajusta sola.

Video de presentación: usa MP4 con códec H.264 y menos de ~20 MB para que funcione en todos los navegadores. Los .mov de iPhone (HEVC) solo se ven en Safari y algunos equipos; si un navegador no puede reproducirlo, la sección se muestra solo con texto.

Ten permiso para publicar fotos de terceros. Si no entrenaste a tu hermano, no atribuyas su resultado a tu coaching.

## Complemento de hábitos de alimentación
Opcional, con costo adicional y contratado aparte del entrenamiento. El botón "Me interesa añadirlo" marca la casilla en el formulario y se incluye en el mensaje de WhatsApp.

## Guion para el video de presentación (35–40 segundos)
¿Vas al gym, pero sientes que te falta un plan para avanzar?
Soy Melissa Linares, entrenadora personal certificada. Ayudo a mujeres a construir fuerza, confianza y hábitos que puedan mantener.
Creamos un entrenamiento según tu nivel, tus objetivos y tu vida. Revisamos tu técnica y seguimos tu progreso.
Puedes entrenar conmigo en Miami o trabajar conmigo online.
Si quieres entrenar con intención, completa la solicitud y hablemos de tu objetivo.
