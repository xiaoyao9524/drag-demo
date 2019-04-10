import 'babel-polyfill';
import "./scss/reset.scss";
import "./scss/index.scss";
// import $ from 'jquery';

import FastClick from 'fastclick';
FastClick.attach(document.body);

let tip = document.querySelector('.tip');

let list = document.querySelector('.list');
let items = list.querySelectorAll('.item');

let dragEle = null;

items.forEach((item) => {
  item.addEventListener('dragstart', function (ev) {
    ev.dataTransfer.setData('text', ev.target.innerHTML);
    // ev.dataTransfer.setDragImage(ev.target, 0, 0);
    dragEle = ev.target;
    // console.log('开始拖拽：', this.innerHTML);
    tip.innerHTML = `开始拖拽：${this.innerHTML}`;
  })

  item.addEventListener('drag', function (ev) {
    // console.log('正在拖拽：', this.innerHTML);
    // tip.innerHTML = `正在拖拽：${this.innerHTML}`;
  })

  item.addEventListener('dragend', function (ev) {
    // console.log('停止拖拽：', this.innerHTML);
    // tip.innerHTML = `停止拖拽：${this.innerHTML}`;
  })
})

let dustbin = document.querySelector('.dustbin');

dustbin.addEventListener('dragenter', function (ev) {
  // console.log('进入了垃圾桶', ev.target);
  // console.log('进入了垃圾桶---add');
  dustbin.classList.add('white');
})

dustbin.addEventListener('dragover', function (ev) {
  // console.log('在垃圾桶里移动');
  // console.log('在垃圾桶里移动', ev.target);
  ev.preventDefault();
  // 获取当前所选拖放操作的类型，或将拖拽操作设置为新类型。值必须为none，copy，link或move中的一个。
  // ev.dataTransfer.dropEffect = 'move';
  // 提供可能的所有类型的操作。必须是none，copy，copyLink，copyMove，link，linkMove，move，all或uninitialized中的一个。
  // ev.dataTransfer.effectAllowed = 'all'
})

dustbin.addEventListener('dragleave', function (ev) {
  console.log('离开垃圾桶---remove');
  dustbin.classList.remove('white');
})

document.addEventListener('drop', function (ev) {
  console.log('扔进垃圾桶');
  ev.preventDefault();
  dustbin.classList.remove('white');
  list.removeChild(dragEle);
  tip.innerHTML = `${dragEle.innerHTML}被扔进了垃圾桶`;
})