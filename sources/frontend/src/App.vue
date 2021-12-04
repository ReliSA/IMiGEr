<!-- Root Vue component of the application -->
<template>
  <h1 v-if="this.$store.state.loading" class="mt-5 text-center"><strong>VueJS prototype</strong> is being loaded...</h1>
  <SvgShowcase v-else />
</template>

<script>
import SvgShowcase from './components/SvgShowcase.vue'
import store from './store'
import {mapActions} from "vuex"
import testData from '@/assets/data/test-data.json'

export default {
  name: 'App',
  components: {
    SvgShowcase
  },
  methods: {
    ...mapActions(["loadInitialData"])
  },
  store,
  mounted() {
    // load graph data on component initialization
    this.loadInitialData(testData)
  }
}
</script>

<style>

</style>
