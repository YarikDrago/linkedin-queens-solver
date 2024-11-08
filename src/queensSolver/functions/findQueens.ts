import React from "react";
import { CellColor } from "@/queensSolver/ui/QueensSolver";
import queenIcon from "@/../public/img/queen-icon.svg";

export function findQueens(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gridSize: number,
  cellColors: CellColor[],
) {
  const queens = iter(
    0,
    new Set<string>(),
    new Set<number>(),
    new Set<string>(),
  );

  if (queens) {
    // draw queens on field
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const cellSide = 400 / gridSize;
    if (!context) return;
    const queenImg = new Image();
    queenImg.src = queenIcon;
    const padding = 0.25; // in percents
    const imgDisplaySize = cellSide - 2 * cellSide * padding;
    queenImg.onload = () => {
      for (const queen of queens) {
        context.drawImage(
          queenImg,
          cellSide * (queen.x + padding),
          cellSide * (queen.y + padding),
          imgDisplaySize,
          imgDisplaySize,
        );
      }
    };
    return;
  }
  throw new Error("can not find queens");

  function iter(
    row: number,
    checkedColor: Set<string>,
    checkedCols: Set<number>,
    forbiddenCells: Set<string>,
  ): { x: number; y: number }[] | false {
    for (let i = 0; i < gridSize; i++) {
      const pos = row * gridSize + i;
      const cell = cellColors[pos];
      const cellName = String(row) + "/" + String(i);
      if (
        checkedColor.has(cell.color) ||
        checkedCols.has(cell.x) ||
        forbiddenCells.has(cellName)
      ) {
        continue;
      }
      if (row + 1 === gridSize) {
        return [{ x: i, y: row }];
      }
      checkedColor.add(cell.color);
      checkedCols.add(cell.x);
      // add new forbidden cells
      const newForbiddenCells: string[] = [];
      for (let c = i - 1; c <= i + 1; c++) {
        if (c < 0 || c === gridSize) continue;
        const str = String(row + 1) + "/" + String(c);
        newForbiddenCells.push(str);
        forbiddenCells.add(str);
      }
      const subRes: { x: number; y: number }[] | false = iter(
        row + 1,
        checkedColor,
        checkedCols,
        forbiddenCells,
      );
      checkedColor.delete(cell.color);
      checkedCols.delete(cell.x);
      for (const forbiddenCell of newForbiddenCells) {
        forbiddenCells.delete(forbiddenCell);
      }
      if (!subRes) continue;
      subRes.push({ x: i, y: row });
      return subRes;
    }
    return false;
  }
}
