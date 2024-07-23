import { defineStore } from "pinia";
export type  Grafs = {
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

export const useGraphs = defineStore("graphs", {
    state: () => ({
        nodes: {
            node1: { name: "Node 1", icon: "&#xe320" },
            node2: { name: "Node 2", icon: "&#xe328" },
            node3: { name: "Node 3", icon: "&#xe331" },
            node4: { name: "Node 4", icon: "&#xe331" },
        },
        edges: {
            edge1: { source: "node1", target: "node2", label: "1 Gbps" },
            edge2: { source: "node2", target: "node3", label: "500 Mbps" },
            edge3: { source: "node3", target: "node4", label: "100 Mbps" },
        },
        layouts: {
            nodes: {
              node1: { x: 0, y: 0 },
              node2: { x: 50, y: 50 },
              node3: { x: 100, y: 0 },
              node4: { x: 150, y: 50 },
            },
        }
    } as Grafs),
    actions: {
        setGraphs(nodes: any, edges: any, layouts: any) {
            this.nodes = nodes
            this.edges = edges
            this.layouts = layouts
        },
        setNodes(node:string, obj:object) {
            Object.assign(this.nodes[node], obj)
            console.log(this.nodes[node])
        },
        setEdge(edge:string, label:string) {
            this.edges[edge].label = label
        },
        addNodes(id:string, name:string, icon:string) {
            this.nodes[id] = {name, icon}
            this.layouts.nodes[id] = { x: 0, y: 0 }
        },
        delNodes(id:string) {
            for(let key in this.edges) {
                if(Object.values(this.edges[key]).find(item => item === id)) {
                    delete this.edges[key]
                }
            }
            delete this.nodes[id]
        },
        addEdges(id:string, source:string, target:string, label:string) {
            this.edges[id] = { source, target, label}
        },
        delEdge(id:string) {
            delete this.edges[id]
        }
    }
})