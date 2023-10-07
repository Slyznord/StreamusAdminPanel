<template>
  <div class="auth">
    <Login />
  </div>
</template>

<script>
import Login from '@/modules/Login.vue'

export default {
  name: 'Auth',
  components: {
    Login
  }
}
</script>
