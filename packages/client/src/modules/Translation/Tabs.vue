<template>
  <div
    v-if="items && headers"
    class="flex flex-col w-full"
  >
    <div class="flex flex-row items-center justify-between">
      <h2 class="text-xl font-semibold">{{ title }}</h2>

      <div class="flex flex-row items-center">
        <div
          v-for="(item, index) in buttons"
          :key="index"
          :class="item.classes"
          @click="item.onClick"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <Table
      :class="[
        'flex flex-col w-full mt-8',
        { 'wr-table_expand' : isExpanded }
      ]"
      classes="wr-table justify-between mb-6 px-8 rounded-md py-2 shadow-md-y-0 text-white bg-gray-600 text-white"
      classes-row-container="wr-table-row-container"
      :headers="headers"
    >
      <template #default>
        <Row
          :headers="headers"
          :items="items"
          classes="wr-table-row justify-between shadow-md-y-0 py-2"
        >
          <template #item[tab]="{ item, index }">
            <input
              v-if="item.isEditing"
              :value="item.name"
              type="text"
              class="input input_outline"
              @change="onChangeTab({ index, value: $event.target.value, key: 'name' })"
            >

            <p v-else>{{ item.name }}</p>
          </template>

          <template #item[url]="{ item, index }">
            <input
              v-if="item.isEditing"
              :value="item.url"
              type="text"
              class="input input_outline"
              @change="onChangeTab({ index, value: $event.target.value, key: 'url' })"
            >

            <a
              v-else
              :href="item.url"
              target="_blank"
              class="break-all"
            >
              {{ item.url }}
            </a>
          </template>

          <template #controls="{ item, index }">
            <div class="flex flex-row items-center justify-between w-16">
              <PencilAltIcon
                v-if="!item.isEditing"
                class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
                @click="setEditingStatus({ key: 'tabs', index, value: true })"
              />

              <SaveIcon
                v-else
                class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-green-600 stroke-1"
                @click="onSaveTab({ index })"
              />

              <TrashIcon
                class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-red-500 stroke-1"
                @click="onDeleteTab({ id: item.tab_id, index })"
              />
            </div>
          </template>
        </Row>

        <div class="flex justify-center w-full">
          <span
            v-if="!items.length"
            class="font-sm text-gray-500 font-semibold"
          >
            Нет данных
          </span>
        </div>
      </template>

      <template #item[actions]>
        <img
          :src="CaretUpIcon"
          :class="[
            'flex ml-auto cursor-pointer wr-table__expand-icon',
            { 'wr-table_expand' : isExpanded }
          ]"
          alt="Icon"
          @click="changeExpandStatus"
        >
      </template>
    </Table>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'
import { useStore } from 'vuex'

import Table from '@/components/UI/Table/Table.vue'
import Row from '@/components/UI/Table/Row.vue'
import {
  PencilAltIcon,
  SaveIcon,
  TrashIcon
} from '@heroicons/vue/outline'
import CaretUpIcon from '@/assets/icons/CaretUp.svg'

export default {
  name: 'Tabs',
  props: {
    buttons: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    PencilAltIcon,
    Row,
    SaveIcon,
    Table,
    TrashIcon
  },
  setup (props) {
    const { items } = toRefs(props)
    const store = useStore()
    const isExpanded = ref(true)
    const changeExpandStatus = () => {
      isExpanded.value = !isExpanded.value
    }

    const onDeleteTab = async ({ id, index }) => {
      if (id) {
        await store.dispatch('Translation/deleteTab', id)

        const tabs = await store.dispatch('Translation/getTabs')
        store.commit('Translation/setTabs', tabs)
      } else {
        store.commit('Translation/deleteTab', index)
      }
    }
    const onSaveTab = async ({ index }) => {
      const element = items.value[index]

      if (element.tab_id !== undefined) {
        const payload = {
          tab_id: element.tab_id,
          name: element.name,
          url: element.url
        }

        await store.dispatch('Translation/updateTab', payload)
      } else {
        const payload = {
          name: element.name,
          url: element.url
        }

        await store.dispatch('Translation/createTab', payload)
      }

      const codes = await store.dispatch('Translation/getTabs')
      store.commit('Translation/setTabs', codes)
    }

    return {
      CaretUpIcon,
      isExpanded,
      changeExpandStatus,
      setEditingStatus: (payload) => store.commit('Translation/setEditingStatus', payload),
      onChangeTab: (payload) => store.commit('Translation/updateTab', payload),
      onDeleteTab,
      onSaveTab
    }
  }
}
</script>
