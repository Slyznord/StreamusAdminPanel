<template>
  <div class="container column">
    <Tabs
      :classes="['tabs__row tabs__row_overflow-y-scroll']"
      @update-tab="onUpdateTab($event)"
    >
      <template #tabs="{ callback }">
        <div class="tabs__container tabs__container_bg-secondary">
          <tab-item
            ref="tab"
            :tabs="tabsName"
            :classes="['tabs__item']"
            :active-class="['tabs__item_active']"
            :callback="callback"
          />

          <div
            class="tabs__selected"
            :style="computedStyles"
          ></div>
        </div>
      </template>

      <template #extend>
        <User />
      </template>

      <template #tab>
        <div class="container container_h-full container_bg-white container_rounded-md container_padding-30 column mt-2">
          <tab
            v-for="(item, index) in tabs"
            :key="index"
            :number="index"
          >
            <component :is="item.component" />
          </tab>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script>
import {
  ref,
  computed,
  defineAsyncComponent
} from 'vue'

import Tabs from '@/components/UI/Tabs/Tabs'
import Tab from '@/components/UI/Tabs/Tab'
import TabItem from '@/components/UI/Tabs/TabItem'
import User from '@/modules/User.vue'

export default {
  name: 'Main',
  components: {
    Quizlet: defineAsyncComponent(() => import('@/modules/Quizlet.vue')),
    Translation: defineAsyncComponent(() => import('@/modules/Translation/Index')),
    Tab,
    Tabs,
    TabItem,
    User,
    Vote: defineAsyncComponent(() => import('@/modules/Vote.vue'))
  },
  setup () {
    const tabs = ref([
      {
        name: 'Квиз',
        component: 'Quizlet'
      },
      {
        name: 'Трансляция',
        component: 'Translation'
      },
      {
        name: 'Голосования',
        component: 'Vote'
      }
    ])
    const tabsName = computed(() => {
      return tabs.value.map(item => item.name)
    })
    const activeTabKey = 'werial_active_tab'
    const savedActiveTab = localStorage.getItem(activeTabKey)
    const activeTab = ref(savedActiveTab ?? 0)

    // Расчитываем отступ слева для выделения активного таба
    const computedStyles = computed(() => {
      // TODO: Сделать получение ширины таба
      // Умножаем на 200 так как длина таба у нас 200
      const left = activeTab.value * 200

      return {
        left: `${left}px`
      }
    })

    function onUpdateTab (index) {
      activeTab.value = index
    }

    return {
      activeTab,
      computedStyles,
      tabs,
      tabsName,
      onUpdateTab
    }
  }
}
</script>
