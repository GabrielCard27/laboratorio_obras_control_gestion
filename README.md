# Laboratorio de Control de Gestión de Obras — Panel General

Panel contenedor (shell) para el roadmap de 5 módulos "De los datos a la decisión"
(EDA → Presupuestos y Desvíos → Diagnóstico de Desvíos → Análisis Predictivo → Decisión),
aplicado al caso de referencia Alumbrado Público RP16.
Sitio 100% estático: HTML + CSS + JS planos, sin build step ni framework.

## Estructura

```
/index.html              Panel General (shell): header, resumen, grilla de módulos
/assets/css/tokens.css   Paleta y tipografía compartidas
/assets/css/shell.css    Estilos exclusivos del shell
/assets/js/shell.js      Lee config/modules.json y renderiza el panel
/config/modules.json     Registro de módulos (dato — no código)
/modules/eda/                 M01 — EDA / Exploración de Datos (activo)
/modules/presupuestos/        M02 — Presupuestos y Desvíos (activo)
/modules/diagnostico-desvios/ M03 — Diagnóstico de Desvíos (placeholder, sin lógica todavía)
/modules/predictivo/          M04 — Análisis Predictivo (placeholder, sin lógica todavía)
/modules/decision/            M05 — Decisión / Análisis de Escenarios (placeholder, sin lógica todavía)
```

Cada módulo es una página autocontenida (su propio `<style>`/`<script>`). El shell
nunca importa ni ejecuta código de un módulo — solo arma un link hacia su `path`.

## Ver el proyecto en local

Los navegadores bloquean `fetch()` sobre `file://`, así que hace falta un servidor
mínimo (el shell carga `config/modules.json` con `fetch`):

```bash
npx serve .
# o
python3 -m http.server 8000
```

Abrir `http://localhost:PORT`.

## Desplegar en Vercel

1. Subir esta carpeta a un repositorio de GitHub.
2. En Vercel: **New Project → Import** el repositorio.
3. Framework Preset: **Other** (sitio estático). No hace falta build command ni output directory.
4. Deploy. Cada push a la rama principal vuelve a desplegar automáticamente.

No hay variables de entorno ni configuración adicional necesaria en esta etapa.

## Cómo agregar un módulo nuevo (ejemplo: M06 — Evaluación de Flota)

1. Crear la carpeta `/modules/flota/` con su propio `index.html` (y los assets que
   necesite dentro de esa misma carpeta). No tocar `index.html` del shell ni los
   otros módulos.
2. Agregar la entrada correspondiente en `config/modules.json`:
   ```json
   {
     "id": "M06",
     "key": "flota",
     "title": "Evaluación de Flota",
     "subtitle": "Análisis de vehículos y equipos",
     "description": "Análisis económico y operativo de vehículos y equipos.",
     "icon": "🚚",
     "path": "modules/flota/index.html",
     "status": "active",
     "order": 6,
     "version": "0.1"
   }
   ```
3. (Opcional pero recomendado) Agregar, como primer elemento del `<body>` del
   módulo, la misma barra de retorno que usan M01/M02:
   ```html
   <div style="background:#16324F;padding:8px 16px;">
     <a href="../../index.html" style="color:#fff;opacity:.85;font:12px -apple-system,sans-serif;text-decoration:none;">&larr; Panel General</a>
   </div>
   ```
4. Commit + push. Vercel redespliega solo. El shell nunca se modifica.

Para pasar un módulo de `"planned"` a `"active"` alcanza con cambiar ese campo en
`modules.json` una vez que el módulo esté listo — la tarjeta pasa a ser clickeable
automáticamente.

## Ícono y vista previa al compartir en LinkedIn (Vercel + GitHub)

Son dos cosas distintas y hay que resolver cada una:

**1. Favicon (ícono de la pestaña del navegador)**
Ya está agregado en `index.html` y en cada módulo, como un emoji embebido en el propio HTML
(`<link rel="icon" href="data:image/svg+xml,...">`). No requiere ningún archivo — funciona apenas
se despliega.

**2. Tarjeta de vista previa (lo que se ve al pegar el link en LinkedIn, sobre todo en celular)**
Esto lo controlan las etiquetas `og:image` / `twitter:image` en el `<head>` de `index.html`
(ya agregadas), pero necesitan una imagen real para funcionar:

1. Exportar una imagen de 1200×630px (el diseño tipo "Control de Gestión de Obras" que ya tenés
   en Canva sirve perfecto) y guardarla como `assets/og-image.png`.
2. Una vez desplegado en Vercel, reemplazar `TU-DOMINIO` en `index.html` por el dominio real
   (ej. `laboratorio-cdg.vercel.app`) en las 4 etiquetas `og:image`, `og:url`, `twitter:image`.
3. En el repositorio de GitHub: **Settings → General → Social preview → Upload an image**
   (recomendado 1280×640px). Esto es independiente de las etiquetas `og:` — GitHub usa su propia
   configuración para la vista previa del *repositorio* (no de tu sitio desplegado).
4. LinkedIn cachea las vistas previas agresivamente: después de subir la imagen, probar con el
   **LinkedIn Post Inspector** (https://www.linkedin.com/post-inspector/) pegando la URL — eso
   fuerza a LinkedIn a releer la imagen antes de que la compartas en un post real.

En celular, LinkedIn recorta la tarjeta de forma más ajustada que en desktop — conviene que el
texto/logo del diseño quede centrado y no pegado a los bordes de la imagen de 1200×630.

## Conectar una fuente de datos real (Supabase u otra)


Ningún módulo depende hoy de una fuente de datos externa — cada uno trabaja con un
dataset demo embebido en su propio archivo. Cuando corresponda migrar un módulo a
Supabase (o a una API propia), el cambio queda contenido dentro de ese módulo: se
reemplaza la carga del dataset embebido por una llamada `fetch`/cliente de Supabase
al inicio del script del módulo, sin tocar el shell ni los demás módulos.

## Principios que mantiene esta arquitectura

- El shell no conoce la lógica interna de ningún módulo — solo su `id`, `title`,
  `description`, `path`, `status`, `order` y `version`.
- Ningún módulo duplica el header/navegación global del proyecto.
- Agregar o modificar un módulo nunca requiere reconstruir el shell.
- El registro de módulos es un archivo de datos (`modules.json`), no código —
  se puede editar sin tocar JavaScript.
