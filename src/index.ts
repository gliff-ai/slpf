interface XYPoint {
  x: number;
  y: number;
}

interface Edge {
  point1: XYPoint;
  point2: XYPoint;
}

function lerp(yScan: number, edge: Edge) {
  // finds x-value from scanline intersecting edge
  // linear interpolation
  const { point1, point2 } = edge;
  return (
    ((yScan - point1.y) / (point2.y - point1.y)) * (point2.x - point1.x) +
    point1.x
  );
}

function getYMinAll(edges: Edge[]) {
  // returns minimum y-value of two points
  let yMin = edges[0].point1.y;
  for (let i = 0; i < edges.length; i += 1) {
    const { point1, point2 } = edges[i];
    const localYMin = point1.y <= point2.y ? point1.y : point2.y;
    yMin = localYMin <= yMin ? localYMin : yMin;
  }
  return yMin;
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
  for (let i = 0; i < points.length; i += 1) {
    const point2 = points[i];
    // ignore horizontal edges
    if (point1.x !== point2.x) {
      edges.push({ point1, point2 });
    }
    point1 = point2;
  }
  return edges;
}

function moveEdges(yScan: number, edges: Edge[], activeEdges: Edge[]) {
  // move active edges from edges to activeEdges
  // an active edge is one where either point is at y>=yScan
  while (edges.length > 0 && yScan >= getYMin(edges[edges.length - 1])) {
    activeEdges.push(edges.pop());
  }
}

function removeEdges(yScan: number, activeEdges: Edge[]) {
  // remove inactive edges from activeEdges
  for (let i = 0; i < activeEdges.length; i += 1) {
    if (yScan >= getYMax(activeEdges[i])) {
      // either point in the edge is horizontal with or entirely below yScan
      // remove offending edge and shrink array
      const last = activeEdges.pop();
      if (i < activeEdges.length && last) {
        // eslint-disable-next-line no-param-reassign
        activeEdges[i] = last;
        i -= 1;
      }
    }
  }
}

function getSpans(yScan: number, activeEdges: Edge[]) {
  // find spans of 'inside polygon' along scanline
  const spans: XYPoint[] = [];
  for (const edge of activeEdges) {
    spans.push({ x: lerp(yScan, edge), y: yScan });
  }
  return spans;
}

function collectSpan(edge: Edge, y: number): XYPoint[] {
  // get a list of all pixels between the points of all spans
  const { point1, point2 } = edge;
  const fullspan: XYPoint[] = [];
  for (let { x } = point1; x < point2.x; x += 1) {
    fullspan.push({ x, y });
  }
  return fullspan;
}

function gatherSpans(spans: XYPoint[], yScan: number): XYPoint[] {
  // for a list of spans, gather all the pixels within those spans together
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

function slpfPoints(points: XYPoint[]): XYPoint[] {
  // Scanline Polygon Fill and return all points inside the polygon
  if (points.length < 3) return []; // need three points to do a fill

  // initialize edges and activeEdges
  const edges = pointsToEdges(points).sort(
    (e1, e2) => getYMin(e2) - getYMin(e1)
  );
  const activeEdges: Edge[] = [];
  let yScan = getYMinAll(edges);

  // repeat until both edges and activeEdges are empty
  const gatheredSpans: XYPoint[][] = [];
  let i = 0;
  while (edges.length > 0 || activeEdges.length > 0) {
    // manage activeEdges
    moveEdges(yScan, edges, activeEdges);
    removeEdges(yScan, activeEdges);
    if (activeEdges.length >= 2) {
      // sort edges by X separation
      activeEdges.sort((e1, e2) => {
        const cmp = getXofYMin(e1) - getXofYMin(e2);
        return cmp === 0 ? getXofYMax(e1) - getXofYMax(e2) : cmp;
      });
      // fill spans on scanline
      const spans = getSpans(yScan, activeEdges);
      gatheredSpans.push(gatherSpans(spans, yScan));
      yScan += 1;
    }
    i += 1;
    if (i > 1000) break;
  }
  return gatheredSpans.reduce(
    (accumulator, value) => accumulator.concat(value),
    []
  );
}

export { slpfPoints };
