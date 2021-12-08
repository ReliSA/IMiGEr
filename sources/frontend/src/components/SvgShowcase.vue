<!-- A component composing together a SVG canvas and its minimap -->
<template>
  <div class="row" v-if="this.$store.state.showTimeline">
    <Timeline :height="this.$store.state.style.timeline.height"/>
  </div>
  <div class="row flex-grow-1 d-flex">
    <div class="p-0 col-md-9">
      <svg-canvas
          id="main"
          :view-port="this.$store.state.viewPort"
          :vertices="this.$store.state.vertices"
          :edges="this.$store.state.edges"
          :excluded-vertices-boxes="this.$store.state.excludedNodesClientRects"
          :vertex_map="this.$store.state.vertex_map"
          :style="this.$store.state.style"/>
    </div>
    <div class="canvas-minimap-container p-0 col-md-3" style="opacity: 0.9">
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
</template>

<script>
import SvgCanvas from "@/components/svg/SvgCanvas";
import SvgMinimap from "@/components/svg/SvgMinimap";
import Timeline from "@/components/svg/Timeline";
import ExcludedVertex from "@/components/ExcludedVertex";
import {mapActions} from "vuex";

export default {
  name: 'SvgShowcase',
  components: {SvgMinimap, SvgCanvas, ExcludedVertex, Timeline},
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
