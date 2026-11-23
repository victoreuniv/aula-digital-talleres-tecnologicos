# AULA DIGITAL – Talleres Tecnológicos

Sitio web responsive y accesible para consultar talleres tecnológicos y reservar una plaza. Proyecto desarrollado con **HTML5, CSS3 y JavaScript puro**, sin frameworks ni backend.

## Demo

- Repositorio: https://github.com/victoreuniv/aula-digital-talleres-tecnologicos
- GitHub Pages: se podrá activar desde la configuración del repositorio.

## Archivos

- `index.html`: estructura semántica y contenido.
- `style.css`: diseño Mobile First, responsive y estados visuales.
- `script.js`: validación, reservas, localStorage, progreso, simulador y cuestionario.
- `README.md`: documentación del proyecto.

## Funcionalidades

- Menú adaptable y navegación por teclado.
- Tres talleres interactivos con plazas disponibles.
- Selección visual y actualización del formulario.
- Validación en tiempo real de nombre, correo, taller y privacidad.
- Barra de progreso calculada al completar los cuatro campos.
- Contadores persistentes con `localStorage`.
- Confirmación modal con resumen de la reserva.
- Consejos didácticos cambiantes.
- Cuestionario de tres preguntas con corrección y puntuación.
- Simulador de vistas móvil y ordenador.
- Mensajes accesibles con `aria-live`, etiquetas y foco visible.

## Datos locales

Las reservas son exclusivamente demostrativas. Se guardan en el navegador del usuario mediante `localStorage`, junto con la dirección de correo introducida para practicar. No se realizan envíos de correo ni existe una conexión con servidor o base de datos.

Para eliminar los datos de prueba, abre las herramientas de desarrollo del navegador y ejecuta:

```javascript
localStorage.removeItem("aulaDigitalReservations");
location.reload();
```

## Prueba local

No es necesario instalar dependencias. Puedes abrir `index.html` directamente o utilizar un servidor local:

```bash
python3 -m http.server 8000
```

Después abre `http://localhost:8000`.

## Publicación con GitHub Pages

1. Crea o usa el repositorio público `victoreuniv/aula-digital-talleres-tecnologicos`.
2. Sube `index.html`, `style.css`, `script.js` y `README.md` a la rama principal `main`.
3. En GitHub, abre **Settings** → **Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige `main` y `/ (root)` y pulsa **Save**.
6. Espera a que termine el despliegue y abre el enlace público que muestra la sección Pages.

La URL tendrá este formato:

```text
https://victoreuniv.github.io/aula-digital-talleres-tecnologicos/
```

## Capturas

Capturas recomendadas para la entrega:

- `capturas/desktop.png`: página completa a 1440 px.
- `capturas/mobile.png`: versión móvil a 390 px.
- `capturas/reserva-desktop.png`: confirmación o formulario.
- `capturas/reserva-mobile.png`: confirmación en móvil.

Las capturas deben mostrar el proyecto funcionando y pueden añadirse a la carpeta `capturas` antes de entregar.

## Accesibilidad y responsive

El proyecto utiliza etiquetas HTML semánticas, atributos `aria-*`, navegación mediante teclado, foco visible y mensajes asociados a los campos. El diseño comienza con estilos móviles y añade mejoras para tablet y escritorio mediante media queries.
