import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(VNetworkGraph)
app.use(pinia)
app.mount('#app')