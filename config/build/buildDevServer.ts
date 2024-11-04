import { BuildOptions } from "./types/config";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
  const { paths } = options;
  return {
    static: paths.build,
    historyApiFallback: true,
    port: options.port,
    open: true,
    hot: true,
  };
}
