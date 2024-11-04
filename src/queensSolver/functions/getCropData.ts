import React from "react";
import { ReactCropperElement } from "react-cropper";

export function getCropData(cropperRef: React.RefObject<ReactCropperElement>) {
  console.log("get crop data");
  if (typeof cropperRef.current?.cropper !== "undefined") {
    return cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
  } else {
    throw new Error("incorrect crop file");
  }
}
