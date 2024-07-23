<template>
    <div class="control-panel">
      <div class="input-group mb-3">
        <button type="button" class="btn btn-outline-secondary" @click="addNode">Добавить узел</button>
        <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
          <span v-if="device" class="me-3">{{ addDeviceName }}</span>
          <span v-else class="me-3">Устройство</span>
        </button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" @click="device = '&#xe331', addDeviceName = 'Планшет'" :class="{active: device == '&#xe331'}" type="button">Планшет</button></li>
          <li><button class="dropdown-item" @click="device = '&#xe320', addDeviceName = 'Ноутбук'" :class="{active: device == '&#xe320'}" type="button">Ноутбук</button></li>
          <li><button class="dropdown-item" @click="device = '&#xe328', addDeviceName = 'Роутер'" :class="{active: device == '&#xe328'}" type="button">Роутер</button></li>
        </ul>
        <input type="text" class="form-control" v-model="nameGraph" placeholder="Введите название устройства">
      </div>
      <p v-if="error">Введите уникальное называние</p>
      <div class="input-group mb-3">
        <button class="btn btn-outline-secondary" :disabled="props.selectedNodes.length != 2" @click="addEdge">Добавить связь</button>
        <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" :disabled="props.selectedNodes.length != 2" data-bs-toggle="dropdown" aria-expanded="false">
          <span v-if="addEdgeLabel" class="me-3">{{ addEdgeLabel }}</span>
          <span v-else class="me-3">Скорость</span>
        </button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" @click="addEdgeLabel = '1 Gbps'" :class="{active: addEdgeLabel == '1 Gbps'}" type="button">1 Gbps</button></li>
          <li><button class="dropdown-item" @click="addEdgeLabel = '500 Mbps'" :class="{active: addEdgeLabel == '500 Mbps'}" type="button">500 Mbps</button></li>
          <li><button class="dropdown-item" @click="addEdgeLabel = '100 Mbps'" :class="{active: addEdgeLabel == '100 Mbps'}" type="button">100 Mbps</button></li>
        </ul>
        <div class="input-group-text" id="btnGroupAddon">Сначала выберете два узла</div>
      </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps({
        selectedNodes: { type: Array, required: true },
        graphs: { type: Object, required: true },
    })
    const nameGraph = ref<string>()
    const addDeviceName = ref<string>()
    const device = ref<string>()
    const addEdgeLabel = ref<string>()
    const error = ref<boolean>()
    
    const emit = defineEmits(['addNodeInNetworkGraph', 'addEdgeInNetworkGraph'])

    function addNode() {
      error.value = false
      for(let graph in props.graphs.nodes) {
        if(nameGraph.value === props.graphs.nodes[graph].name) {
            error.value = true
        }
      }
      if(!error.value) {
        emit('addNodeInNetworkGraph', {name: nameGraph.value, device: device.value})
      } 
    }
    function addEdge() {
        emit('addEdgeInNetworkGraph', addEdgeLabel)
    }
</script>

<style lang="scss" scope>
.form-control:focus {
  border: 1px solid #6c757d;
  box-shadow: none !important;
}
</style>