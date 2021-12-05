<!-- Root Vue component of the application -->
<template>
  <InitialScreen @diagram_retrieved="on_diagram_retrieval" v-if="!this.$store.state.graph_loaded" />
  <SvgShowcase v-else />
</template>

<script>
import SvgShowcase from './components/SvgShowcase.vue'
import store from './store'
import {mapActions} from "vuex"
// import testData from '@/assets/data/test-data.json'
import InitialScreen from "./components/InitialScreen";

export default {
  name: 'App',
  components: {
    InitialScreen,
    SvgShowcase
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
