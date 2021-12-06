<!-- A component that represents a graph edge -->
<template>
  <g>
    <line
        :x1="startX + startOffsetX"
        :y1="startY + startOffsetY"
        :x2="endX - endOffsetX"
        :y2="endY - endOffsetY"
        marker-end="url(#triangle)"
        :style="`stroke:${style.strokeColor};stroke-width:${style.strokeWidth}`"
    />
    <text class="wrap" :x="titleX" :y="titleY">
      <tspan text-anchor="middle" :fill="style.textColor">{{ title }}</tspan>
    </text>
  </g>
</template>

<script>
export default {
  props: {
    startX: Number,
    startY: Number,
    endX: Number,
    endY: Number,
    startOffset: Number,
    endOffset: Number,
    title: String,
    style: Object
  },
  computed: {
    // X coordinate of edge's title
    titleX() {
      return this.startX + (this.endX - this.startX) / 2
    },
    // Y coordinate of edge's title
    titleY() {
      return (this.startY + (this.endY - this.startY) / 2) - this.style.textBottomOffset
    },
    // utilized for computing the length of the edge
    a() {
      return this.endX - this.startX
    },
    // utilized for computing the length of the edge
    b() {
      return this.endY - this.startY
    },
    // length of the edge
    length() {
      return Math.sqrt(this.a * this.a + this.b * this.b);
    },
    // computed properties utilized for positioning of arrows head
    startOffsetRatio() {
      if(this.length > 0) {
        return this.startOffset / this.length
      }else{
        return 0;
      }
    },
    endOffsetRatio() {
      if(this.length > 0) {
        return (this.startOffset + this.style.arrowSize) / this.length
      }else{
        return 0;
      }
    },
    startOffsetX() {
      return this.startOffsetRatio * this.a
    },
    startOffsetY() {
      return this.startOffsetRatio * this.b
    },
    endOffsetX() {
      return this.endOffsetRatio * this.a
    },
    endOffsetY() {
      return this.endOffsetRatio * this.b
    }
  }
}
</script>
