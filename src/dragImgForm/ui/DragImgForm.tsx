import React, { useEffect, useRef } from "react";
import "./dragImgFrom.styles.scss";

interface IDragImg {
  callback: (fileString: string) => void;
}

const DragImgForm = ({ callback }: IDragImg) => {
  const dropArea = useRef(null);

  useEffect(() => {
    if (!dropArea.current) return;
    const dropAreaElem = dropArea.current as HTMLDivElement;
    const dragEventsIn = ["dragenter", "dragover"];
    const dragEventsOut = ["dragleave", "drop"];

    dragEventsIn.concat(dragEventsOut).forEach((eventName) => {
      dropAreaElem.addEventListener(eventName, preventDefault, false);
    });
    dragEventsIn.forEach((eventName) => {
      dropAreaElem.addEventListener(eventName, highlight, false);
    });
    dragEventsOut.forEach((eventName) => {
      dropAreaElem.addEventListener(eventName, unhighlight, false);
    });
    dropAreaElem.addEventListener("drop", handleDrop, false);
    window.addEventListener("paste", handlePaste);

    return () => {
      dragEventsIn.concat(dragEventsOut).forEach((eventName) => {
        dropAreaElem.removeEventListener(eventName, preventDefault, false);
      });
      dragEventsIn.forEach((eventName) => {
        dropAreaElem.removeEventListener(eventName, highlight, false);
      });
      dragEventsOut.forEach((eventName) => {
        dropAreaElem.removeEventListener(eventName, unhighlight, false);
      });
      dropAreaElem.removeEventListener("drop", handleDrop, false);
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  function preventDefault(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    if (!dropArea.current) return;
    (dropArea.current as HTMLDivElement).classList.add("highlight");
  }

  function unhighlight() {
    if (!dropArea.current) return;
    (dropArea.current as HTMLDivElement).classList.remove("highlight");
  }

  function handleDrop(e: DragEvent) {
    const dt = e.dataTransfer;
    if (!dt) return;
    const files = dt.files;
    handleFiles(files);
  }

  function handlePaste(e: ClipboardEvent) {
    try {
      e.preventDefault();
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleFiles(files: FileList) {
    // get only first file
    const file = [...files][0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div ref={dropArea} id="drop-area">
      <form className="my-form">
        <p>
          {"Upload file with the file dialog or by dragging and dropping\n" +
            "          image onto the dashed region or by 'Ctrl+V'"}
        </p>
        <input
          type="file"
          id="fileElem"
          multiple
          onChange={(e) => {
            handleFiles(e.target.files!);
          }}
        />
        <label className="button" htmlFor="fileElem">
          Select file
        </label>
      </form>
    </div>
  );
};

export default DragImgForm;
