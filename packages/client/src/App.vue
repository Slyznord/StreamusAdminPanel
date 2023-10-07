<template>
  <router-view />
  <modals-container></modals-container>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup () {
    onMounted(() => {
      const store = useStore()
      const token = localStorage.getItem('werialToken')

      if (token) {
        store.commit('Auth/setToken', JSON.parse(token))
      }
    })
  }
}
</script>
