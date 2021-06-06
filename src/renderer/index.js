// Copyright (C) 2021 Carl Enlund
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as electron from 'electron';
import Vue from 'vue';

import App from './App.vue';
import './main.css';

const app = new Vue({
  el: '#app',
  components: {
    App,
  },
  data() {
    return {
      page: '/',
      mousePosition: {
        x: 0,
        y: 0,
      },
      rulerEnabled: true,
      config: {
        rulerColor: '#000',
        rulerOpacity: 1,
        rulerHeight: 40,
        rulerInverted: false,
      },
    };
  },
  template: `
    <App
        :page="page"
        :mousePosition="mousePosition"
        :rulerEnabled="rulerEnabled"
        :config="config"
        @rulerEnabledChanged="handleRulerEnabledChanged"
        @configChanged="handleConfigChanged"
        @configReset="handleConfigReset"
        />
  `,
  methods: {
    handleRulerEnabledChanged(rulerEnabled) {
      this.rulerEnabled = rulerEnabled;
      electron.ipcRenderer.send('rulerEnabledChanged', {
        rulerEnabled: this.rulerEnabled,
      });
    },
    handleConfigChanged(config) {
      this.config = config;
      electron.ipcRenderer.send('configChanged', {
        config: this.config,
      });
    },
    handleConfigReset() {
      electron.ipcRenderer.send('configReset');
    },
  },
});

window.addEventListener('keydown', (event) => {
  // Disable zoom.
  const plus = 187;
  const minus = 189;
  if ((event.keyCode === plus || event.keyCode === minus) &&
      (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
  }
});

electron.ipcRenderer.on('setConfig', (event, {config}) => {
  app.config = config;
});

electron.ipcRenderer.on('setPage', (event, {page}) => {
  console.log('Go to page', page);
  app.page = page;
});

electron.ipcRenderer.on('setMousePosition', (event, {mousePosition}) => {
  app.mousePosition = mousePosition;
});

electron.ipcRenderer.on('setRulerEnabled', (event, {rulerEnabled}) => {
  app.rulerEnabled = rulerEnabled;
});
