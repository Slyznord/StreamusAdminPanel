<template>
  <div class="upload-file">
    <label for="upload" :class="classes">
      <DownloadIcon class="upload-file__icon mr-2" />

      <span class="upload-file__text">{{ title }}</span>

      <input
        id="upload"
        type="file"
        class="upload-file__input"
        @change="uploadFile($event)"
      >
    </label>

    <p class="upload-file__text upload-file__text_black">{{ filename }}</p>
  </div>
</template>

<script>
import { DownloadIcon } from '@heroicons/vue/outline'
import { toRefs } from 'vue'

export default {
  name: 'UploadFile',
  props: {
    filename: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: 'upload-file__label'
    },
    allowedExtensions: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg', 'svg']
    }
  },
  components: {
    DownloadIcon
  },
  setup (props, { emit }) {
    const { allowedExtensions } = toRefs(props)
    const extractFileExtension = (filename) => {
      const ext = filename.match(/\.([^.]+)$/)
      return ext && ext[1]
    }

    function uploadFile (event) {
      const file = event.target.files[0]
      const fileExtension = extractFileExtension(file.name)

      if (!allowedExtensions.value.includes(fileExtension)) {
        emit('uploadFile', null)
        return alert('Недопустимое расширение файла, разрешены только png, jpg, jpeg и svg')
      }

      emit('upload:file', file)
    }

    return {
      uploadFile
    }
  }
}
</script>
