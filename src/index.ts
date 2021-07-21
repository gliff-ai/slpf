interface XYPoint {
  x: number;
  y: number;
}

interface Edge {
  point1: XYPoint;
  point2: XYPoint;
}

function bindSetPixelWhite(data: Uint8ClampedArray, width: number) {
  return (x: number, y: number): void => {
    /* eslint-disable no-param-reassign */
    data[(width * y + x) * 4] = 255;
    data[(width * y + x) * 4 + 1] = 255;
    data[(width * y + x) * 4 + 2] = 255;
    data[(width * y + x) * 4 + 3] = 255;
    /* eslint-enable no-param-reassign */
  };
}

function lerp(yScan: number, edge: Edge) {
  // finds x-value from scanline intersecting edge
  // linear interpolation
  const { point1, point2 } = edge;
  return Math.floor(
    ((yScan - point1.y) / (point2.y - point1.y)) * (point2.x - point1.x) +
      point1.x
  );
}

function getYMin(edge: Edge) {
  // returns minimum y-value of two points
  const { point1, point2 } = edge;
  return point1.y <= point2.y ? point1.y : point2.y;
}

function getYMax(edge: Edge) {
  // returns maximum y-value of two points
  const { point1, point2 } = edge;
  return point1.y > point2.y ? point1.y : point2.y;
}

function getXofYMin(edge: Edge) {
  // returns the x-value of the point with the minimum y-value
  const { point1, point2 } = edge;
  return point1.y <= point2.y ? point1.x : point2.x;
}

function getXofYMax(edge: Edge) {
  // returns the x-value of the point with the maximum y-value
  const { point1, point2 } = edge;
  return point1.y > point2.y ? point1.x : point2.x;
}

function pointsToEdges(points: XYPoint[]) {
  // converts list of points to list of non-horizontal edges
  const edges: Edge[] = [];
  let point1 = points[points.length - 1];
  for (let i = 0; i < points.length; i++) {
    const point2 = points[i];
    // ignore horizontal edges
    if (point1.x !== point2.x) {
      edges.push({ point1, point2 });
    }
    point1 = point2;
  }
  return edges;
}

function moveEdges(yScan: number, ET: Edge[], AET: Edge[]) {
  // move active edges from ET to AET
  while (ET.length > 0 && yScan === getYMin(ET[ET.length - 1])) {
    AET.push(ET.pop());
  }
}

function removeEdges(yScan: number, AET: Edge[]) {
  // remove inactive edges from AET
  for (let i = 0; i < AET.length; i++) {
    if (yScan >= getYMax(AET[i])) {
      const last = AET.pop();
      if (i < AET.length) {
        AET[i] = last;
        i--;
      }
    }
  }
}

function getSpans(yScan: number, AET: Edge[]) {
  // find spans along scanline
  const spans: XYPoint[] = [];
  for (const edge of AET) {
    spans.push({ x: lerp(yScan, edge), y: yScan });
  }
  return spans;
}

function collectSpan(edge: Edge, y: number): XYPoint[] {
  // collect pixels within a span
  const { point1, point2 } = edge;
  const fullspan: XYPoint[] = [];
  for (let { x } = point1; x < point2.x; x++) {
    fullspan.push({ x, y });
  }
  return fullspan;
}

function fillSpan(
  edge: Edge,
  y: number,
  setPixelAt: (x: number, y: number) => void
) {
  // fill pixels within a span
  const { point1, point2 } = edge;
  for (let { x } = point1; x < point2.x; x++) {
    setPixelAt(x, y);
  }
}

function gatherSpans(spans: XYPoint[], yScan: number): XYPoint[] {
  const gatheredSpans: XYPoint[][] = [];
  for (let i = 0; i < spans.length; i += 2) {
    const point1 = spans[i];
    const point2 = spans[i + 1];
    gatheredSpans.push(collectSpan({ point1, point2 }, yScan));
  }
  return gatheredSpans.reduce(
    (accumulator, value) => accumulator.concat(value),
    []
  );
}

function drawSpans(
  spans: XYPoint[],
  yScan: number,
  setPixelAt: (x: number, y: number) => void
) {
  for (let i = 0; i < spans.length; i += 2) {
    const point1 = spans[i];
    const point2 = spans[i + 1];
    fillSpan({ point1, point2 }, yScan, setPixelAt);
  }
}

function slpfPoints(points: XYPoint[]): XYPoint[] {
  // Scanline Polygon Fill and return all points inside the polygon
  if (points.length < 3) return []; // need three points to do a fill

  // initialize ET and AET
  const ET = pointsToEdges(points).sort((e1, e2) => getYMin(e2) - getYMin(e1));
  const AET: Edge[] = [];
  let yScan = getYMin(ET[ET.length - 1]);

  // repeat until both ET and AET are empty
  const gatheredSpans: XYPoint[][] = [];
  while (ET.length > 0 || AET.length > 0) {
    // manage AET
    moveEdges(yScan, ET, AET);
    removeEdges(yScan, AET);
    AET.sort((e1, e2) => {
      const cmp = getXofYMin(e1) - getXofYMin(e2);
      return cmp === 0 ? getXofYMax(e1) - getXofYMax(e2) : cmp;
    });
    // fill spans on scanline
    const spans = getSpans(yScan, AET);
    gatheredSpans.push(gatherSpans(spans, yScan));
    yScan++;
  }
  return gatheredSpans.reduce(
    (accumulator, value) => accumulator.concat(value),
    []
  );
}

function slpfFilledArray(
  points: XYPoint[],
  imageBitmap: ImageBitmap
): Uint8ClampedArray {
  // Scanline Polygon Fill and return a segmented img
  if (points.length < 3) return; // need three points to do a fill

  // get image data and bind set pixel at
  const { width, height } = imageBitmap;
  const img = new Uint8ClampedArray(width * height * 4);
  const setPixelAt = bindSetPixelWhite(img, width);

  // initialize ET and AET
  const ET = pointsToEdges(points).sort((e1, e2) => getYMin(e2) - getYMin(e1));
  const AET: Edge[] = [];
  let yScan = getYMin(ET[ET.length - 1]);

  // repeat until both ET and AET are empty
  while (ET.length > 0 || AET.length > 0) {
    // manage AET
    moveEdges(yScan, ET, AET);
    removeEdges(yScan, AET);
    AET.sort((e1, e2) => {
      const cmp = getXofYMin(e1) - getXofYMin(e2);
      return cmp === 0 ? getXofYMax(e1) - getXofYMax(e2) : cmp;
    });
    // fill spans on scanline
    const spans = getSpans(yScan, AET);
    drawSpans(spans, yScan, setPixelAt);
    yScan++;
  }
}

export { slpfPoints, slpfFilledArray };
