<!-- A component composing together a SVG canvas and its minimap -->
<template>
  <div class="row flex-grow-1 d-flex">
    <div class="p-0 col-md-9">
      <svg-canvas
          id="main"
          :view-port="this.$store.state.viewPort"
          :vertices="this.$store.state.vertices"
          :edges="this.$store.state.edges"
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
    </div>
  </div>
</template>

<script>
import SvgCanvas from "@/components/svg/SvgCanvas";
import SvgMinimap from "@/components/svg/SvgMinimap";

export default {
  name: 'SvgShowcase',
  components: {SvgMinimap, SvgCanvas}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.canvas-minimap-container {
  /*width: 300px;*/
  /*position: absolute;*/
  /*top: 87px;*/
  /*background: white;*/
  /*right: 5px;*/
}
</style>
