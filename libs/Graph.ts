export class Vertex<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getEdges(graph: Graph<T>) {
    return graph.getEdgesOfVertex(this);
  }

  getNeighbors(graph: Graph<T>) {
    return graph.getConnectedVertices(this);
  }
}

export class Edge<T> {
  a: Vertex<T>;
  b: Vertex<T>;
  weight: number;

  constructor(a: Vertex<T>, b: Vertex<T>, weight: number) {
    this.a = a;
    this.b = b;
    this.weight = weight;
  }

  getOther(vertex: Vertex<T>) {
    if (vertex === this.a) return this.b;
    if (vertex === this.b) return this.a;
    throw new Error("The vertex is not an end on this edge");
  }

  format() {
    return `{ ${this.a.value}, ${this.b.value} }`;
  }
}

export class Graph<T> {
  private _vertices: Vertex<T>[];
  private _edges: Edge<T>[];

  constructor(vertices?: Vertex<T>[], edges?: Edge<T>[]) {
    this._edges = edges ?? [];
    this._vertices = vertices ?? [];
    this.getConnectedVertices = this.getConnectedVertices.bind(this);
  }

  findEdge(a: Vertex<T>, b: Vertex<T>) {
    return this._edges.find(
      (e) => (e.a === a && e.b === b) || (e.a === b && e.b === a)
    );
  }

  removeEdge(edge: Edge<T>) {
    const index = this._edges.indexOf(edge);
    this._edges.splice(index, 1);
  }

  removeVertex(vertex: Vertex<T>) {
    vertex.getEdges(this).forEach((edge) => this.removeEdge(edge));
    const index = this._vertices.indexOf(vertex);
    this._vertices.splice(index, 1);
  }

  addVertex(value: T) {
    const vertex: Vertex<T> = new Vertex(value);
    this._vertices.push(vertex);
    return vertex;
  }

  addEdge(a: Vertex<T>, b: Vertex<T>, weight: number = 1) {
    if (a === b) return;
    const edge = this.findEdge(a, b);
    if (edge) {
      return edge;
    }
    const newEdge = new Edge(a, b, weight);
    this._edges.push(newEdge);
    return newEdge;
  }

  getEdgesOfVertex(vertex: Vertex<T>): Edge<T>[] {
    return this._edges.filter((edge) => edge.a === vertex || edge.b === vertex);
  }

  getConnectedVertices(vertex: Vertex<T>): Vertex<T>[] {
    return this._edges
      .map((edge) => {
        if (edge.a === vertex) {
          return edge.b;
        }
        if (edge.b === vertex) {
          return edge.a;
        }
        return null;
      })
      .filter((vertex) => !!vertex) as Vertex<T>[];
  }

  getAdjacencyList() {
    const outMap = new Map<Vertex<T>, Set<Vertex<T>>>();
    this._vertices.forEach((v) => {
      outMap.set(v, new Set(v.getNeighbors(this)));
    });
    return outMap;
  }

  getAdjacencyMatrix() {
    return this._vertices.map((input) => {
      return this._vertices.map((out) => {
        const isRelated = !!this.findEdge(input, out);
        return isRelated ? "1" : "0";
      });
    });
  }

  getVertices() {
    return [...this._vertices];
  }

  private raise(graph?: Graph<T>): Graph<T> {
    const g = graph ?? this;
    if (g._edges.length === 0) return new Graph();

    const newGraph = new Graph<T>(this._vertices);

    g._vertices.forEach((vertex) => {
      vertex.getNeighbors(this).forEach((n1) => {
        n1.getNeighbors(g).forEach((n2) => {
          newGraph.addEdge(vertex, n2);
        });
      });
    });

    return newGraph;
  }

  raiseTo(power: number) {
    const maps: Graph<T>[] = [this];

    for (let i = 1; i < power; i++) {
      maps.push(this.raise(maps[i - 1]));
    }

    maps[power - 1];

    return maps[power - 1];
  }

  getTransitiveClosure(): Graph<T> {
    const maps: Graph<T>[] = [this];

    for (let i = 1; i < this._vertices.length; i++) {
      maps.push(this.raise(maps[i - 1]));
    }

    return maps.reduce((prev, curr) => prev.union(curr), new Graph());
  }

  union(graph: Graph<T>) {
    return new Graph(
      [...new Set([...this._vertices, ...graph._vertices])],
      [...this._edges, ...graph._edges.filter((e) => !this.findEdge(e.a, e.b))]
    );
  }

  getDepthFirstTree(root: Vertex<T>) {
    const out: Vertex<T>[] = [];
    const addNeighborsOfVertex = (v: Vertex<T>) => {
      if (out.indexOf(v) < 0) {
        out.push(v);
        v.getNeighbors(this).forEach(addNeighborsOfVertex);
      }
    };
    addNeighborsOfVertex(root);

    return out;
  }

  getBreadthFirst(root: Vertex<T>) {
    const toProcess = [root];
    const out: Vertex<T>[] = [];
    //Add v1 to the back of the list.

    while (toProcess.length > 0) {
      const curr = toProcess.shift();
      if (curr) {
        toProcess.push(
          ...curr
            .getNeighbors(this)
            .filter((n) => [...out, ...toProcess].indexOf(n) < 0)
        );
        out.push(curr);
      }
    }

    return out;
  }

  // TODO: Implement in union and raise
  getWeight() {
    return getEdgesWeight(this._edges);
  }

  getCheapestOrder(root: Vertex<T>) {
    let toProcess = [
      ...root.getEdges(this).map((e) => ({ root: root, edge: e })),
    ];
    const vertOut: Vertex<T>[] = [root];
    const edgeOut: Edge<T>[] = [];

    while (toProcess.length > 0) {
      toProcess = toProcess
        .filter(
          (p) =>
            toProcess.findIndex(
              (p2) => p.edge === p2.edge && p.root !== p2.root
            ) < 0 && vertOut.findIndex((v) => v === p.edge.getOther(p.root)) < 0
        )
        .sort((a, b) => a.edge.weight - b.edge.weight);

      const curr = toProcess.shift();

      if (curr) {
        edgeOut.push(curr.edge);
        const traveledTo = curr.edge.getOther(curr.root);
        vertOut.push(traveledTo);
        const newEdges = traveledTo
          .getEdges(this)
          .map((e) => ({ root: traveledTo, edge: e }));

        toProcess.push(...newEdges);
      }
    }

    return {
      edgePath: edgeOut,
      vertexPath: vertOut,
    };
  }
}

function getEdgesWeight<T>(edges: Edge<T>[]) {
  return edges.reduce((prev, curr) => (prev += curr.weight), 0);
}
