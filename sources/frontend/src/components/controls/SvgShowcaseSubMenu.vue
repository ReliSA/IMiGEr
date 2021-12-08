<template>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item" @click="onHomeMenuItemClicked">
        <a class="nav-link active" aria-current="page" href="#">Home</a>
      </li>
      <li class="nav-item border-start ps-1 pe-2">
        <label class="p-2">Click behaviour:</label>
        <div class="btn-group btn-toggle">
          <button class="btn btn-sm ps-2"
                  v-bind:class="{'active': inMoveMode, 'btn-outline-primary': !inMoveMode, 'btn-primary': inMoveMode}"
                  @click="onClickBehaviorChange('move')">
            Move
          </button>
          <button class="btn btn-sm"
                  v-bind:class="{'active': !inMoveMode, 'btn-outline-primary': inMoveMode, 'btn-primary': !inMoveMode}"
                  @click="onClickBehaviorChange('remove')">
            Exclude
          </button>
        </div>
      </li>
      <li class="nav-item border-start p-2">
        <div class="form-check">
          <label class="form-check-label" for="exampleCheck1">Timeline</label>
          <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="displayTimeline">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>


export default {
  name: "SvgShowcaseSubMenu",
  props: {
    onHomeMenuItemClicked: Function,
    onClickBehaviorChange: Function,
    moveMode: String,
    onDisplayTimelineChange: Function,
  },
  data () {
    return {
      displayTimeline: false,
    }
  },
  watch: {
    displayTimeline: function(newValue) {
      this.onDisplayTimelineChange(newValue);
    }
  },
  computed: {
    inMoveMode() {
      return this.moveMode === "move";
    }
  }
}
</script>

<style scoped>

</style>