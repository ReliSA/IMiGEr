<template>
  <div class="py-2 px-2 mb-3 rounded border border-secondary d-flex align-items-center" ref="root">
    <span>{{title}}</span>
    <button type="button" class="btn btn-outline-secondary ms-auto" @click="onIncludeButtonClicked">Include</button>
  </div>
</template>

<script>
export default {
  name: "ExcludedVertex",
  props: {
    title: String,
    onIncludeButtonClicked: Function,
    onClientBoxUpdated: Function,
    onClientBoxRemoved: Function,
  },
  mounted() {
    this.onClientBoxUpdated(this.$refs.root.getBoundingClientRect())
  },
  updated() {
    // bounding rect might have been updated
    this.onClientBoxUpdated(this.$refs.root.getBoundingClientRect())
  },
  unmounted() {
    this.onClientBoxRemoved()
  }
}
</script>
