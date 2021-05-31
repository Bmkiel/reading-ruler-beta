<template>
  <div>
    <div class="menu" v-if="page === '/menu'">
      <div>
        <label>Ruler height</label>
        <input v-model="rulerHeight">
      </div>
      <div>
        <label>Ruler color</label>
        <input v-model="rulerColor">
      </div>
      <div>
        <label>Ruler opacity</label>
        <input v-model="rulerOpacity">
      </div>
    </div>
    <div class="overlay" v-if="page === '/overlay'">
      <div
          class="ruler"
          :style="{
            background: 'linear-gradient(90deg, rgba(0,0,0,0), ' + rulerColor + ', ' + rulerColor + ', ' + rulerColor + ', ' + rulerColor + ', rgba(0,0,0,0))',
            height: rulerHeight + 'px',
            opacity: rulerEnabled ? rulerOpacity : 0,
            top: (rulerY - rulerHeight / 2) + 'px',
          }">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'page',
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
  transition: top .05s, opacity .15s;
  width: 100%;
}
</style>
