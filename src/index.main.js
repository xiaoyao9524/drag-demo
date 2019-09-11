import "./scss/reset.scss";
import "./scss/index2.scss";

import FastClick from 'fastclick';
FastClick.attach(document.body);

import Drag from './Drag'

let data = [
  {
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
  html += `<li class="item allow-drag" style="background-color: ${item.bg}">${i} ${item.title}</li>`;
}

list.innerHTML = html;
function cb1 (data, items) {
  // console.log('cb1: ', data, items);
}
const drag1 = new Drag(list, data, cb1, true);

console.log(drag1);

let list2 = document.querySelector('.list2');
let data2 = ['item1', 'item2', 'item3', 'item4', 'item5'];
let html2 = '';
for (let item of data2) {
  html2 += `
    <li class="item">
      ${item}
      <button class="">删除</button>
    </li>`;
}
list2.innerHTML = html2;

function cb2 (data, items) {
  // console.log('cb2: ', data.join('、'), items);
}

let drag2 = new Drag(list2, data2, cb2, true);
