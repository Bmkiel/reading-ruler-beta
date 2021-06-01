<template>
  <div>
    <div class="menu" v-if="page === '/menu'">
      <div>
        <label>
          Enable ruler (Ctrl+Alt+-)
          <input type="checkbox" :checked="rulerEnabled" @input="handleRulerEnabledChanged($event.target.checked)">
        </label>
      </div>
      <div>
        <label>
          Ruler height
          <input type="number" :value="config.rulerHeight" @input="handleRulerHeightChanged($event.target.value)">
        </label>
      </div>
      <div>
        <label>
          Ruler color
          <input :value="config.rulerColor" @input="handleRulerColorChanged($event.target.value)">
        </label>
      </div>
      <div>
        <label>
          Ruler opacity
          <input :value="config.rulerOpacity" @input="handleRulerOpacityChanged($event.target.value)">
        </label>
      </div>
      <div>
        <label>
          Invert ruler
          <input type="checkbox" :checked="config.rulerInverted" @input="handleRulerInvertedChanged($event.target.checked)">
        </label>
      </div>
    </div>
    <div class="overlay" v-if="page === '/overlay'">
      <Ruler
          :top="rulerY"
          :color="config.rulerColor"
          :height="config.rulerHeight"
          :opacity="rulerEnabled ? config.rulerOpacity : 0"
          :inverted="config.rulerInverted"
          />
    </div>
  </div>
</template>

<script>
import Ruler from './Ruler.vue';

export default {
  props: {
    page: String,
    mousePosition: {
      x: Number,
      y: Number,
    },
    rulerEnabled: Boolean,
    config: Object,
  },
  data() {
    return {
      rulerY: 0,
    };
  },
  components: {
    Ruler,
  },
  watch: {
    mousePosition(mousePosition) {
      this.rulerY = mousePosition.y;
    },
  },
  methods: {
    handleRulerEnabledChanged(rulerEnabled) {
      this.$emit('rulerEnabledChanged', rulerEnabled);
    },
    handleRulerHeightChanged(rulerHeight) {
      this.$emit('configChanged', {
        ...this.config,
        rulerHeight: rulerHeight,
      });
    },
    handleRulerColorChanged(rulerColor) {
      this.$emit('configChanged', {
        ...this.config,
        rulerColor: rulerColor,
      });
    },
    handleRulerOpacityChanged(rulerOpacity) {
      this.$emit('configChanged', {
        ...this.config,
        rulerOpacity: rulerOpacity,
      });
    },
    handleRulerInvertedChanged(rulerInverted) {
      this.$emit('configChanged', {
        ...this.config,
        rulerInverted: rulerInverted,
      });
    },
  },
};
</script>

<style>
</style>
