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
                :start-x="vertices[l.from].x"
                :start-y="vertices[l.from].y"
                :end-x="vertices[l.to].x"
                :end-y="vertices[l.to].y"
                :title="l.description"
                :style="style.edge"
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
                  :on-click="() => onVertexClicked(n)"
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
    document.getElementById(id).addEventListener("wheel", this.onMouseWheelEvent);
    document.getElementById(id).addEventListener("mousemove", this.onMouseMoveEvent);
    document.getElementById(id).addEventListener("mousedown", this.onMouseDownEvent);
    document.getElementById(id).addEventListener("mouseup", this.onMouseUpEvent);
  },
  methods: {
    ...mapActions(["increaseScale", "decreaseScale", "toggleVertexHighlightState", "changeTranslation", "changeVertexPos", "vertexMouseDown"]),
    onMouseDownEvent(event) {
      this.iX = event.clientX
      this.iY = event.clientY
    },
    onMouseUpEvent() {
      this.vertexMouseDown(false)
    },
    onMouseWheelEvent(event) {
      const delta = Math.sign(event.deltaY)
      if (delta < 0) {
        this.increaseScale({targetX: event.clientX, targetY: event.clientY})
      } else {
        this.decreaseScale()
      }
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
    onVertexClicked(vertex) {
      // toggle vertex highlight state when clicked
      this.toggleVertexHighlightState(vertex)
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
