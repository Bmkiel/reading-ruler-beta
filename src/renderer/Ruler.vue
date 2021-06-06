<!--
Copyright (C) 2021 Carl Enlund

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <div
      class="ruler"
      :style="{
        top: (top - height / 2) + 'px',
        opacity: clampedOpacity,
      }">
    <div v-if="inverted">
      <div
          class="ruler-box ruler-box-top"
          :style="{
            background: color,
            top: `calc(-100vh)`,
          }">
      </div>
      <div
          class="ruler-box ruler-box-bottom"
          :style="{
            background: color,
            top: `calc(-100vh + ${height}px)`,
          }">
      </div>
    </div>
    <div v-else>
      <div
          class="ruler-line"
          :style="{
            background: fadedColor,
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
    fadedColor() {
      return `linear-gradient(90deg, rgba(0,0,0,0), ${this.color}, ${this.color}, ${this.color}, ${this.color}, ${this.color}, rgba(0,0,0,0))`;
    },
    clampedOpacity() {
      const maxRulerOpacity = 0.85;
      return Math.max(0, Math.min(maxRulerOpacity, this.opacity));
    }
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
