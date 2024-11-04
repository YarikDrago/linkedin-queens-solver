import Dotenv from "dotenv-webpack";
import ESLintPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack, { HotModuleReplacementPlugin } from "webpack";
import { BuildOptions } from "./types/config";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export function buildPlugins(
  options: BuildOptions
): webpack.WebpackPluginInstance[] {
  const { paths, mode, envFileAddition, port } = options;
  const bundleAnalyzerPort = port + 1000;
  console.log("env file addition:", envFileAddition);
  const plugins: webpack.WebpackPluginInstance[] = [
    new Dotenv({
      path: `./.env${envFileAddition}`,
    }),
    new HtmlWebpackPlugin({
      template:
        mode === "development"
          ? `${paths.html}/indexDev.html`
          : `${paths.html}/index.html`,
      favicon: `${paths.html}/favicon.png`,
    }),
    //to show in percents bundling process.
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
  ];

  plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerPort: bundleAnalyzerPort,
    })
  );

  if (mode === "development") {
    plugins.push(new HotModuleReplacementPlugin());
  }
  return plugins;
}
