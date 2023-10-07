import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { vfmPlugin } from 'vue-final-modal'

import '@/styles/main.scss'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vfmPlugin)

app.mount('#app')
