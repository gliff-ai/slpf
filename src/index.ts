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
  if (point1.y === yScan) {
    return point1.x;
  }
  if (point2.y === yScan) {
    return point2.x;
  }
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
  let point1 = points[points.length - 1]; // ensures that we get a closed loop of edges
  for (let i = 0; i < points.length; i += 1) {
    const point2 = points[i];
    // ignore horizontal edges
    if (point1.x !== point2.x) { // !!! surely this excludes vertical, not horizontal edges?
      edges.push({ point1, point2 });
    }
    point1 = point2;
  }
  return edges;
}

function moveEdges(yScan: number, edges: Edge[], activeEdges: Edge[]) {
  // move active edges from edges to activeEdges
  // an active edge is one where either point is at yScan>=y
  while (edges.length > 0 && yScan >= getYMin(edges[edges.length - 1])) { // !!! this assumes all the "active" edges are at the end of edges, otherwise it will miss some
    activeEdges.push(edges.pop());
  }
}

function removeEdges(yScan: number, activeEdges: Edge[]) {
  // remove inactive edges from activeEdges
  for (let i = 0; i < activeEdges.length; i += 1) {
    if (yScan > getYMax(activeEdges[i])) {
      // either one edge edge is on this scane line
      // or the entire edge is below yScan
      // remove offending edge and shrink array
      
      if (i < activeEdges.length) {
        activeEdges.splice(i, 1);
        i -= 1;
      }
    }
  }
}

function getSpans(yScan: number, activeEdges: Edge[]) {
  // find spans of 'inside polygon' along scanline
  const spans: XYPoint[] = [];
  for (const edge of activeEdges) {
    // !!! this looks like it's meant to get all the edge intersections along the scanline, but "active" edges don't necessarily intersect the scanline according to the definition above
    spans.push({ x: lerp(yScan, edge), y: yScan });
  }
  return spans;
}

function slpfLines(points: XYPoint[]): XYPoint[][] {
  // Scanline Polygon Fill and return all points inside the polygon
  if (points.length < 3) return []; // need three points to do a fill

  // initialize edges and activeEdges
  const edges = pointsToEdges(points).sort(
    (e1, e2) => getYMin(e2) - getYMin(e1)
  );
  const activeEdges: Edge[] = [];
  let yScan = Math.floor(getYMinAll(edges));

  // repeat until both edges and activeEdges are empty
  const horizontalLines: XYPoint[][] = [];
  let i = 0;
  while (edges.length > 0 || activeEdges.length > 0) {
    // manage activeEdges
    moveEdges(yScan, edges, activeEdges);
    removeEdges(yScan, activeEdges);
    if (activeEdges.length === 0) {
      // I think this should only occur due to Math.floor above
      yScan += 1;
    } else if (activeEdges.length % 2 === 0) {
      // if we have an even number of edges, get the spans
      // sort edges by X separation
      activeEdges.sort((e1, e2) => {
        const cmp = getXofYMin(e1) - getXofYMin(e2);
        return cmp === 0 ? getXofYMax(e1) - getXofYMax(e2) : cmp;
      });
      // fill spans on scanline
      const spans = getSpans(yScan, activeEdges);
      horizontalLines.push(spans);
      yScan += 1;
    } else {
      yScan += 1;
    }
    i += 1;
    if (i > 4096) break; // TODO set a more clever time out
  }
  return horizontalLines;
}

export { slpfLines };
