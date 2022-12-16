## Setup

1. Clone the repo
2. Install `pnpm install`
3. Start the server with Vite 4 `pnpm vite4`

The output should be:

```
Server started. Routes:
- http://localhost:5173/vanilla
- http://localhost:5173/uuid
```

## Results

with [`uuid`][uuid]:

```
(node:79886) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
TypeError: Cannot read properties of undefined (reading 'v4')
    at /___/vite-mjs-repro/routes/uuid.ts:3:11
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async instantiateModule (file:///___/vite-mjs-repro/node_modules/.pnpm/vite@4.0.1/node_modules/vite/dist/node/chunks/dep-2285ba4f.js:53234:9)
```

with [`@vanilla-extract/css`][vanilla]:

```
(node:79886) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
TypeError: Cannot read properties of undefined (reading 'setAdapter')
    at /___/vite-mjs-repro/routes/vanilla.ts:3:0
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async instantiateModule (file:///___/vite-mjs-repro/node_modules/.pnpm/vite@4.0.1/node_modules/vite/dist/node/chunks/dep-2285ba4f.js:53234:9)
```

[uuid]: https://unpkg.com/browse/uuid@9.0.0/package.json
[vanilla]: https://unpkg.com/browse/@vanilla-extract/css@1.9.2/adapter/package.json

## With Vite 3

Change to Vite 3 (`pnpm vite3`) and the routes render as expected.

## Curious behaviour (CodeTour)

Investigating a bit further why it fails with `@vanilla-extract/css/adapter` I've identified a curious behaviour which is explained in the guided walkthrough using the [CodeTour] extension. It can be run by installing the CodeTour extension for VS Code or you can just look at the JSON in [./.tours](./.tours/vite-mjs-repro.tour).

To open the tour run the `CodeTour: Open Tour File...` command and/or click the folder icon in the title bar of the CodeTour tree view.

VS Code may struggle debugging **and** running the tour with the massive file (653000+ lines) so if you're having issues just open the [`vite-mjs-repro.tour` file](./.tours/vite-mjs-repro.tour) and read through the steps with your human eyes.

TL;DR:

- Vite 4 resolves `@vanilla-extract/css/adapter` main entry point (defined in `package.json#exports`) using the `module` condition (`./dist/vanilla-extract-css-adapter.esm.mjs`), then reverts to `package.json#main` (`./dist/vanilla-extract-css-adapter.cjs.js`).
- In Vite 3 `@vanilla-extract/css/adapter` is resolved to `./dist/vanilla-extract-css-adapter.cjs.js` using the `default` condition.

[codetour]: https://github.com/microsoft/codetour
