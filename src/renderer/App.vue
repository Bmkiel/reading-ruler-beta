<template>
  <div>
    <div class="menu" v-if="page === '/menu'">
      <div>
        <label>Ruler height</label>
        <input :value="config.rulerHeight" @input="handleRulerHeightChange($event.target.value)">
      </div>
      <div>
        <label>Ruler color</label>
        <input :value="config.rulerColor" @input="handleRulerColorChange($event.target.value)">
      </div>
      <div>
        <label>Ruler opacity</label>
        <input :value="config.rulerOpacity" @input="handleRulerOpacityChange($event.target.value)">
      </div>
    </div>
    <div class="overlay" v-if="page === '/overlay'">
      <div
          class="ruler"
          :style="{
            background: 'linear-gradient(90deg, rgba(0,0,0,0), ' + config.rulerColor + ', ' + config.rulerColor + ', ' + config.rulerColor + ', ' + config.rulerColor + ', rgba(0,0,0,0))',
            height: config.rulerHeight + 'px',
            opacity: rulerEnabled ? config.rulerOpacity : 0,
            top: (rulerY - config.rulerHeight / 2) + 'px',
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
    'config',
  ],
  data() {
    return {
      rulerY: 0,
    };
  },
  watch: {
    mousePosition(mousePosition) {
      this.rulerY = mousePosition.y;
    },
  },
  methods: {
    handleRulerHeightChange(rulerHeight) {
      this.$emit('configChanged', {
        ...this.config,
        rulerHeight: rulerHeight,
      });
    },
    handleRulerColorChange(rulerColor) {
      this.$emit('configChanged', {
        ...this.config,
        rulerColor: rulerColor,
      });
    },
    handleRulerOpacityChange(rulerOpacity) {
      this.$emit('configChanged', {
        ...this.config,
        rulerOpacity: rulerOpacity,
      });
    },
  },
};
</script>

<style>
.ruler {
  display: block;
  position: fixed;
  transition: top .05s, height .1s, color .15s, opacity .15s;
  width: 100%;
}
</style>
