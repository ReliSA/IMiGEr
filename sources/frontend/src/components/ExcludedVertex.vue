<template>
  <div class="py-2 px-2 mb-3 rounded border border-secondary d-flex align-items-center">
    <span>{{title}}</span>
    <button type="button" class="btn btn-outline-secondary ms-auto" @click="onIncludeButtonClicked">Include</button>
  </div>
</template>

<script>
export default {
  name: "ExcludedVertex",
  props: {
    title: String,
    onIncludeButtonClicked: Function
  }
}
</script>
