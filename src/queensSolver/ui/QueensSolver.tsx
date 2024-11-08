import React, { createRef, useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getCropData } from "@/queensSolver/functions/getCropData";
import { hexToRGB } from "@/queensSolver/functions/hexToRGB";
import { drawClearField } from "@/queensSolver/functions/drawClearField";
import { findQueens } from "@/queensSolver/functions/findQueens";
import DragImgForm from "@/dragImgForm/ui/DragImgForm";
import "./QueensSolver.styles.scss";

export interface CellColor {
  x: number;
  y: number;
  color: string;
}

const QueensSolver = () => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const cropperRef = createRef<ReactCropperElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState("1");
  const [lastClickSolveBtn, setLastClickSolveBtn] = useState(new Date());
  const [solutionVisibility, setSolutionVisibility] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // TODO change CSS for mobile devices
  // TODO add the auto-determination of the grid size

  useEffect(() => {
    setErrorMsg("");
    setSolutionVisibility(false);
  }, [image]);

  useEffect(() => {
    if (!solutionVisibility) return;
    solve(gridSize);
    document.getElementById("queens-solution-end")!.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [lastClickSolveBtn]);

  async function solve(fieldSize: string) {
    try {
      setErrorMsg("");
      if (isNaN(+fieldSize)) {
        throw new Error("Error: Grid size not a number!");
      }
      // analyze
      const cropImg = getCropData(cropperRef);
      let cellsData = await createCellsData(cropImg, +fieldSize);
      cellsData = transformCellsColors(cellsData, +gridSize);
      drawClearField(canvasRef, +gridSize, cellsData);
      findQueens(canvasRef, +gridSize, cellsData);
    } catch (e) {
      // TODO
      setSolutionVisibility(false);
      console.log(e);
      // throw new Error((e as Error).message)
      setErrorMsg((e as Error).message);
    }
  }

  function createCellsData(
    fieldImg: string,
    gridSize: number,
  ): Promise<CellColor[]> {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) {
        reject(new Error("Error: Cannot create cells data"));
        return;
      }

      const imageCanvas = new Image();
      imageCanvas.src = fieldImg;
      imageCanvas.onload = () => {
        canvas.width = imageCanvas.width;
        canvas.height = imageCanvas.height;
        context.drawImage(imageCanvas, 0, 0);

        const cellWidth = imageCanvas.width / gridSize;
        const cellHeight = imageCanvas.height / gridSize;
        const cellsData: CellColor[] = [];

        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const pixelData = context.getImageData(
              x * cellWidth + cellWidth / 2,
              y * cellHeight + cellHeight / 2,
              1,
              1,
            ).data;

            // determine a color in HEX format
            const color = `#${((1 << 24) + (pixelData[0] << 16) + (pixelData[1] << 8) + pixelData[2]).toString(16).slice(1)}`;
            cellsData.push({ x, y, color });
          }
        }
        resolve(cellsData);
      };

      imageCanvas.onerror = () => {
        reject(new Error("Error: Failed to load image"));
      };
    });
  }

  function transformCellsColors(cellsData: CellColor[], gridSize: number) {
    console.log("transform cells' colors");
    const colors: Set<string> = new Set();
    cellsData.map((cell) => {
      colors.add(cell.color);
    });
    if (colors.size === gridSize) return cellsData;
    console.log("Incorrect number of colors.", colors.size, gridSize);
    const newCellsData = [...cellsData];
    const filteredColors: string[] = [];

    for (const cell of newCellsData) {
      const currColor = hexToRGB(cell.color);
      let sameColor = "";
      for (const filteredColor of filteredColors) {
        const comparedColor = hexToRGB(filteredColor);
        const dr = Math.abs(currColor.r - comparedColor.r);
        const dg = Math.abs(currColor.g - comparedColor.g);
        const db = Math.abs(currColor.b - comparedColor.b);
        const delta = 10;
        if (dr <= delta && dg <= delta && db <= delta) {
          sameColor = filteredColor;
          break;
        }
      }
      if (sameColor === "") filteredColors.push(cell.color);
      else {
        cell.color = sameColor;
      }
    }

    // check again the colors amount
    if (filteredColors.length !== gridSize) {
      throw new Error("Error: incorrect number of colors.");
    }
    return newCellsData;
  }

  return (
    <div className={"queens-solver"}>
      <DragImgForm
        callback={(img) => {
          setImage(img);
        }}
      />
      {image && (
        <>
          <div className={"grid-size-block"}>
            <p>Grid size:</p>
            <input
              value={gridSize}
              onChange={(e) => {
                setErrorMsg("");
                setGridSize(e.target.value);
              }}
            />
          </div>
          <button
            className={"solve-btn"}
            onClick={() => {
              // solve(gridSize);
              setSolutionVisibility(true);
              setLastClickSolveBtn(new Date());
            }}
          >
            Solve
          </button>
          {errorMsg !== "" && <p className={"error-msg"}>{errorMsg}</p>}
          <Cropper
            ref={cropperRef}
            style={{ height: 400, width: 400, backgroundColor: "gray" }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
            zoomable={false}
          />
          <p>Preview</p>
          <div
            className="img-preview"
            style={{
              width: "200px",
              float: "left",
              height: "200px",
              overflow: "hidden",
              backgroundColor: "green",
            }}
          />
          {solutionVisibility && (
            <>
              <h2>Solution</h2>
              <canvas
                id={"queens-solution-canvas"}
                ref={canvasRef}
                style={{
                  height: 400,
                  width: 400,
                  backgroundColor: "green",
                }}
              />
            </>
          )}
        </>
      )}
      <p id={"queens-solution-end"} />
    </div>
  );
};

export default QueensSolver;
