<!-- A component composing together a SVG canvas and its minimap -->
<template>
  <div class="container-fluid d-flex flex-column h-100">
    <div class="py-3">
      <p class="display-6 font-weight-bold"><strong>IMiGEr</strong></p>
      <ClickBehaviourToggle :behaviour="this.$store.state.clickBehaviour"
                            :behaviour-changed="this.clickBehaviourChanged"/>
    </div>
    <div class="row flex-grow-1">
      <div class="col-md-9 no-padding d-flex flex-column h-100">
        <svg-canvas
            id="main"
            :view-port="this.$store.state.viewPort"
            :vertices="this.$store.state.vertices"
            :edges="this.$store.state.edges"
            :excluded-vertices-boxes="this.$store.state.excludedNodesClientRects"
            :vertex_map="this.$store.state.vertex_map"
            :style="this.$store.state.style"/>
      </div>
      <div class="col-md-3 no-padding flex-grow-1">
        <svg-minimap
            class="canvas-minimap"
            ref-id="main"
            :view-port="{height: 300}"
            :parent-world-size="this.$store.state.worldSize"
            :parent-view-port="this.$store.state.viewPort"
        />
        <div class="p-3">
          Excluded nodes:
          <ExcludedVertex v-for="vertex in this.$store.state.excludedVertices"
                          :key="vertex.id"
                          :title="vertex.name"
                          @click="() => includeVertex(vertex)"
                          :on-client-box-updated="(box) => addExcludedVertexClientRect({vertex: vertex, clientRect: box})"
                          :on-client-box-removed="() => removeExcludedVertexClientRect(vertex)"
          />
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
import {mapActions} from "vuex";

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
    ...mapActions(["includeVertex", "addExcludedVertexClientRect", "removeExcludedVertexClientRect"]),
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
