// @ts-check
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");

async function createServer(routes) {
  const resolve = (p) => path.resolve(__dirname, p);

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  const vite = await (
    await import("vite")
  ).createServer({
    root: process.cwd(),
    logLevel: "info",
    server: {
      middlewareMode: true,
    },
    appType: "custom",
    optimizeDeps: {
      entries: ["./routes/*.ts"],
    },
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);

  routes.forEach((route) => {
    app.use(`/${route}`, async (req, res) => {
      try {
        const url = req.originalUrl;

        let template;
        template = fs.readFileSync(resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule(`./routes/${route}.ts`);

        const appHtml = await render(url, __dirname);

        const html = template.replace(`<!--app-html-->`, appHtml);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite && vite.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    });
  });

  return { app, vite };
}

const routes = ["uuid", "vanilla"];
createServer(routes).then(({ app }) =>
  app.listen(5173, () => {
    console.log("Server started. Routes:");
    routes.forEach((route) => console.log(`- http://localhost:5173/${route}`));
  })
);
