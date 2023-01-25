# Spacebox

## Demos

temporary url: `https://roelifant.com/brol/spacebox/`.

## Stack
- typescript
- pixi.js
- vue 3
- tailwindcss
- vite

## Developer resources

- [Pixi.js framework](https://pixijs.download/release/docs/index.html)
- [vue 3](https://vuejs.org/api/)
- [Tailwind css](https://tailwindcss.com/docs/installation)

## Notes

Vite hot reloading typically breaks when editing game files like `World.ts` and such. Bootstrapping the game again while assets are already preloaded etc. is just too much for Pixi.js to handle. So for game changes you'll have to reload the page to see changes.

Luckily hot reloads never break when making changes to vue templates though, which is the main thing you'd want to use hot reloads for anyways :) .