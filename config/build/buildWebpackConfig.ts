import webpack from "webpack";
import { BuildOptions } from "./types/config";
import { buildDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";

const environment =
  process.env.NODE_ENV !== "production" ? "development" : "production";

export function buildWebpackConfig(
  options: BuildOptions,
): webpack.Configuration {
  const { paths } = options;
  return {
    mode: environment,
    entry: paths.entry,
    output: {
      filename: "[name].[contenthash].js", // the name of the bundle
      publicPath: environment === "development" ? "/" : "/perfdb/",
      path: paths.build,
      clean: true, // auto clean all files from /dist folder
    },
    resolve: buildResolvers(options),
    plugins: buildPlugins(options),
    module: {
      rules: buildLoaders(options),
    },
    devtool: "inline-source-map",
    devServer: buildDevServer(options),
  };
}
