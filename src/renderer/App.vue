<template>
  <div>
    <div class="menu" v-if="page === '/menu'">
      <div class="menu-option">
        <label class="menu-option-label" for="rulerEnabled">Enable ruler (Ctrl+Alt+-)</label>
        <div class="menu-option-value">
          <input
              id="rulerEnabled"
              class="checkbox"
              type="checkbox"
              :checked="rulerEnabled"
              @input="handleRulerEnabledChanged($event.target.checked)">
        </div>
      </div>
      <div class="menu-option">
        <label class="menu-option-label" for="rulerHeight">Ruler height</label>
        <div class="menu-option-value">
          <input
              id="rulerHeight"
              class="input"
              :value="config.rulerHeight"
              @input="handleRulerHeightChanged($event.target.value)">
        </div>
      </div>
      <div class="menu-option">
        <label class="menu-option-label" for="rulerColor">Ruler color</label>
        <div class="menu-option-value">
          <div>
            <input
                id="rulerColor"
                type="color"
                class="color-input"
                :value="config.rulerColor"
                @input="handleRulerColorChanged($event.target.value)">
            <input
                class="input input-color"
                :value="config.rulerColor"
                @input="handleRulerColorChanged($event.target.value)">
          </div>
        </div>
      </div>
      <div class="menu-option">
        <label class="menu-option-label" for="rulerOpacity">Ruler opacity</label>
        <div class="menu-option-value">
          <input
              id="rulerOpacity"
              class="input"
              :value="config.rulerOpacity"
              @input="handleRulerOpacityChanged($event.target.value)">
        </div>
      </div>
      <div class="menu-option">
        <label class="menu-option-label" for="rulerInverted">Invert ruler</label>
        <div class="menu-option-value">
          <input
              id="rulerInverted"
              class="checkbox"
              type="checkbox"
              :checked="config.rulerInverted"
              @input="handleRulerInvertedChanged($event.target.checked)">
        </div>
      </div>
      <div class="menu-option">
        <div class="menu-option-label"></div>
        <div class="menu-option-value">
          <p>
            <span class="reset-button" @click="handleConfigReset">Reset</span>
          </p>
        </div>
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
    handleConfigReset() {
      this.$emit('configReset');
    },
  },
};
</script>

<style>
.menu {
  padding: 16px 18px;
}

.menu-option {
  display: flex;
  flex-direction: row;
  margin: 0 0 10px;
}

.menu-option-label {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  max-width: 50%;
  padding-right: 5px;
}

.menu-option-value {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  max-width: 50%;
  padding-left: 5px;
}

.reset-button {
  border: 0;
  background: none;
  border-radius: 5px;
  color: #999;
  cursor: pointer;
  display: inline-block;
  outline: 0;
}

.input {
  border: 0;
  border-radius: 5px;
  display: inline;
  margin: -4px -8px;
  max-width: 150px;
  outline: 0;
  padding: 4px 8px;
  width: 100%;
}

.input:hover,
.input:focus {
  background: #eee;
}

/* Add extra padding to fit color picker */
.input-color {
  padding-left: calc(8px + 20px);
  margin-left: -21px;
}

/* Assumes placed to the left of a .input */
.color-input {
  background: none;
  border: 0;
  border-radius: 5px;
  display: inline;
  float: left;
  height: 20px;
  margin: 0 -2px -4px;
  outline: 0;
  position: relative;
  top: -1px;
  width: 17px;
  z-index: 1;
}

.checkbox {
  margin: 1.5px 0 0 0;
}
</style>
