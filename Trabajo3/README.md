# Películas Cancheras

Proyecto web estático de catálogo de películas hecho con HTML, CSS y JavaScript. Consume una API externa para mostrar películas, aplicar filtros y navegar por paginación en el navegador.

## Estructura del proyecto

```text
proyecto/
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── main.js
│   │ 
│   ├── components/
│   │   ├── card.js
│   │   ├── modal.js
│   │   └── navbar.js
│   │ 
│   ├── services/
│   │   └── api.js
│   │ 
│   └── views/
│       └── home.js
│ 
├── assets/
│    └── logo.png
│
└── README.md
```

## Instrucciones para ejecutarlo

No requiere instalación de dependencias ni compilación.

1. Abre la carpeta `proyecto` en VS Code o en tu explorador de archivos.
2. Abre `index.html` directamente en el navegador, o usa la extensión Live Server si prefieres servirlo en local.
3. Navega por el catálogo, usa la búsqueda y la paginación desde la interfaz.

## Uso de la interfaz

- La barra de búsqueda permite filtrar películas por título.
- El selector de género muestra solo las películas del género elegido.
- El botón `Limpiar` restablece la búsqueda y el filtro para volver a ver todo el catálogo.

## API utilizada

El proyecto consume la API de películas de Devs API Hub:

https://devsapihub.com/docs/api-movies

La lógica de acceso a datos está centralizada en `js/services/api.js`, y la vista principal gestiona el renderizado del catálogo, filtros y paginación.

## Notas

- La paginación es del lado del cliente.
- El catálogo muestra 10 películas por página (son 30 en total).
- Las tarjetas y la interfaz se ajustan con `css/styles.css`.