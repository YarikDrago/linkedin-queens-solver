import path from "path";
import { BuildEnv, BuildPaths } from "./config/build/types/config";
import { WebpackConfiguration } from "webpack-cli";
import { buildWebpackConfig } from "./config/build/buildWebpackConfig";


export default (env: BuildEnv) => {
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    build: path.resolve(__dirname, "dist"),
    html: path.resolve(__dirname, "public"),
    src: path.resolve(__dirname, "src"),
  };

  const mode = env.NODE_ENV || "development";
  const PORT = Number(env.port) || 3000;
  const envFileAddition = env.envFile ? "." + env.envFile : "";

  const config: WebpackConfiguration = buildWebpackConfig({
    paths,
    mode,
    port: PORT,
    envFileAddition,
  });
  return config;
};
