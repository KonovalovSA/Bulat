export interface Grafs {
  nodes: {
    [key: string]: nodes
  },
  edges: {
    [key: string]: edges
  },
  layouts: {
    nodes: {
      [key: string]: layouts
    }
  },
  setGraphs: any,
  setNodes: any,
  setEdge: any,
  addNodes: any,
  addEdges: any,
  delNodes: any,
  delEdge: any
}
interface nodes {
  name: string,
  icon: string
}
interface edges {
  source: string,
  target: string,
  label: string
}
interface layouts {
  x: number
  y: number
}