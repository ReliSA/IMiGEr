<!-- A component composing together a SVG canvas and its minimap -->
<template>
  <div class="container-fluid canvas-container p-0">
    <svg-canvas
        id="main"
        :view-port="this.$store.state.viewPort"
        :vertices="this.$store.state.vertices"
        :edges="this.$store.state.edges"
        :style="this.$store.state.style"/>
  </div>
  <div class="canvas-minimap-container" style="opacity: 0.9">
    <svg-minimap
        class="canvas-minimap"
        ref-id="main"
        :view-port="{height: 300}"
        :parent-world-size="this.$store.state.worldSize"
        :parent-view-port="this.$store.state.viewPort"
    />
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
.canvas-container, .row, .col-md-8 {
  height: 100%;
}

.canvas-minimap-container {
  position: absolute;
  top: 0px;
  background: white;
  right: 0px;
}
</style>
