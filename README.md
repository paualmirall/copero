# Copero

Simulador web de carreras futbolísticas rápidas: decide tu estrategia, responde a eventos y descubre cómo evoluciona una carrera completa.

## Desarrollo

```bash
npm install
npm run dev
```

## Arquitectura

- `src/engine`: motor TypeScript independiente de Vue.
- `src/data`: contenido declarativo JSON (30 eventos iniciales, clubes, lesiones y compañías).
- `src/stores`: estado Pinia y persistencia automática en LocalStorage.
- `src/pages`: creación, temporada, resultado y resumen final.

La aplicación usa rutas relativas para poder publicarse directamente en GitHub Pages.
