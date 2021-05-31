<template>
  <div class="overlay">
    <div
        class="line"
        :style="{
          background: 'linear-gradient(90deg, rgba(0,0,0,0), ' + lineColor + ', ' + lineColor + ', ' + lineColor + ', ' + lineColor + ', rgba(0,0,0,0))',
          height: lineHeight + 'px',
          opacity: lineOpacity,
          top: (lineY - lineHeight / 2) + 'px',
        }">
    </div>
  </div>
</template>

<script>
export default {
  props: ['mousePosition'],
  data() {
    return {
      lineColor: '#0095ff',
      lineOpacity: 0.1,
      lineY: 0,
      lineHeight: 32,
    };
  },
  watch: {
    mousePosition(mousePosition) {
      this.lineY = mousePosition.y;
    },
  },
};
</script>

<style>
.line {
  display: block;
  position: fixed;
  width: 100%;
}
</style>
