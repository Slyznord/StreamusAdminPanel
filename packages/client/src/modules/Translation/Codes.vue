<template>
  <div
    v-if="items && headers"
    class="flex flex-col w-full"
  >
    <div class="flex flex-row items-center justify-between">
      <h2 class="text-xl font-semibold">{{ title }}</h2>

      <div class="flex flex-row items-center gap-4">
        <div
          v-for="(item, index) in buttons"
          :key="index"
        >
          <div v-if="item.id === 0">
            <label :class="item.classes" for="import-codes">{{ item.label }}</label>
            <input
              id="import-codes"
              type="file"
              class="hidden"
              @change="item.onClick($event)"
            >
          </div>

          <div
            v-else
            :class="item.classes"
            @click="item.onClick"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex relative w-1/3 mt-8">
      <Input
        :model-value="search"
        classes="input input_shadow"
        @input="search = $event.target.value"
      />

      <SearchIcon class="w-4 text-gray-400 absolute top-0 bottom-0 my-auto right-4" />
    </div>

    <Table
      :class="[
        'flex flex-col w-full mt-8',
        { 'wr-table_expand' : isExpanded }
      ]"
      classes="wr-table justify-between mb-6 px-8 rounded-md py-2 shadow-md-y-0 text-white bg-gray-600 text-white gap-4"
      classes-row-container="wr-table-row-container"
      :headers="headers"
    >
      <template #default>
        <Row
          :headers="headers"
          :items="filteredItems"
          classes="wr-table-row justify-between shadow-md-y-0 py-2 gap-4"
        >
          <template #item[code]="{ item, index }">
            <input
              v-if="item.isEditing"
              :value="item.code"
              type="text"
              class="input input_outline"
              @change="onChangeCode({ index, value: $event.target.value })"
            >

            <p v-else>{{ item.code }}</p>
          </template>

          <template #item[name]="{ item }">
            <p>{{ item.name || '-' }}</p>
          </template>

          <template #item[email]="{ item }">
            <p>{{ item.email || '-' }}</p>
          </template>

          <template #item[is_online]="{ item }">
            <p>{{ Boolean(item.is_online) ? 'Да' : 'Нет' }}</p>
          </template>

          <template #item[last_activity]="{ item }">
            {{ item.last_activity ? new Date(parseInt(item.last_activity)) : '-' }}
          </template>

          <template #controls="{ item, index }">
            <div class="flex flex-row items-center justify-between w-16">
              <PencilAltIcon
                v-if="!item.isEditing"
                class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
                @click="setEditingStatus({ key: 'codes', index, value: true })"
              />

              <SaveIcon
                v-else
                class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-green-600 stroke-1"
                @click="onSaveCode(item)"
              />

              <TrashIcon
                class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-red-500 stroke-1"
                @click="onDeleteCode(item.code_id)"
              />
            </div>
          </template>
        </Row>

        <div class="flex justify-center w-full">
          <span
            v-if="!filteredItems.length"
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
import { ref, toRefs, computed } from 'vue'
import { useStore } from 'vuex'

import CaretUpIcon from '@/assets/icons/CaretUp.svg'
import Input from '@/components/UI/Input.vue'
import Table from '@/components/UI/Table/Table.vue'
import Row from '@/components/UI/Table/Row.vue'
import {
  PencilAltIcon,
  SaveIcon,
  SearchIcon,
  TrashIcon
} from '@heroicons/vue/outline'

export default {
  name: 'Codes',
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
    Input,
    PencilAltIcon,
    Row,
    SaveIcon,
    SearchIcon,
    Table,
    TrashIcon
  },
  setup (props) {
    const { items } = toRefs(props)
    const store = useStore()
    const isExpanded = ref(true)
    const search = ref('')
    const changeExpandStatus = () => {
      isExpanded.value = !isExpanded.value
    }

    const onDeleteCode = async (codeID) => {
      if (codeID !== undefined) {
        await store.dispatch('Translation/deleteCode', codeID)

        const codes = await store.dispatch('Translation/getCodes')
        store.commit('Translation/setCodes', codes)
      } else {
        store.commit('Translation/deleteCode', codeID)
      }
    }
    const onSaveCode = async (item) => {
      if (item.code_id) {
        const payload = {
          code: item.code,
          code_id: item.code_id
        }

        await store.dispatch('Translation/updateCode', payload)
      } else {
        await store.dispatch('Translation/createCode', {
          code: item.code,
          name: null,
          email: null,
          last_activity: null
        })
      }

      const codes = await store.dispatch('Translation/getCodes')

      store.commit('Translation/setCodes', codes)
    }

    const filteredItems = computed(() => {
      if (!items) {
        return []
      }

      if (!items.value.length) {
        return []
      }

      return items.value.filter(item => item.code.includes(search.value) || !search.value.length)
    })

    return {
      CaretUpIcon,
      isExpanded,
      changeExpandStatus,
      filteredItems,
      search,
      setEditingStatus: (payload) => store.commit('Translation/setEditingStatus', payload),
      onChangeCode: (payload) => store.commit('Translation/updateCode', payload),
      onDeleteCode,
      onSaveCode
    }
  }
}
</script>
