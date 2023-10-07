export default {
  data () {
    return {
      isOpen: false,
      params: {},
      rendering: true
    }
  },
  watch: {
    isOpen: {
      immediate: true,
      handler (val) {
        this.isOpen = val
        this.rendering = val
      }
    }
  },
  methods: {
    overwriteParams (event) {
      this.params = {}
      this.params = event.ref.params._value
    }
  }
}
