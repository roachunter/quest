import Delaunator from "delaunator";
import { createNoise2D } from "simplex-noise";

const GRID_SIZE = 25;
const JITTER = 0.5;
const WAVELENGTH = 0.3;
const SEA_LEVEL = 0.5;

///////////////////////////////////////////////////////////////////////////////////
////                                 POINTS                                    ////
///////////////////////////////////////////////////////////////////////////////////

export function getPoints(aspectRatio: number, gridSize = GRID_SIZE) {
  const points: Point[] = [];

  const width = Math.floor(gridSize * aspectRatio);
  const height = gridSize;

  for (let x = 0; x <= width; x++) {
    for (let y = 0; y <= height; y++) {
      const point: Point = {
        x: x + JITTER * (Math.random() - Math.random()),
        y: y + JITTER * (Math.random() - Math.random()),
      };

      points.push(point);
    }
  }

  points.push({ x: -10, y: height / 2 });
  points.push({ x: width + 10, y: height / 2 });
  points.push({ y: -10, x: width / 2 });
  points.push({ y: height + 10, x: width / 2 });
  points.push({ x: -10, y: -10 });
  points.push({ x: width + 10, y: height + 10 });
  points.push({ y: -10, x: width + 10 });
  points.push({ y: height + 10, x: -10 });

  return points;
}

///////////////////////////////////////////////////////////////////////////////////
////                                TRIANGLES                                  ////
///////////////////////////////////////////////////////////////////////////////////

export function getDelaunay(points: Point[]) {
  return Delaunator.from(
    points,
    (loc) => loc.x,
    (loc) => loc.y
  );
}

function triangleOfEdge(e: number): number {
  return Math.floor(e / 3);
}

function nextHalfedge(e: number): number {
  return e % 3 == 2 ? e - 2 : e + 1;
}

function edgesAroundPoint(
  halfedges: Int32Array<ArrayBufferLike>,
  start: number
) {
  const result = [];
  let incoming = start;

  do {
    result.push(incoming);
    const outgoing = nextHalfedge(incoming);
    incoming = halfedges[outgoing];
  } while (incoming != -1 && incoming != start);

  return result;
}

export function calculateCentroids(
  points: Point[],
  delaunay: Delaunator<Float64Array<ArrayBufferLike>>
) {
  const numTriangles = delaunay.halfedges.length / 3;
  const centroids: Point[] = [];

  for (let t = 0; t < numTriangles; t++) {
    let sumOfX = 0,
      sumOfY = 0;
    for (let i = 0; i < 3; i++) {
      const s = 3 * t + i;
      const p = points[delaunay.triangles[s]];

      sumOfX += p.x;
      sumOfY += p.y;
    }

    centroids[t] = { x: sumOfX / 3, y: sumOfY / 3 };
  }

  return centroids;
}

function findAdjacentTriangles(
  numRegions: number,
  triangles: Uint32Array<ArrayBufferLike>
) {
  const adjacent: number[][] = Array.from({ length: numRegions }, () => []);
  for (let i = 0; i < triangles.length; i++) {
    const r = triangles[i];
    const t = Math.floor(i / 3);
    if (!adjacent[r].includes(t)) {
      adjacent[r].push(t);
    }
  }
  return adjacent;
}

function getNeighborTriangles(
  t: number,
  halfedges: Int32Array<ArrayBufferLike>
): number[] {
  const neighbors = [];
  const edgesOfTriangle = [3 * t, 3 * t + 1, 3 * t + 2];

  for (const e of edgesOfTriangle) {
    const opposite = halfedges[e];
    if (opposite !== -1) {
      neighbors.push(triangleOfEdge(opposite));
    }
  }

  return neighbors;
}

///////////////////////////////////////////////////////////////////////////////////
////                               ELEVATION                                   ////
///////////////////////////////////////////////////////////////////////////////////

function assignTriangleElevation(
  centers: Point[],
  numTriangles: number,
  aspectRatio: number,
  gridSize = GRID_SIZE
) {
  const noise = createNoise2D();
  const elevation = [];

  for (let t = 0; t < numTriangles; t++) {
    const nx = centers[t].x / gridSize - aspectRatio / 2,
      ny = centers[t].y / gridSize - 0.5;

    elevation[t] = (1 + noise(nx / WAVELENGTH, ny / WAVELENGTH)) / 2;

    const d = 2 * Math.max(Math.abs(nx), Math.abs(ny));
    elevation[t] = (1 + elevation[t] - d) / 2;
  }

  return elevation;
}

function assignRegionElevation(
  numRegions: number,
  triangles: Uint32Array<ArrayBufferLike>,
  tElevation: number[]
) {
  const elevation = [];
  const adjacentTriangles = findAdjacentTriangles(numRegions, triangles);

  for (let r = 0; r < numRegions; r++) {
    const adjacent_t = adjacentTriangles[r];
    const sumOfElevations = adjacent_t.reduce(
      (sum, t) => sum + tElevation[t],
      0
    );
    elevation[r] = sumOfElevations / adjacent_t.length;
  }

  return elevation;
}

///////////////////////////////////////////////////////////////////////////////////
////                                 MOISTURE                                  ////
///////////////////////////////////////////////////////////////////////////////////

function assignMoisture(
  points: Point[],
  numRegions: number,
  aspectRatio: number,
  gridSize = GRID_SIZE
) {
  const noise = createNoise2D();

  const moisture = [];
  for (let r = 0; r < numRegions; r++) {
    const nx = points[r].x / gridSize - aspectRatio,
      ny = points[r].y / gridSize - 0.5;

    moisture[r] = (1 + noise(nx / WAVELENGTH, ny / WAVELENGTH)) / 2;
  }

  return moisture;
}

///////////////////////////////////////////////////////////////////////////////////
////                                 BIOMES                                    ////
///////////////////////////////////////////////////////////////////////////////////

function biomeColor(map: GameMap, r: number) {
  let e = (map.rElevation[r] - 0.5) * 2,
    m = map.moisture[r];

  let red, green, blue;

  if (e < 0.0) {
    red = 48 + 48 * e;
    green = 64 + 64 * e;
    blue = 127 + 127 * e;
  } else {
    m = m * (1 - e);
    e = e ** 4; // tweaks
    red = 210 - 100 * m;
    green = 185 - 45 * m;
    blue = 139 - 45 * m;
    red = 255 * e + red * (1 - e);
    green = 255 * e + green * (1 - e);
    blue = 255 * e + blue * (1 - e);
  }
  return `rgb(${red | 0}, ${green | 0}, ${blue | 0})`;
}

///////////////////////////////////////////////////////////////////////////////////
////                                 RIVERS                                    ////
///////////////////////////////////////////////////////////////////////////////////

function generateRivers(map: GameMap): Map<number, number> {
  const riverFlow = new Map<number, number>();

  const riverSources: number[] = [];
  for (let t = 0; t < map.numTriangles; t++) {
    const elevation = map.tElevation[t];
    if (elevation > SEA_LEVEL + 0.15 && elevation < 0.9) {
      if (Math.random() < 0.05) {
        riverSources.push(t);
      }
    }
  }

  for (const startT of riverSources) {
    let currentT = startT;
    const riverPath: number[] = [];
    let reachedSea = false;

    while (true) {
      const neighbors = getNeighborTriangles(currentT, map.halfedges);
      let lowestNeighborT = -1;
      let minElevation = map.tElevation[currentT];

      for (const neighborT of neighbors) {
        if (map.tElevation[neighborT] < minElevation) {
          minElevation = map.tElevation[neighborT];
          lowestNeighborT = neighborT;
        }
      }

      if (lowestNeighborT == -1) {
        break;
      }

      const edgesOfCurrent = [3 * currentT, 3 * currentT + 1, 3 * currentT + 2];
      let flowEdge = -1;
      for (const e of edgesOfCurrent) {
        if (
          map.halfedges[e] !== -1 &&
          triangleOfEdge(map.halfedges[e]) === lowestNeighborT
        ) {
          flowEdge = e;
          break;
        }
      }

      if (flowEdge == -1) {
        break;
      }

      riverPath.push(flowEdge);

      if (map.tElevation[lowestNeighborT] < SEA_LEVEL) {
        reachedSea = true;
        break;
      }

      currentT = lowestNeighborT;
    }

    if (reachedSea) {
      for (const edge of riverPath) {
        const currentFlow = riverFlow.get(edge) || 0;
        riverFlow.set(edge, currentFlow + 1);

        const oppositeEdge = map.halfedges[edge];
        if (oppositeEdge != -1) {
          riverFlow.set(oppositeEdge, currentFlow + 1);
        }
      }
    }
  }

  return riverFlow;
}

///////////////////////////////////////////////////////////////////////////////////
////                                  MAP                                      ////
///////////////////////////////////////////////////////////////////////////////////

export function createMap(
  points: Point[],
  delaunay: Delaunator<Float64Array<ArrayBufferLike>>,
  aspectRatio: number,
  gridSize = GRID_SIZE
) {
  const numRegions = points.length;
  const numTriangles = delaunay.triangles.length / 3;
  const triangles = delaunay.triangles;
  const centroids = calculateCentroids(points, delaunay);

  const tElevation = assignTriangleElevation(
    centroids,
    numTriangles,
    aspectRatio,
    gridSize
  );

  const rElevation = assignRegionElevation(numRegions, triangles, tElevation);

  const map: GameMap = {
    points,
    numRegions,
    numTriangles,
    numEdges: delaunay.halfedges.length,
    halfedges: delaunay.halfedges,
    triangles,
    centers: centroids,
    tElevation,
    rElevation,
    moisture: assignMoisture(points, points.length, aspectRatio, gridSize),
    riverFlow: new Map(),
  };

  const riverFlow = generateRivers(map);
  map.riverFlow = riverFlow;

  return map;
}

///////////////////////////////////////////////////////////////////////////////////
////                                 DRAWING                                   ////
///////////////////////////////////////////////////////////////////////////////////

export function drawPoints(
  canvas: HTMLCanvasElement,
  points: Point[],
  gridSize = GRID_SIZE
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = calculateGridDimensions(canvas, gridSize);

  ctx.save();
  ctx.scale(canvas.width / width, canvas.height / height);
  ctx.fillStyle = "hsl(0, 50%, 50%)";
  for (const { x, y } of points) {
    ctx.beginPath();
    ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore();
}

export function drawCellBoundaries(
  canvas: HTMLCanvasElement,
  map: GameMap,
  gridSize = GRID_SIZE
) {
  const { centers, halfedges, numEdges } = map;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = calculateGridDimensions(canvas, gridSize);

  ctx.save();
  ctx.scale(canvas.width / width, canvas.height / height);

  ctx.lineWidth = 0.02;
  ctx.strokeStyle = "black";

  for (let e = 0; e < numEdges; e++) {
    if (e < halfedges[e]) {
      const p = centers[triangleOfEdge(e)];
      const q = centers[triangleOfEdge(halfedges[e])];

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawCellColors(
  canvas: HTMLCanvasElement,
  map: GameMap,
  colorFn: (r: number) => string = (r) => biomeColor(map, r),
  gridSize = GRID_SIZE
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = calculateGridDimensions(canvas, gridSize);

  ctx.save();
  ctx.scale(canvas.width / width, canvas.height / height);

  const seen = new Set();
  const { triangles, numEdges, halfedges, centers } = map;

  for (let e = 0; e < numEdges; e++) {
    const r = triangles[nextHalfedge(e)];
    if (!seen.has(r)) {
      seen.add(r);
      const vertices = edgesAroundPoint(halfedges, e).map(
        (e) => centers[triangleOfEdge(e)]
      );

      const color = colorFn(r);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.05;

      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawRivers(
  canvas: HTMLCanvasElement,
  map: GameMap,
  gridSize = GRID_SIZE
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = calculateGridDimensions(canvas, gridSize);

  ctx.save();
  ctx.scale(canvas.width / width, canvas.height / height);

  ctx.strokeStyle = "rgb(46, 62, 123)";
  ctx.lineCap = "round";

  for (const [e, flow] of map.riverFlow.entries()) {
    if (e < map.halfedges[e]) {
      ctx.lineWidth = Math.sqrt(flow) * 0.05;

      const p = map.centers[triangleOfEdge(e)];
      const q = map.centers[triangleOfEdge(map.halfedges[e])];

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

///////////////////////////////////////////////////////////////////////////////////
////                               DRAWING UTIL                                ////
///////////////////////////////////////////////////////////////////////////////////

function calculateGridDimensions(
  canvas: HTMLCanvasElement,
  gridSize = GRID_SIZE
) {
  const aspectRatio = canvas.width / canvas.height;
  const width = Math.floor(gridSize * aspectRatio);
  const height = gridSize;

  return { width, height };
}

///////////////////////////////////////////////////////////////////////////////////
////                                 TYPES                                     ////
///////////////////////////////////////////////////////////////////////////////////

type Point = {
  x: number;
  y: number;
};

type GameMap = {
  points: Point[];
  numRegions: number;
  numTriangles: number;
  numEdges: number;
  halfedges: Int32Array<ArrayBufferLike>;
  triangles: Uint32Array<ArrayBufferLike>;
  centers: Point[];
  tElevation: number[];
  rElevation: number[];
  moisture: number[];
  riverFlow: Map<number, number>;
};
