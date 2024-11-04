import path from "path";
import { BuildOptions } from "./types/config";
import { ResolveOptions } from "webpack";

export function buildResolvers(options: BuildOptions): ResolveOptions {
  const { paths } = options;
  return {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@models": path.resolve(paths.src, "models"),
      "@": path.resolve(paths.src),
      Test: path.resolve(paths.src),
    },
  };
}
