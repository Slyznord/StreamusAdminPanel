<template>
  <form action="">
    <Input
      v-for="(item, index) in inputs"
      :key="index"
      :type="item.type"
      :autocomplete-type="item.autocompleteType"
      :classes="[
        'input input_shadow',
        { 'input_error' : isError }
      ]"
      :model-value="item.value"
      @update:model-value="onUpdateInput(item, $event)"
    >
      <template #label>
        <Label
          :value="item.label"
          classes="input-group__label"
        />
      </template>
    </Input>

    <Button
      classes="button button_primary mt-4"
      value="Войти"
      @on-click="onLogin(inputs[0].value, inputs[1].value)"
    />
  </form>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Button from '@/components/UI/Button.vue'
import Input from '@/components/UI/Input.vue'
import Label from '@/components/UI/Label.vue'

export default {
  name: 'Login',
  components: {
    Button,
    Input,
    Label
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const inputs = ref([
      {
        autocompleteType: 'username',
        label: 'Логин',
        value: ''
      },
      {
        autocompleteType: 'current-password',
        label: 'Пароль',
        type: 'password',
        value: ''
      }
    ])
    const isError = ref(false)

    function onUpdateInput (input, value) {
      input.value = value
    }

    async function onLogin (username, password) {
      if (!(username.length && password.length)) {
        isError.value = true
        return
      }

      const {
        accessToken = null,
        refreshToken = null,
        success
      } = await store.dispatch('Auth/login', {
        username,
        password
      })

      if (success) {
        isError.value = false
        store.commit('Auth/setToken', { accessToken, refreshToken })
        return await router.push('/')
      }

      isError.value = true
    }

    return {
      inputs,
      isError,
      onUpdateInput,
      onLogin
    }
  }
}
</script>
