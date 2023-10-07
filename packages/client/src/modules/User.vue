<template>
  <div class="user">
    <div class="user__group">
      <img
        v-if="avatarURL"
        :src="avatarURL"
        alt="avatar"
      >
      <div
        v-else
        class="user__avatar user__avatar_default"
      ></div>
    </div>

    <div class="user__group">
      <p class="user__p">{{ username }}</p>

      <Settings
        :icon="ChevronDownIcon"
        iconClasses="user__icon"
      >
        <template #button="{ switchSettingsState }">
          <Button
            v-for="(item, index) in settings"
            :key="index"
            :value="item.label"
            :classes="item.buttonClasses"
            @on-click="item.onClick(switchSettingsState)"
          >
            <template #icon>
              <component
                :is="item.icon"
                :class="item.iconClasses"
              />
            </template>
          </Button>
        </template>
      </Settings>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import Button from '@/components/UI/Button.vue'
import { ChevronDownIcon, LogoutIcon } from '@heroicons/vue/outline'
import Settings from '@/modules/Settings.vue'

// TODO: Реализовать хранение логина пользователя и отображения его данных в этом компоненте
export default {
  name: 'User',
  props: {
    username: {
      type: String,
      default: 'User'
    },
    avatarURL: {
      type: String,
      default: null
    }
  },
  components: {
    Button,
    Settings
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const settings = ref([
      {
        icon: LogoutIcon,
        label: 'Выйти',
        buttonClasses: 'button button_normal button_justify-start button_error',
        iconClasses: 'icon_normal mr-2',
        onClick: async (switchSettingsState) => {
          store.commit('Auth/setToken', {
            accessToken: null,
            refreshToken: null
          })
          switchSettingsState()
          await router.push('/auth')
        }
      }
    ])

    return {
      ChevronDownIcon,
      settings
    }
  }
}
</script>
