<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click="this.on_back_to_menu">
        <img src="../assets/zcu_logo.png" class="menu-logo">
        <span class="fw-bold ms-3 menu-logo-text">
          IMiGEr
        </span>
      </a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>
        <a class="btn btn-outline-primary">Login</a>
      </div>
    </div>
  </nav>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "Menu",
  methods: {
    ...mapActions(["restartVisualization"]),
    on_back_to_menu() {
      this.restartVisualization();
    },
  },
}
</script>

<style scoped>
.menu-logo {
  width: 40%;
}

.menu-logo-text {
  color: #034f9f;
}
</style>