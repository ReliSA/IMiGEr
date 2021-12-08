<template>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item" @click="onHomeMenuItemClicked">
        <a class="nav-link active" aria-current="page" href="#">Home</a>
      </li>
      <li class="nav-item border-start ps-1">
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