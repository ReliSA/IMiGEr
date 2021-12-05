<!-- A component composing together a SVG canvas and its minimap -->
<template>
  <div class="container-fluid d-flex flex-column h-100">
    <div class="py-3">
      <p class="display-6 font-weight-bold"><strong>IMiGEr</strong></p>
      <ClickBehaviourToggle :behaviour="this.$store.state.clickBehaviour" :behaviour-changed="this.clickBehaviourChanged"/>
    </div>
    <div class="row flex-grow-1">
      <div class="col-md-9 no-padding">
        <svg-canvas
            id="main"
            :view-port="this.$store.state.viewPort"
            :vertices="this.$store.state.vertices"
            :edges="this.$store.state.edges"
            :style="this.$store.state.style"/>
      </div>
      <div class="col-md-3 no-padding">
        <svg-minimap
            class="canvas-minimap"
            ref-id="main"
            :view-port="{height: 300}"
            :parent-world-size="this.$store.state.worldSize"
            :parent-view-port="this.$store.state.viewPort"
        />
        <div class="p-3">
          Excluded nodes:
          <ExcludedVertex v-for="vertex in excludedVertices"
                          :key="vertex.id"
                          :title="vertex.description"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgCanvas from "@/components/svg/SvgCanvas";
import SvgMinimap from "@/components/svg/SvgMinimap";
import ExcludedVertex from "@/components/ExcludedVertex";
import ClickBehaviourToggle from "@/components/controls/ClickBehaviourToggle";

export default {
  name: 'SvgShowcase',
  components: {SvgMinimap, SvgCanvas, ExcludedVertex, ClickBehaviourToggle},
  data() {
    return {
      excludedVertices: [
        {
          description: "Foo",
          id: 0
        },
        {
          description: "Bar",
          id: 1
        },
        {
          description: "Baz",
          id: 2
        },
      ]
    }
  },
  methods: {
    clickBehaviourChanged(value) {
      this.$store.commit("SET_CLICK_BEHAVIOUR", value);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.no-padding {
  padding: 0;
  margin: 0;
}
</style>
