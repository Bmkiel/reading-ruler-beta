<template>
  <div class="overlay">
    <div
        class="ruler"
        v-if="rulerEnabled"
        :style="{
          background: 'linear-gradient(90deg, rgba(0,0,0,0), ' + rulerColor + ', ' + rulerColor + ', ' + rulerColor + ', ' + rulerColor + ', rgba(0,0,0,0))',
          height: rulerHeight + 'px',
          opacity: rulerOpacity,
          top: (rulerY - rulerHeight / 2) + 'px',
        }">
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'mousePosition',
    'rulerEnabled',
  ],
  data() {
    return {
      rulerColor: '#0095ff',
      rulerOpacity: 0.12,
      rulerY: 0,
      rulerHeight: 34,
    };
  },
  watch: {
    mousePosition(mousePosition) {
      this.rulerY = mousePosition.y;
    },
  },
};
</script>

<style>
.ruler {
  display: block;
  position: fixed;
  width: 100%;
}
</style>
