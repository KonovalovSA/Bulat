type StringMap<T> = {
  [key: string]: T
}
export type GrafsStore = StoreState & StoreActions
export interface StoreState {
  nodes: StringMap<Node>;
  edges: StringMap<Edge>;
  layouts: {
    nodes: StringMap<Layout>
  };
}

export interface StoreActions {
  setGraphs: (nodes: StringMap<Node>, edges: StringMap<Edge>, layouts: {nodes: StringMap<Layout>}) => void 
  setNodes: (nodeName: string, node: Node) => void
  setEdge: (edge: string, label: string) => void
  addNodes: (id: string, name: string, icon: string) => void
  addEdges: (id: string, source: string, target: string, label: string) => void
  delNodes: (id:string) => void
  delEdge: (id:string) => void
}

export interface Node {
  name: string,
  icon: string
}
export interface Edge {
  source: string,
  target: string,
  label: string
}
export interface Layout {
  x: number
  y: number
}