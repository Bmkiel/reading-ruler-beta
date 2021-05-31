import * as electron from 'electron';
import Vue from 'vue';

import App from './App.vue';
import './main.css';

const model = {
  mousePosition: {
    x: 0,
    y: 0,
  },
};

const app = new Vue({
  el: '#app',
  components: {
    App,
  },
  data() {
    return model;
  },
  template: `<App :mousePosition="mousePosition" />`,
});

document.body.style.background = 'none';

electron.ipcRenderer.on('mouseMove', (event, mousePosition) => {
  model.mousePosition = mousePosition;
});

electron.ipcRenderer.on('mouseDown', (event) => {});

electron.ipcRenderer.on('mouseUp', (event) => {});
