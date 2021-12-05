<template>
  <div class="svg-canvas">
    <svg
        :id="id"
        :width="'100%'"
        :height="'100%'"
    >
      <!-- import common SVG components, such as arrow heads that are used when displaying an edge-->
      <SvgComponents
          :style="style.edge"/>

      <g :transform="`
            translate(${viewPort.tx}, ${viewPort.ty})
            scale(${viewPort.scale})`">

        <!-- nested in order to be able to create a minimap that is not affected by viewport transformations-->
        <g :id="`${id}-root-element`">

          <Edge v-for="l in edges"
                :start-x="vertices[vertex_map[l.from]].x"
                :start-y="vertices[vertex_map[l.from]].y"
                :end-x="vertices[vertex_map[l.to]].x"
                :end-y="vertices[vertex_map[l.to]].y"
                :title="l.description"
                :style="style.edge"
                :highlighted="l.highlighted"
                :start-offset="style.vertex.radius"
                :key="`link-${l.id}`"/>

          <Vertex v-for="n in vertices"
                  :id="n.id"
                  :x="n.x"
                  :y="n.y"
                  :title="n.name"
                  :style="style.vertex"
                  :radius="n.radius"
                  :highlighted="n.highlighted"
                  :on-vertex-mouse-down-or-up="(down) => onVertexMouseDown(down, n)"
                  :key="`vertex-${n.id}`"/>

        </g>
      </g>
    </svg>
  </div>
</template>
<script>
import Edge from "@/components/svg/Edge";
import Vertex from "@/components/svg/Vertex";
import SvgComponents from "@/components/svg/SvgComponents";
import {mapActions} from "vuex";

export default {
  components: {SvgComponents, Vertex, Edge},
  props: {
    id: String,
    width: Number,
    height: Number,
    edges: Array,
    vertices: Array,
    vertex_map: Object,
    style: {
      line: Object,
      vertex: Object
    },
    viewPort: Object
  },
  data() {
    return {
      iX: 0,
      iY: 0
    }
  },
  mounted() {
    let id = `${this.id}`
    // hook up event listeners for particular mouse events
    let svgElem = document.getElementById(id)
    svgElem.addEventListener("wheel", this.onMouseWheelEvent);
    svgElem.addEventListener("mousemove", this.onMouseMoveEvent);
    svgElem.addEventListener("mousedown", this.onMouseDownEvent);
    svgElem.addEventListener("mouseup", this.onMouseUpEvent);
    // once mounted set real viewport dimensions based on the dimensions of the main SVG element
    this.setViewPortDimensions({
      width: svgElem.clientWidth,
      height: svgElem.clientHeight
    })
  },
  methods: {
    ...mapActions(["updateScale", "toggleVertexHighlightState", "changeTranslation", "changeVertexPos", "vertexMouseDown"]),
    onMouseDownEvent(event) {
      this.iX = event.clientX
      this.iY = event.clientY
    },
    onMouseUpEvent(e) {
      if (this.iX === e.clientX && this.iY === e.clientY && this.$store.state.vertexBeingDragged != null) {
        this.toggleVertexHighlightState(this.$store.state.vertexBeingDragged)
      }
      this.vertexMouseDown(false)
    },
    onMouseWheelEvent(event) {
      this.updateScale({targetX: event.clientX, targetY: event.clientY, direction: Math.sign(event.deltaY)})
    },
    onMouseMoveEvent(event) {
      // perform viewport translation or dragging of a vertex
      if (event.buttons > 0) {
        if (this.$store.state.vertexBeingDragged != null) {
          let dx = event.movementX
          let dy = event.movementY
          this.onVertexPositionChanged({
            vertex: this.$store.state.vertexBeingDragged,
            dx: dx,
            dy: dy
          })
        } else {
          let dx = -(this.iX - event.clientX)
          let dy = -(this.iY - event.clientY)
          this.iX = event.clientX
          this.iY = event.clientY
          this.changeTranslation({dx: dx, dy: dy})
        }
      }
    },
    onVertexPositionChanged(payload) {
      this.changeVertexPos(payload)
    },
    onVertexMouseDown(down, vertex) {
      this.vertexMouseDown({vertex, down})
    }

  }
}
</script>

<style scoped>
.svg-canvas {
  border: 1px solid black;;
  height: 100%;
}
</style>
