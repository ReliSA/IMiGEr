<template>
  <div class="mt-5">
    <p class="text-start">{{listName}}</p>
    <hr>
    <span class="text-muted">TODO: Query the backend for a list of diagrams and display them in here</span>
  </div>
</template>

<script>
export default {
  name: "DiagramListing",
  props: {
    listName: String,
  }
}
</script>

<style scoped>

</style>