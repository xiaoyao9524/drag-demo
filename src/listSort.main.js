import "./scss/reset.scss";
import "./scss/index.scss";

import FastClick from 'fastclick';
FastClick.attach(document.body);

let data = [
  {
    id: 1,
    title: '列表0'
  },
  {
    id: 2,
    title: '列表1'
  },
  {
    id: 3,
    title: '列表2'
  },
  {
    id: 4,
    title: '列表3'
  },
  {
    id: 5,
    title: '列表4'
  }
];


class Drag {
  constructor (dragItems, data) {
    // 当前正在拖拽的元素
    this.currentDragItem = null;

    for (let i = 0; i < dragItems.length; i++) {
      let item = dragItems[i];
      item.setAttribute('draggable', true);
      item.setAttribute('drag-index', i);
      item.classList.add('drag-item');
      item.addEventListener('dragstart', this.handlerDragStart);
      item.addEventListener('dragenter', this.handlerDragEnter);
      item.addEventListener('dragend', this.handlerDragEnd);
    }
  }

  handlerDragStart = ev => {
    const target = ev.target;
    target.classList.add('dragin')
    this.currentDragItem = target;
  }

  handlerDragEnd = ev => {
    const target = ev.target;
    target.classList.remove('dragin');
    this.currentDragItem = null;
  }

  handlerDragEnter = ev => {
    const target = ev.target;
    if (target === this.currentDragItem) {
      return;
    }

    let parent = target.parentNode;

    // 拖拽元素：this.currentDragItem
    // 被撞元素：target

    // 获取列表
    let items = parent.querySelectorAll('.drag-item');
    // 被撞元素的index
    let index = Number(target.getAttribute('drag-index'));
    // 将拖拽元素插入到被撞元素的位置
    if (this.currentDragItem.getAttribute('drag-index') < target.getAttribute('drag-index')) {
      parent.insertBefore(this.currentDragItem, items[index + 1]);
    } else {
      parent.insertBefore(this.currentDragItem, target)
    }
    let items2 = parent.querySelectorAll('.drag-item');
    for (let i = 0; i < items2.length; i++) {
      items2[i].setAttribute('drag-index', i);
    }
  }


}

let list = document.querySelector('.list');
let html = '';
for (let item of data) {
  html += `<li class="item">${item.title}</li>`;
}
list.innerHTML = html;
let items = list.querySelectorAll('.item');

new Drag(items, data);
