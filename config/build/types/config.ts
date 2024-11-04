/*****************************************************************************
 *
 * @brief Interfaces and tupes for data app's config
 *
 * @author iaroslav.uliantcev@cloudbear.ru
 *
 * Copyright (c) 2024 CloudBEAR LLC, all rights reserved.
 *
 * This file contains confidential, proprietary information and trade
 * secrets of CloudBEAR LLC. The information contained in this file
 * may only be used by a person authorised under and to the extent
 * permitted by a subsisting license agreement or design service
 * agreement from CloudBEAR LLC.
 *
 * This entire notice must be reproduced on all copies of this file
 * and copies of this file may only be made by a person if such person
 * is permitted to do so under the terms of a subsisting license
 * agreement or design service agreement from CloudBEAR LLC.
 *
 *****************************************************************************/

export type BuildMode = "production" | "development";

export interface BuildEnv {
  NODE_ENV: BuildMode;
  port: number;
  envFile: string;
}

export interface BuildPaths {
  entry: string;
  build: string;
  html: string;
  src: string;
}

export interface BuildOptions {
  paths: BuildPaths;
  mode: BuildMode;
  port: number;
  envFileAddition: string;
}
