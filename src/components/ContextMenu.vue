<template>
    <div>
        <div ref="nodeMenu" class="context-menu">
            <b>Название</b>
            <div class="input-group">
                <input type="text" v-model="nameGraph" class="form-control" :placeholder="props.graphs.nodes[menuTargetNode] ? props.graphs.nodes[menuTargetNode].name : ''" aria-describedby="button-addon2">
                <button class="btn btn-outline-secondary" :disabled="!device" @click="changeNode(menuTargetNode)" type="button" id="button-addon2">Ok</button>
            </div>
            <p v-if="error">Введите уникальное называние</p>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span v-if="device">{{ deviceName }}</span>
                <span v-else>Устройство</span>
                </button>
                <ul class="dropdown-menu">
                <li><button class="dropdown-item" @click="device = '&#xe331', deviceName = 'Планшет'" :class="{active: device == '&#xe331'}" type="button">Планшет</button></li>
                <li><button class="dropdown-item" @click="device = '&#xe320', deviceName = 'Ноутбук'" :class="{active: device == '&#xe320'}" type="button">Ноутбук</button></li>
                <li><button class="dropdown-item" @click="device = '&#xe328', deviceName = 'Роутер'" :class="{active: device == '&#xe328'}" type="button">Роутер</button></li>
                </ul>
            </div>
            <a href="#" class="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" @click="removeNode(menuTargetNode)">Удалить</a>
        </div>
        <div ref="edgeMenu" class="context-menu">
            <b>Связь</b>
            <div v-if="menuTargetEdges && props.graphs.edges[menuTargetEdges]">Из <b>{{ props.graphs.edges[menuTargetEdges].source }}</b> в <b>{{ props.graphs.edges[menuTargetEdges].target}}</b></div>
            <div class="btn-group" role="group">
                <button class="btn btn-secondary dropdown-toggle" style="border-radius: 10px 0 0 10px;" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span v-if="addEdgeLabel">{{ addEdgeLabel }}</span>
                <span v-else>Скорость</span>
                </button>
                <ul class="dropdown-menu">
                <li><button class="dropdown-item" @click="addEdgeLabel = '1 Gbps'" :class="{active: addEdgeLabel == '1 Gbps'}" type="button">1 Gbps</button></li>
                <li><button class="dropdown-item" @click="addEdgeLabel = '500 Mbps'" :class="{active: addEdgeLabel == '500 Mbps'}" type="button">500 Mbps</button></li>
                <li><button class="dropdown-item" @click="addEdgeLabel = '100 Mbps'" :class="{active: addEdgeLabel == '100 Mbps'}" type="button">100 Mbps</button></li>
                </ul>
                <button class="btn btn-outline-secondary" :disabled="!addEdgeLabel" @click="menuTargetEdges ? changeEdge(menuTargetEdges) : ''" type="button" id="button-addon2">Ok</button>
            </div>
            <a href="#" class="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" @click="menuTargetEdges ? removeEdge(menuTargetEdges) : ''">Удалить</a>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import * as vNG from "v-network-graph"

    const props = defineProps({
        graphs: { type: Object, required: true },
    })

    const nameGraph = ref<string>()
    const device = ref<string>()
    const deviceName = ref<string>()
    const addEdgeLabel = ref<string>()
    const error = ref<boolean>()

    function showContextMenu(element: HTMLElement, event: MouseEvent) {
        element.style.left = event.x + "px"
        element.style.top = event.y + "px"
        element.style.visibility = "visible"
        const handler = (event: PointerEvent) => {
        if (!event.target || !element.contains(event.target as HTMLElement)) {
            element.style.visibility = "hidden"
            document.removeEventListener("pointerdown", handler, { capture: true })
        }
        }
        document.addEventListener("pointerdown", handler, { passive: true, capture: true })
    }

    const nodeMenu = ref<HTMLDivElement>()
    const menuTargetNode = ref("")
    function showNodeContextMenu(params: vNG.NodeEvent<MouseEvent>) {
        const { node, event } = params
        event.stopPropagation()
        event.preventDefault()
        if (nodeMenu.value) {
            menuTargetNode.value = node
            showContextMenu(nodeMenu.value, event)
        }
    }

    const edgeMenu = ref<HTMLDivElement>()
    const menuTargetEdges = ref<string>()
    function showEdgeContextMenu(params: vNG.EdgeEvent<MouseEvent>) {
        const { event } = params
        event.stopPropagation()
        event.preventDefault()
        if (edgeMenu.value) {
            menuTargetEdges.value = params.edge
            showContextMenu(edgeMenu.value, event)
        }
    }

    defineExpose({
        showNodeContextMenu,
        showEdgeContextMenu,
        error
    })

    const emit = defineEmits([
        'changeNodeInNetworkGraph', 
        'changeEdgeInNetworkGraph', 
        'removeNodeInNetworkGraph',
        'removeEdgeInNetworkGraph'
    ])


    function changeNode(node: string) {
        for(let graph in props.graphs.nodes) {
            if(nameGraph.value === props.graphs.nodes[graph].name) {
                error.value = true
            }
        }
        if(!error.value) {
            emit('changeNodeInNetworkGraph',  {node, name: nameGraph.value, icon: device.value})
            nodeMenu.value ? nodeMenu.value.style.visibility = "hidden" : ''
        }
    }

    function changeEdge(edge: string) {
        emit('changeEdgeInNetworkGraph', {edge, edgeContext: addEdgeLabel.value})
        edgeMenu.value ? edgeMenu.value.style.visibility = "hidden" : ''
    }

    function removeNode(node: string) {
        emit('removeNodeInNetworkGraph', node)
        nodeMenu.value ? nodeMenu.value.style.visibility = "hidden" : ''
    }

    function removeEdge(edge: string) {
        emit('removeEdgeInNetworkGraph', edge)
        edgeMenu.value ? edgeMenu.value.style.visibility = "hidden" : ''
    }
    
</script>

<style lang="scss" scope>
    .control-panel {
        margin: 20px 0;
        padding: 20px;
        width: 800px;
        border: 1px solid #4065d0;
        border-radius: 5px;
        color: rgba(60, 60, 67, 0.7803921569);
        background-color: #fbfcff;
    }
    .context-menu {
        width: 220px;
        background-color: #efefef;
        padding: 10px;
        position: fixed;
        visibility: hidden;
        font-size: 12px;
        border: 1px solid #aaa;
        box-shadow: 2px 2px 2px #aaa;
        z-index: 1;
        > div {
            padding: 4px;
        }
    }
</style>