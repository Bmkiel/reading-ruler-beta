<template>
  <div
      class="ruler"
      :style="{
        top: (top - height / 2) + 'px',
        opacity: opacity,
      }">
    <div v-if="inverted">
      <div
          class="ruler-box ruler-box-top"
          :style="{
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${color}, ${color}, ${color}, ${color}, rgba(0,0,0,0))`,
          }">
      </div>
      <div
          class="ruler-box ruler-box-bottom"
          :style="{
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${color}, ${color}, ${color}, ${color}, rgba(0,0,0,0))`,
          }">
      </div>
    </div>
    <div v-else>
      <div
          class="ruler-line"
          :style="{
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${color}, ${color}, ${color}, ${color}, rgba(0,0,0,0))`,
            height: height + 'px',
          }">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    top: Number,
    color: String,
    height: Number,
    opacity: Number,
    inverted: Boolean,
  },
  data() {
    return {};
  },
};
</script>

<style>
.ruler {
  display: block;
  position: fixed;
  transition: top .05s, opacity .1s;
  width: 100%;
}

.ruler-line {
  transition: height .05s;
}

.ruler-box {
  height: 100vh;
  position: relative;
}

.ruler-box-top {
  top: calc(-100vh - 4vh);
}

.ruler-box-bottom {
  top: calc(-100vh + 2*4vh);
}
</style>
