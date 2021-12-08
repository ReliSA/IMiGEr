<template>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    </ul>
    <button class="btn btn-outline-primary" @click="onDisplayAuthChange(!displayAuthComponent)">{{ loginButtonText }}</button>
  </div>
</template>

<script>
export default {
  name: "InitialScreenSubMenu",
  props: {
    onDisplayAuthChange: Function,
    displayAuthComponent: Boolean,
  },
  computed: {
    loginButtonText() {
      return this.displayAuthComponent ? "Back" :"Login/Signup";
    }
  }
}
</script>

<style scoped>

</style>