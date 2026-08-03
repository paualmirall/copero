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

## Publicación

El workflow `Deploy Copero to GitHub Pages` ejecuta las pruebas, genera la aplicación y publica `dist` en GitHub Pages con cada push a `main` o `codex/crear-base-del-juego-copero`. También puede iniciarse manualmente desde la pestaña **Actions** del repositorio.

Para la primera publicación, configura **Settings → Pages → Build and deployment → Source** como **GitHub Actions**. No selecciones **Deploy from a branch**: esa opción sirve los archivos fuente sin compilarlos y la aplicación Vue no podrá arrancar.

La URL pública del repositorio `paualmirall/copero` es <https://paualmirall.github.io/copero/>. Después de cambiar el origen a GitHub Actions, ejecuta manualmente el workflow desde **Actions → Deploy Copero to GitHub Pages → Run workflow** si no se inicia automáticamente.