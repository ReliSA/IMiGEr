<template>
  <input class="form-check-input" type="radio" :value="method_id" :id="method_id" name="fileFormat"
  @input="$emit('update:modelValue', $event.target.value)">
  <label class="form-check-label" :for="method_id">{{method_name}}</label>
</template>

<script>
export default {
  name: "UploadMethod",
  props: {
    method_name: String,
    method_id: String,
    modelValue: null
  }
}
</script>

<style scoped>

</style>