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

          <Edge v-for="edge in visibleEdges"
                :start-x="vertices[vertex_map[edge.from]].x"
                :start-y="vertices[vertex_map[edge.from]].y"
                :end-x="vertices[vertex_map[edge.to]].x"
                :end-y="vertices[vertex_map[edge.to]].y"
                :title="edge.attributes['3']"
                :style="style.edge"
                :highlighted="edge.highlighted"
                :start-offset="style.vertex.radius"
                :end-offset="style.vertex.radius"
                :key="`link-${edge.id}`"/>

          <Edge v-for="edge in excludedEdges"
                :start-x="edge.x1"
                :start-y="edge.y1"
                :end-x="edge.x2"
                :end-y="edge.y2"
                :title="edge.fromExcluded && edge.toExcluded ? `` : edge.description "
                :style="style.edge"
                :highlighted="false"
                :start-offset="edge.fromExcluded ? 0 : style.vertex.radius"
                :end-offset="edge.toExcluded ? 0 : style.vertex.radius"
                :key="`excluded-link-${edge.id}`"/>

          <Vertex v-for="vertex in visibleVertices"
                  :id="vertex.id"
                  :x="vertex.x"
                  :y="vertex.y"
                  :title="vertex.name"
                  :style="style.vertex"
                  :radius="vertex.radius"
                  :highlighted="vertex.highlighted"
                  :on-vertex-mouse-down-or-up="(down) => onVertexMouseDown(down, vertex)"
                  :key="`vertex-${vertex.id}`"/>

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
import transformUtils from '@/utils/transform'

export default {
  components: {SvgComponents, Vertex, Edge},
  props: {
    id: String,
    width: Number,
    height: Number,
    edges: Array,
    vertices: Array,
    vertex_map: Object,
    excludedVerticesBoxes: Object,
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
  computed: {
    visibleVertices() {
      return this.vertices.filter(v => !v.excluded)
    },
    visibleEdges() {
      return this.edges.filter(e => !e.excluded)
    },
    excludedEdges() {
      return this.edges.filter(edge => edge.excluded)
          .map(edge => {
            return transformUtils.createEdgeConnectedToAExcludedVertex(
                edge,
                this.vertices[this.vertex_map[edge.from]],
                this.vertices[this.vertex_map[edge.to]],
                this.viewPort,
                this.excludedVerticesBoxes
            )
          })
          .filter(e => e != null)
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
    ...mapActions(["updateScale", "toggleVertexHighlightState", "changeTranslation", "changeVertexPos",
                   "vertexMouseDown", "setViewPortDimensions", "vertexClicked"]),
    onMouseDownEvent(event) {
      this.iX = event.clientX
      this.iY = event.clientY
    },
    onMouseUpEvent(e) {
      if (this.iX === e.clientX && this.iY === e.clientY && this.$store.state.vertexBeingDragged != null) {
        this.vertexClicked(this.$store.state.vertexBeingDragged)
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
      event.preventDefault();
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
