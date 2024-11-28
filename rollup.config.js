import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import typescript from "@rollup/plugin-typescript";

const pkg = JSON.parse(readFileSync(join(cwd(), "package.json"), "utf8"));

export default {
  input: "guest-js/index.ts",
  output: [
    {
      file: pkg.import,
      format: "esm",
    },
    {
      file: pkg.require,
      format: "cjs",
    },
  ],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: `./${pkg.import.split("/")[0]}`,
    }),
  ],
  external: [
    /^@tauri-apps\/api/,
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
