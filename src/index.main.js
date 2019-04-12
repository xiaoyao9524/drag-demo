import "./scss/reset.scss";
import "./scss/index2.scss";

import FastClick from 'fastclick';
FastClick.attach(document.body);

import Drag from './drag'

let data = [{
    title: 'Aquamarine',
    bg: 'aquamarine'
  },
  {
    title: 'Hotpink',
    bg: 'hotpink'
  },
  {
    title: 'Gold',
    bg: 'gold'
  },
  {
    title: 'Crimson',
    bg: 'crimson'
  },
  {
    title: 'Blueviolet',
    bg: 'blueviolet'
  },
  {
    title: 'Lightblue',
    bg: 'lightblue'
  },
  {
    title: 'Cornflowerblue',
    bg: 'cornflowerblue'
  },
  {
    title: 'Skyblue',
    bg: 'skyblue'
  },
  {
    title: 'Burlywood',
    bg: 'burlywood'
  }
];

let list = document.querySelector('#list');

let html = '';

for (let i = 0; i < data.length; i++) {
  let item = data[i];
  html += `<li class="item" style="background-color: ${item.bg}">${i} ${item.title}</li>`;
}

list.innerHTML = html;

new Drag(list, data, true);
