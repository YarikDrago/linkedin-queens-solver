import { CellColor } from "@/queensSolver/ui/QueensSolver";

export function drawClearField(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gridSize: number,
  cellColors: CellColor[],
) {
  // draw new field
  const canvas = canvasRef.current;
  if (!canvas) return;
  canvas.width = 400;
  canvas.height = 400;
  const context = canvas?.getContext("2d");
  const cellSide = 400 / gridSize;

  if (!context) return;
  cellColors.map((cell) => {
    context.fillStyle = cell.color;
    context.fillRect(cell.x * cellSide, cell.y * cellSide, cellSide, cellSide);
  });

  // draw grid's lines
  for (let i = 1; i < gridSize; i++) {
    context.strokeStyle = "black";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(0, i * cellSide);
    context.lineTo(400, i * cellSide);
    context.stroke(); // Прорисовка линии

    context.beginPath();
    context.moveTo(i * cellSide, 0);
    context.lineTo(i * cellSide, 400);
    context.stroke();
  }
}
