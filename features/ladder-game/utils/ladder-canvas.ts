import type { Ladder, LadderRoutePoint } from "../model/ladder";
import type { BoardPoint, BoardSize } from "./ladder-board-geometry";
import { getPointPosition } from "./ladder-board-geometry";

export type DrawStep = {
  from: BoardPoint;
  to: BoardPoint;
  length: number;
};

type CanvasConfig = {
  cellSize: number;
  verticalInset: number;
};

type DrawBaseOptions = CanvasConfig & {
  context: CanvasRenderingContext2D;
  ladder: Ladder;
  participants: string[];
  boardSize: BoardSize;
};

type DrawFrameOptions = DrawBaseOptions & {
  selectedParticipant: number | null;
  selectedStroke: string | null;
  fullPath: string | null;
  drawSteps: DrawStep[];
  totalLength: number;
  label: string;
  progress: number;
};

type RunRouteAnimationOptions = {
  duration: number;
  drawFrame: (progress: number) => void;
  onComplete: () => void;
};

export const getCanvasContext = (canvas: HTMLCanvasElement) => {
  try {
    return canvas.getContext("2d");
  } catch {
    return null;
  }
};

export const shouldReduceMotion = () => {
  if (typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const createDrawSteps = (
  routePoints: LadderRoutePoint[],
  cellSize: number,
) => {
  return routePoints.slice(1).map((point, index) => {
    const from = getPointPosition(routePoints[index], cellSize);
    const to = getPointPosition(point, cellSize);

    return {
      from,
      to,
      length: Math.hypot(to.x - from.x, to.y - from.y),
    };
  });
};

export const getDrawLength = (drawSteps: DrawStep[]) => {
  return drawSteps.reduce((total, step) => total + step.length, 0);
};

export const runRouteAnimation = ({
  duration,
  drawFrame,
  onComplete,
}: RunRouteAnimationOptions) => {
  let animationFrameId = 0;
  const startedAt = performance.now();

  const animateRoute = (currentTime: number) => {
    const progress =
      duration === 0 ? 1 : Math.min((currentTime - startedAt) / duration, 1);

    drawFrame(progress);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animateRoute);
      return;
    }

    onComplete();
  };

  animationFrameId = requestAnimationFrame(animateRoute);

  return () => cancelAnimationFrame(animationFrameId);
};

const getCssVariable = (name: string, fallback: string) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
};

const resolveCanvasColor = (color: string, fallback: string) => {
  const cssVariableMatch = color.match(/^var\((--[^),]+)(?:,\s*([^)]+))?\)$/);

  if (!cssVariableMatch) {
    return color;
  }

  return getCssVariable(cssVariableMatch[1], cssVariableMatch[2] ?? fallback);
};

const toCanvasPoint = (point: BoardPoint, verticalInset: number) => {
  return {
    x: point.x,
    y: point.y + verticalInset,
  };
};

const getPointAtProgress = (
  drawSteps: DrawStep[],
  totalLength: number,
  progress: number,
) => {
  if (drawSteps.length === 0) {
    return null;
  }

  let remainingLength = totalLength * progress;

  for (const step of drawSteps) {
    if (remainingLength <= step.length) {
      const stepProgress =
        step.length === 0 ? 0 : remainingLength / step.length;

      return getStepPoint(step, stepProgress);
    }

    remainingLength -= step.length;
  }

  return drawSteps.at(-1)?.to ?? null;
};

const getStepPoint = (step: DrawStep, progress: number) => {
  return {
    x: step.from.x + (step.to.x - step.from.x) * progress,
    y: step.from.y + (step.to.y - step.from.y) * progress,
  };
};

const drawLine = (
  context: CanvasRenderingContext2D,
  from: BoardPoint,
  to: BoardPoint,
  verticalInset: number,
) => {
  const canvasFrom = toCanvasPoint(from, verticalInset);
  const canvasTo = toCanvasPoint(to, verticalInset);

  context.beginPath();
  context.moveTo(canvasFrom.x, canvasFrom.y);
  context.lineTo(canvasTo.x, canvasTo.y);
  context.stroke();
};

const clearCanvas = ({
  context,
  boardSize,
  verticalInset,
}: Pick<DrawBaseOptions, "context" | "boardSize" | "verticalInset">) => {
  context.clearRect(0, 0, boardSize.width, boardSize.height + verticalInset * 2);
};

const drawGrid = ({
  context,
  ladder,
  boardSize,
  cellSize,
  verticalInset,
}: Omit<DrawBaseOptions, "participants">) => {
  const gridColor = getCssVariable("--game-grid", "rgba(23, 37, 84, 0.2)");

  context.save();
  context.strokeStyle = gridColor;
  context.lineWidth = 0.75;
  context.setLineDash([3, 5]);

  for (let boundary = 0; boundary <= ladder.playerCount; boundary += 1) {
    drawLine(
      context,
      { x: boundary * cellSize, y: 0 },
      { x: boundary * cellSize, y: boardSize.height },
      verticalInset,
    );
  }

  for (let boundary = 0; boundary <= ladder.rowCount; boundary += 1) {
    drawLine(
      context,
      { x: 0, y: boundary * cellSize },
      { x: boardSize.width, y: boundary * cellSize },
      verticalInset,
    );
  }

  context.restore();
};

const drawVerticalLines = ({
  context,
  participants,
  boardSize,
  cellSize,
  verticalInset,
}: Omit<DrawBaseOptions, "ladder">) => {
  const inkColor = getCssVariable("--game-ink", "#14211f");

  context.save();
  context.strokeStyle = inkColor;
  context.lineWidth = 3;
  context.lineCap = "round";
  context.setLineDash([]);

  participants.forEach((_, column) => {
    const x = (column + 0.5) * cellSize;
    drawLine(context, { x, y: 0 }, { x, y: boardSize.height }, verticalInset);
  });

  context.restore();
};

const drawBridges = ({
  context,
  ladder,
  cellSize,
  verticalInset,
}: Pick<DrawBaseOptions, "context" | "ladder" | "cellSize" | "verticalInset">) => {
  const inkColor = getCssVariable("--game-ink", "#14211f");

  context.save();
  context.strokeStyle = inkColor;
  context.lineWidth = 3;
  context.lineCap = "round";
  context.setLineDash([]);

  ladder.bridges.forEach((bridge) => {
    const y = bridge.row * cellSize;

    drawLine(
      context,
      { x: (bridge.leftColumn + 0.5) * cellSize, y },
      { x: (bridge.leftColumn + 1.5) * cellSize, y },
      verticalInset,
    );
  });

  context.restore();
};

const drawLadderBase = (options: DrawBaseOptions) => {
  clearCanvas(options);
  drawGrid(options);
  drawVerticalLines(options);
  drawBridges(options);
};

const drawSelectedPath = ({
  context,
  drawSteps,
  totalLength,
  progress,
  selectedStroke,
  verticalInset,
}: Pick<
  DrawFrameOptions,
  "context" | "drawSteps" | "totalLength" | "progress" | "selectedStroke" | "verticalInset"
>) => {
  if (drawSteps.length === 0 || !selectedStroke) {
    return;
  }

  let remainingLength = totalLength * progress;
  const pathColor = resolveCanvasColor(selectedStroke, "#f7c917");

  context.save();
  context.strokeStyle = pathColor;
  context.lineWidth = 9;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.setLineDash([]);
  context.beginPath();

  const startPoint = toCanvasPoint(drawSteps[0].from, verticalInset);
  context.moveTo(startPoint.x, startPoint.y);

  for (const step of drawSteps) {
    if (remainingLength >= step.length) {
      const endPoint = toCanvasPoint(step.to, verticalInset);
      context.lineTo(endPoint.x, endPoint.y);
      remainingLength -= step.length;
      continue;
    }

    const stepProgress =
      step.length === 0 ? 0 : remainingLength / step.length;
    const currentPoint = toCanvasPoint(
      getStepPoint(step, stepProgress),
      verticalInset,
    );

    context.lineTo(currentPoint.x, currentPoint.y);
    break;
  }

  context.stroke();
  context.restore();
};

const drawRouteLabel = ({
  context,
  label,
  position,
  selectedStroke,
  verticalInset,
}: Pick<DrawFrameOptions, "context" | "label" | "selectedStroke" | "verticalInset"> & {
  position: BoardPoint | null;
}) => {
  if (!position || !selectedStroke) {
    return;
  }

  const canvasPosition = toCanvasPoint(position, verticalInset);
  const labelColor = resolveCanvasColor(selectedStroke, "#f7c917");

  context.save();
  context.translate(canvasPosition.x, canvasPosition.y);
  context.fillStyle = labelColor;
  context.strokeStyle = "white";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(-16, -16, 32, 32, 6);
  context.fill();
  context.stroke();
  context.fillStyle = "white";
  context.font = "900 12px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 0, 0, 28);
  context.restore();
};

export const drawCanvasFrame = (options: DrawFrameOptions) => {
  drawLadderBase(options);

  if (
    options.selectedParticipant === null ||
    !options.selectedStroke ||
    !options.fullPath
  ) {
    return;
  }

  drawSelectedPath(options);
  drawRouteLabel({
    ...options,
    position: getPointAtProgress(
      options.drawSteps,
      options.totalLength,
      options.progress,
    ),
  });
};
