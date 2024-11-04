// imageUtils.ts
import { ChangeEvent, Dispatch, DragEvent, SetStateAction } from "react";

export function selectImage(
  e: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>,
  setImage: Dispatch<SetStateAction<string | undefined>>,
  image?: string,
) {
  e.preventDefault();
  let files: FileList | null = null;

  if (e.type === "change") {
    const target = e.target as HTMLInputElement;
    files = target.files;
  } else if (e.type === "drop") {
    const target = e as DragEvent<HTMLDivElement>;
    files = target.dataTransfer?.files || null;
  }

  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (reader.result !== image) {
          // Avoid setting the same image
          setImage(reader.result);
        }
      }
    };
    reader.readAsDataURL(files[0]);
  }
}
