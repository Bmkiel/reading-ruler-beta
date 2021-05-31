import * as electron from 'electron';
import Vue from 'vue';

import App from './App.vue';
import './main.css';

const model = {
  page: '/',
  mousePosition: {
    x: 0,
    y: 0,
  },
  rulerEnabled: true,
};

const app = new Vue({
  el: '#app',
  components: {
    App,
  },
  data() {
    return model;
  },
  template: `
    <App
        :page="page"
        :mousePosition="mousePosition"
        :rulerEnabled="rulerEnabled"
        />
  `,
});

document.body.style.background = 'none';

electron.ipcRenderer.on('setPage', (event, {page}) => {
  console.log(page);
  model.page = page;
});

electron.ipcRenderer.on('mouseMove', (event, {mousePosition}) => {
  model.mousePosition = mousePosition;
});

electron.ipcRenderer.on('mouseDown', (event) => {});

electron.ipcRenderer.on('mouseUp', (event) => {});

electron.ipcRenderer.on('toggleRuler', (event) => {
  model.rulerEnabled = !model.rulerEnabled;
});
