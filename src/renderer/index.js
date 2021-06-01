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
  },
});

electron.ipcRenderer.on('setConfig', (event, {config}) => {
  app.config = config;
});

electron.ipcRenderer.on('setPage', (event, {page}) => {
  app.page = page;
});

electron.ipcRenderer.on('mouseMove', (event, {mousePosition}) => {
  app.mousePosition = mousePosition;
});

electron.ipcRenderer.on('mouseDown', (event) => {});

electron.ipcRenderer.on('mouseUp', (event) => {});

electron.ipcRenderer.on('setRulerEnabled', (event, {rulerEnabled}) => {
  app.rulerEnabled = rulerEnabled;
});
