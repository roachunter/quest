import { useEffect, useRef } from "react";
import {
  createMap,
  drawCellColors,
  drawRivers,
  getDelaunay,
  getPoints,
} from "../../map/polygon";
import "./styles/RealmsPane.css";

const RealmsPane = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const aspectRatio = container.clientWidth / container.clientHeight;
    const height = 720;
    const width = Math.floor(height * aspectRatio);

    canvas.height = height;
    canvas.width = width;

    const ctx = canvas.getContext("2d")!;

    const clear = () => {
      ctx.clearRect(0, 0, width, height);
    };

    const draw = () => {
      const gridSize = 30;
      const points = getPoints(aspectRatio, gridSize);
      const delaunay = getDelaunay(points);

      const map = createMap(points, delaunay, aspectRatio, gridSize);

      drawCellColors(canvas, map, undefined, gridSize);
      drawRivers(canvas, map, gridSize);
    };

    draw();

    const handleMapRefresh = (e: KeyboardEvent) => {
      if (e.key == "r") {
        clear();
        draw();
      }
    };

    window.addEventListener("keydown", handleMapRefresh);
    return () => {
      window.removeEventListener("keydown", handleMapRefresh);
    };
  }, []);

  return (
    <div className="pane-wrapper2">
      <div ref={canvasContainerRef} className="canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
export default RealmsPane;
