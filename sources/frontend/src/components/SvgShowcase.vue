<!-- A component composing together a SVG canvas and its minimap -->
<template>
  <div class="container-fluid">
    <div class="text-center p-2">
      <h1 class="no-padding">IMiGEr</h1>
    </div>
    <div class="row">
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
        </div>
      </div>
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
.container-fluid, .canvas-container, .row, .col-md-8 {
  height: 100%;
}

.canvas-minimap-container {
  position: absolute;
  top: 0px;
  background: white;
  right: 0px;
}

.no-padding {
  padding: 0;
  margin: 0;
}
</style>
