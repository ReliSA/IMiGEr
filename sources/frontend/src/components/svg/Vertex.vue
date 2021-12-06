<template>
  <g>
    <circle
        :id="fullId"
        :cx="x"
        :cy="y"
        :stroke-width="style.strokeWidth"
        :stroke="style.strokeColor"
        :fill="highlighted ? style.highlightedFillColor : style.fillColor"
        :r="radiusSafe"
        @click="onCircleClicked()"
    />
    <foreignObject :x="x - radiusSafe" :y="y - radiusSafe/2" :width="2*radiusSafe" :height="radiusSafe">
      <div class="vertex-text">
        {{ safeTitle }}
      </div>
    </foreignObject>
  </g>
</template>
<script>

export default {
  props: {
    id: Number,
    x: Number,
    y: Number,
    title: String,
    style: Object,
    radius: Number,
    highlighted: Boolean,
    onClick: Function,
    onVertexMouseDownOrUp: Function
  },
  computed: {
    radiusSafe() {
      if (this.radius == null) {
        return this.style.radius
      } else {
        return this.radius
      }
    },
    fullId() {
      return `vertex-${this.id}`
    },
    safeTitle() {
      if (this.title.length > 16) {
        return this.title.substring(0, 13) + "..."
      } else {
        return this.title
      }
    },
  },
  methods: {
    onCircleClicked() {
      this.onClick()
    },
  },
  mounted() {
    document.getElementById(this.fullId).addEventListener("mousedown", () => this.onVertexMouseDownOrUp(true));
  }
}
</script>

<style scoped>
svg circle {
  cursor: pointer;
}

.vertex-text {
  text-align: center;
  max-lines: 2;
  vertical-align: middle;
  height: 100%;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  word-wrap: break-word;
  text-overflow: ellipsis;
  pointer-events: none;
}

foreignObject {
  pointer-events: none;
}

</style>
