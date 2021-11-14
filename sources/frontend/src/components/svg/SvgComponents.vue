<!-- A view that defines various SVG components to be utilized in other views-->
<template>
  <!-- Define a head of an arrow -->
  <defs>
    <marker id="triangle" viewBox="0 0 10 10"
            refX="1" refY="5"
            markerUnits="strokeWidth"
            markerWidth="3" markerHeight="3"
            orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" :fill="style.tipColor"/>
    </marker>
  </defs>
</template>
<script>
export default {
  props: {
    style: Object
  },
}
</script>
