<template>
  <div class="overlay">
    <div
        class="line"
        :style="{
          height: lineHeight + 'px',
          top: (lineY - lineHeight / 2) + 'px',
        }">
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['mousePosition'],
  data() {
    return {
      lineY: 0,
      lineHeight: 30,
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
  background: rgba(0,0,0,.05);
  display: block;
  height: 30px;
  position: fixed;
  width: 100%;
}
</style>
