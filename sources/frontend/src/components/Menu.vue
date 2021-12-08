<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click="this.on_back_to_menu">
        <img src="../assets/zcu_logo.png" class="menu-logo">
        <span class="fw-bold ms-3 menu-logo-text">
          IMiGEr
        </span>
      </a>
      <InitialScreenSubMenu v-if="!this.$store.state.graph_loaded"
                            :on-display-auth-change="(visible) => this.setAuthComponentVisibility(visible)"
                            :display-auth-component="this.$store.state.displayAuthComponent"
      />
      <SvgShowcaseSubMenu v-else
                          :move-mode="this.$store.state.clickBehaviour"
                          :on-home-menu-item-clicked="() => this.on_back_to_menu()"
                          :on-click-behavior-change="(behaviour) =>  this.setClickBehavior(behaviour)"/>
    </div>
  </nav>
</template>

<script>
import {mapActions} from "vuex";
import InitialScreenSubMenu from "@/components/controls/InitialScreenSubMenu";
import SvgShowcaseSubMenu from "@/components/controls/SvgShowcaseSubMenu";
import store from '@/store';

export default {
  name: "Menu",
  components: {InitialScreenSubMenu, SvgShowcaseSubMenu},
  store,
  methods: {
    ...mapActions(["restartVisualization", "setClickBehavior", "setAuthComponentVisibility"]),
    on_back_to_menu() {
      this.restartVisualization();
    }
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