<!-- Root Vue component of the application -->
<template>
  <div class="container-fluid d-flex h-100 flex-column">
    <div class="row">
      <Menu/>
    </div>
    <InitialScreen @diagram_retrieved="on_diagram_retrieval"
                   v-if="!this.$store.state.graph_loaded"
                   :display-auth-component="this.$store.state.displayAuthComponent"
    />
    <SvgShowcase v-else />
  </div>
</template>

<script>
import SvgShowcase from './components/SvgShowcase.vue'
import store from './store'
import {mapActions} from "vuex"
// import testData from '@/assets/data/test-data.json'
import InitialScreen from "./components/InitialScreen";
import Menu from "./components/Menu";

export default {
  name: 'App',
  components: {
    InitialScreen,
    SvgShowcase,
    Menu
  },
  methods: {
    ...mapActions(["loadInitialData"]),
    on_diagram_retrieval(data){
      this.loadInitialData(data);
    }
  },
  store,
  mounted() {
    // load graph data on component initialization
    //this.loadInitialData(testData)
  }
}
</script>

<style>
</style>
