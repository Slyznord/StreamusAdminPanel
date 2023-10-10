<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-row justify-between items-center w-full">
      <h2 class="text-xl font-semibold">Голосования</h2>

      <Button
        value="Создать голосование"
        classes="button button_big button_success"
        @click="openCreateVoteModal"
      />
    </div>

    <Table
      class="flex flex-col w-full mt-8"
      classes="wr-table mb-6 px-8 rounded-md py-2 shadow-md-y-0 text-white bg-gray-600 text-white"
      classes-row-container="flex flex-col w-full px-0"
      :headers="headers"
    >
      <template #default>
        <Row
          :headers="headers"
          :items="votes || []"
          classes="wr-table-row shadow-md-y-0 py-2"
        >
          <template #controls="{ item: element }">
            <div class="flex flex-row items-center ml-auto gap-4">
              <component
                v-for="(item, index) in controls"
                :key="index"
                :is="item.icon"
                :class="item.classes"
                @click="item.onClick(element)"
              />
            </div>
          </template>
        </Row>
      </template>
    </Table>
  </div>

  <a
    v-if="fileURL && fileURL.path"
    class="downloadFile"
    target="_blank"
    :href="fileURL.path"
  />
</template>

<script>
import Button from '@/components/UI/Button.vue'
import CreateVoteModal from '@/components/Modals/CreateVote/CreateVoteModal.vue'
import Table from '@/components/UI/Table/Table.vue'
import Row from '@/components/UI/Table/Row.vue'

import { inject, ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { DownloadIcon, PencilIcon, TrashIcon } from '@heroicons/vue/outline'

export default {
  name: 'Vote',
  components: {
    Button,
    CreateVoteModal,
    DownloadIcon,
    PencilIcon,
    Row,
    Table,
    TrashIcon
  },
  setup () {
    const store = useStore()
    const $vfm = inject('$vfm')
    const headers = ref([
      {
        column: 'id',
        label: 'ID',
        classesHeader: 'flex flex-row items-center w-1/5 self-center text-lg font-semibold',
        classesIcon: 'mr-2',
        classesItem: 'text-gray-500',
        icon: '',
        onClick: () => {}
      },
      {
        column: 'section_name',
        label: 'Секция',
        classesHeader: 'flex flex-row items-center w-1/3 text-lg font-semibold',
        classesIcon: 'mr-2',
        classesItem: 'text-gray-500',
        icon: '',
        onClick: () => {}
      }
    ])
    const controls = ref([
      {
        icon: 'DownloadIcon',
        classes: 'w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1',
        onClick: async ({ id }) => {
          fileURL.value = await store.dispatch('Vote/getReport', id)
          document.querySelector('a.downloadFile').click()
          await nextTick()
        }
      },
      {
        icon: 'PencilIcon',
        classes: 'w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1',
        onClick: async (vote) => {
          const presentations = await store.dispatch('Vote/getPresentations', vote.id)

          $vfm.show({
            component: CreateVoteModal,
            bind: {
              vote,
              elements: presentations,
              isEditing: true
            }
          })
        }
      },
      {
        icon: 'TrashIcon',
        classes: 'w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1',
        onClick: async ({ id }) => {
          await store.dispatch('Vote/deleteVote', id)
          await getVotes()
        }
      }
    ])
    const votes = computed(() => {
      return store.state.Vote.votes
    })
    const fileURL = ref(null)

    onMounted(async () => {
      await getVotes()
    })

    async function getVotes () {
      const votes = await store.dispatch('Vote/getVotes')
      store.commit('Vote/setVotes', votes)
    }

    function openCreateVoteModal () {
      $vfm.show({
        component: CreateVoteModal
      })
    }

    return {
      controls,
      fileURL,
      headers,
      openCreateVoteModal,
      votes
    }
  }
}
</script>
