<template>
  <div>
    <FormGraphs
      :selectedNodes="selectedNodes ? selectedNodes : []"
      :graphs="graphs"
      @addNodeInNetworkGraph="addNode"
      @addEdgeInNetworkGraph="addEdge"
    />
    <ContextMenu
      ref="context"
      :graphs="graphs"
      @changeNodeInNetworkGraph="changeNode"
      @changeEdgeInNetworkGraph="changeEdge"
      @removeNodeInNetworkGraph="removeNode"
      @removeEdgeInNetworkGraph="removeEdge"
    />
    <v-network-graph
      class="graph"
      v-model:selected-nodes="selectedNodes"
      v-model:selected-edges="selectedEdges"
      :nodes="graphs.nodes"
      :edges="graphs.edges"
      :layouts="graphs.layouts"
      :configs="configs"
      :event-handlers="eventHandlers"
    >
      <defs>
        <!-- Cannot use <style> directly due to restrictions of Vue. -->
        <component is="style">
          @font-face { font-family: 'Material Icons'; font-style: normal;
          font-weight: 400; src:
          url(https://fonts.gstatic.com/s/materialicons/v97/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2)
          format('woff2'); }
        </component>
      </defs>
      <template #override-node="{ nodeId, scale, config, ...slotProps }">
        <circle
          :r="config.radius * scale"
          :fill="config.color"
          v-bind="slotProps"
        />
        <!-- Use v-html to interpret escape sequences for icon characters. -->
        <text
          font-family="Material Icons"
          :font-size="18 * scale"
          fill="#ffffff"
          text-anchor="middle"
          dominant-baseline="central"
          style="pointer-events: none"
          v-html="nodes[nodeId].icon"
        />
      </template>
      <template #edge-label="{ edge, ...slotProps }">
        <v-edge-label
          :text="edge.label"
          align="center"
          vertical-align="above"
          v-bind="slotProps"
        />
      </template>
    </v-network-graph>
    <InfoBlock
      header="Информация"
      :paragraph="[
        'Чтобы выбрать несколько узлов, нажмите Shift+клик или удерживайте выбранный узел и коснитесь другого узла.',
        'Чтобы сделать связь между узлами, выберете несколько узлов и нажмите Связь: добавить',
        'Чтобы изменить узел, нажмите ПКМ или удерживайте выбранный узел',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import FormGraphs from "./FormGraphs.vue";
import InfoBlock from "./InfoBlock.vue";
import ContextMenu from "./ContextMenu.vue";
import { ref, reactive, watch } from "vue";
import * as vNG from "v-network-graph";
import { useGraphs } from "../stores/graphs.ts";
import { GrafsStore } from "../stores/interface.ts";

// Проверяем состояние в localStorage если есть то записываем его в state

let graphs: GrafsStore = useGraphs();
const graphsInLocalStorage = localStorage.getItem("graphs");
if (graphsInLocalStorage) {
  graphs.setGraphs(
    JSON.parse(graphsInLocalStorage).nodes,
    JSON.parse(graphsInLocalStorage).edges,
    JSON.parse(graphsInLocalStorage).layouts
  );
}

// Контекстное меню

function changeNode(data: object | any) {
  graphs.setNodes(data.node, { name: data.name, icon: data.icon });
}
function changeEdge(data: object | any) {
  graphs.setEdge(data.edge, data.edgeContext);
}

// Вызываем функции открывания контекста в дочернем элементе
const context = ref();

function showNodeContextMenu(params: vNG.NodeEvent<MouseEvent>) {
  if (context.value) {
    context.value.error = <boolean>false;
    context.value.showNodeContextMenu(params);
  }
}

function showEdgeContextMenu(params: vNG.EdgeEvent<MouseEvent>) {
  context.value.error = false;
  context.value.showEdgeContextMenu(params);
}
const eventHandlers: vNG.EventHandlers = {
  "node:contextmenu": showNodeContextMenu,
  "edge:contextmenu": showEdgeContextMenu,
};

// Делаем графы выбераемыми
const configs = reactive(vNG.getFullConfigs());
configs.node.selectable = true;
configs.node.label.visible = true;
configs.edge.selectable = true;

const selectedNodes = ref<string[]>([]);
const selectedEdges = ref<string[]>([]);

const limit = ref(-1);
watch(limit, (v) => {
  selectedNodes.value = []; // reset
  switch (v) {
    case 0: // disabled
      configs.node.selectable = false;
      break;
    case 1: // limit
    case 2:
      configs.node.selectable = v;
      break;
    case -1: // unlimited
    default:
      configs.node.selectable = true;
      break;
  }
  selectedEdges.value = []; // reset
  switch (v) {
    case 0: // disabled
      configs.edge.selectable = false;
      break;
    case 1: // limit
    case 2:
      configs.edge.selectable = v;
      break;
    case -1: // unlimited
    default:
      configs.edge.selectable = true;
      break;
  }
});

// Функционал с графами добавление/удаление
interface node {
  name: string;
  device: string;
}
interface edge {
  source: string;
  target: string;
  label: string;
}
const nodes = reactive(graphs.nodes);
const edges = reactive(graphs.edges);
const nextNodeIndex = ref(Object.keys(nodes).length + 1);
const nextEdgeIndex = ref(Object.keys(edges).length + 1);

function addNode(node: node) {
  const nodeId = `node${nextNodeIndex.value}`;
  graphs.addNodes(nodeId, node.name, node.device);
  nextNodeIndex.value++;
}
function removeNode(node: string) {
  graphs.delNodes(node);
}
function addEdge(addEdgeLabel: string) {
  if (selectedNodes.value.length !== 2) return;
  const [source, target] = selectedNodes.value;
  const edgeId = `edge${nextEdgeIndex.value}`;
  graphs.addEdges(edgeId, source, target, addEdgeLabel);
  nextEdgeIndex.value++;
}
function removeEdge(edge: string) {
  graphs.delEdge(edge);
}

// Отслеживаем изменение state и сохраняем его в localStorage
watch(
  () => graphs,
  () => {
    localStorage.setItem("graphs", JSON.stringify(graphs));
  },
  { deep: true }
);
</script>

<style scoped lang="scss" scope>
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
  border-radius: 5px;
}
</style>
