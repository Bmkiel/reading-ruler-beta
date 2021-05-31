<template>
  <div>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['mousePosition'],
  data() {
    return {
      canvas: null,
      ctx: null,
    };
  },
  mounted() {
    console.log(Vue);
    this.canvas = this.$refs.canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
  },
  watch: {
    mousePosition(mousePosition) {
      this.renderCanvas();
    },
  },
  methods: {
    renderCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderLine();
    },
    renderLine() {
      this.ctx.fillStyle = '#000000';
      this.ctx.globalAlpha = 0.05;
      const size = 20;
      this.ctx.fillRect(
          0, this.mousePosition.y - size / 2, this.canvas.width, size);
    }
  },
};
</script>

<style>
.canvas {
  display: block;
  overflow: hidden;
  width: 100%;
}
</style>
