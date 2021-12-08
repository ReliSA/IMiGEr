<template>
  <div class="timeline border border-2 border-dark text-center" :style="`height:${this.height}px`">
    <span>Timeline skeleton is here ...</span>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  props: {
    height: Number,
  }
}
</script>

<style scoped>
  .timeline {
    background: gainsboro;
  }
</style>