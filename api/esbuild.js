const { build } = require("esbuild");

build({
  entryPoints: ["./src/server.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "dist/server.js",
  minify: true,
  sourcemap: false,
});
