<template>
  <form>
    <strong>Click behaviour:</strong>
    <input type="radio" id="move" value="move" class="ms-2" v-model="this.mode">
    <label for="move" class="ms-1">move</label>
    <input type="radio" id="remove" value="remove" class="ms-2" v-model="this.mode">
    <label for="remove" class="ms-1">remove</label>

    {{ behaviour }}
  </form>
</template>

<script>
export default {
  name: "ClickBehaviourToggle",
  props: {
    behaviour: String,
    behaviourChanged: Function
  },
  computed: {
    mode: {
      get() {
        return this.behaviour
      },
      set(value) {
        this.behaviourChanged(value)
      }
    }
  }
}
</script>

