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
            background: backgroundColor,
            top: `calc(-100vh)`,
          }">
      </div>
      <div
          class="ruler-box ruler-box-bottom"
          :style="{
            background: backgroundColor,
            top: `calc(-100vh + ${height}px)`,
          }">
      </div>
    </div>
    <div v-else>
      <div
          class="ruler-line"
          :style="{
            background: backgroundColor,
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
  computed: {
    backgroundColor() {
      return `linear-gradient(90deg, rgba(0,0,0,0), ${this.color}, ${this.color}, ${this.color}, ${this.color}, rgba(0,0,0,0))`;
    },
  }
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
  transition: top .05s;
}
</style>
