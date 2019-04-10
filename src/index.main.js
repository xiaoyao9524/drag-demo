import '@babel/polyfill';
import "./scss/reset.scss";
import "./scss/index2.scss";

import FastClick from 'fastclick';
FastClick.attach(document.body);

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


class Drag {
  constructor(drag, data, animation = false) {
    if (!drag) {
      new Throw('未传入参数：drag');
      return;
    }
    let dragItems = drag.children;

    if (!drag.children.length) {
      return;
    }
    if (!data) {
      console.warn('未传入data，将不会修改数据！');
    } else {
      this.data = data;
    }
    // 是否开启移动动画效果
    this.animation = animation;

    this.drag = drag;
    this.dragItems = Array.from(dragItems);

    // 上次被撞元素，用来限制事件触发次数
    this.prevDragEle = null;

    // 上次被撞元素正在移动中，transitionend事件结束后置为false代表碰撞有效
    this.isMovein = false;

    // 当前正在拖拽的元素
    this.dragItem = null;

    // 开启动画效果后计算距离
    this.itemWidth = null;
    this.itemHeight = null;
    this.positionList = [];

    if (animation) {
      // 计算每一项的宽高
      let itemInfo = dragItems[0].getBoundingClientRect();
      // console.log('itemInfo: ', itemInfo);
      this.itemWidth = itemInfo.width;
      this.itemHeight = itemInfo.height;
      // 计算每行有多少个
      let parentWidth = dragItems[0].parentNode.getBoundingClientRect().width;
      let rowCount = parseInt(parentWidth / this.itemWidth);
      // console.log('每行的个数：', rowCount);
      let positionList = [];
      for (let i = 0; i < dragItems.length; i++) {
        positionList.push({
          left: (i % rowCount) * this.itemWidth,
          top: Math.floor(i / rowCount) * this.itemHeight
        })
      }
      console.log('pl: ', positionList);
      this.positionList = positionList;
    }

    for (let i = 0; i < dragItems.length; i++) {
      let item = dragItems[i];
      item.setAttribute('draggable', true);
      item.setAttribute('drag-index', i);
      item.classList.add('drag-item');

      item.addEventListener('dragstart', this.handlerDragStart);
      item.addEventListener('dragover', this.handlerDragOver);
      item.addEventListener('dragend', this.handlerDragEnd);
      // item.addEventListener('dragleave', this.handlerDragleave)
    }
  }

  // 开始拖动
  handlerDragStart = ev => {
    const target = ev.target;
    target.classList.add('dragin')
    this.dragItem = target;

    /*
    if (this.animation) {
      drag.style.position = 'relative';
      for (let i = 0; i < this.dragItems.length; i++) {
        let item = this.dragItems[i];
        item.style.transition = '.2s';
        item.style.position = 'absolute';
        item.style.left = this.positionList[i].left + 'px';
        item.style.top = this.positionList[i].top + 'px';
      }
    }
    */
  }

  handlerDragEnd = ev => {
    // 结束拖动
    const target = ev.target;
    target.classList.remove('dragin');
    this.dragItem = null;
    this.prevDragEle = null;
/*
    if (this.animation) {
      drag.style.position = '';
      for (let i = 0; i < this.dragItems.length; i++) {
        let item = this.dragItems[i];
        item.style.transition = '';
        item.style.position = '';
        item.style.left = '';
        item.style.top = '';
      }
    }
*/
  }

  // 在被碰撞元素中移动
  handlerDragOver = ev => {
    const dropItem = ev.target;
    // 如果碰撞的是拖拽元素或者拖拽元素在移动动画中
    if (dropItem === this.dragItem || this.isMovein) {
      return;
    }
    // if (dropItem === this.prevDragEle) {
    //   return;
    // }
    // this.prevDragEle = dropItem;
    // 拖拽元素：this.dragItem
    // 被撞元素：dropItem
    // 获取列表
    let items = this.drag.children;
    // 拖拽元素的index
    let dragItemIndex = Number(this.dragItem.getAttribute('drag-index'));
    // 被撞元素的index
    let dropIndex = Number(dropItem.getAttribute('drag-index'));

    if (this.animation) {
      // 有动画效果
      let removeItem = this.dragItems.splice(dragItemIndex, 1)[0];
      
      this.dragItems.splice(dropIndex, 0, removeItem);
      this.isMovein = true;
      let that = this;
      setTimeout(() => {
        that.isMovein = false;
      }, 50);
      for (let i = 0; i < this.dragItems.length; i++) {
        // if (item === this.dragItem) {
        //   continue;
        // }
        let item = this.dragItems[i];
        item.style.left = this.positionList[i].left + 'px';
        item.style.top = this.positionList[i].top + 'px';
        item.setAttribute('drag-index', i);
      }
    } else {
      // 无动画效果
      // 移动dom元素
      if (dragItemIndex < dropIndex) {
        this.drag.insertBefore(this.dragItem, items[dropIndex + 1]);
      } else {
        this.drag.insertBefore(this.dragItem, dropItem);
      }
      // 让this.dragItems的顺序和dom元素顺序保持一致
      let dragItem = this.dragItems.splice(dragItemIndex, 1)[0];
      this.dragItems.splice(dropIndex, 0, dragItem);
      console.log('移动完成：', this.dragItems);
      // 处理data
      if (this.data && this.data.length) {
        let dragDataItem = this.data.splice(dragItemIndex, 1)[0];
        this.data.splice(dropIndex, 0, dragDataItem);
        console.log('当前data的顺序：', this.data.map(i => i.title).join('、'));
      }
      
      for (let i = 0; i < this.dragItems.length; i++) {
        this.dragItems[i].setAttribute('drag-index', i);
      }
    }
  }

  // handlerDragleave = ev => {
  //   if (ev.dropItem === this.prevDragEle) {
  //     this.prevDragEle = null;
  //   }
  // }
}

let list = document.querySelector('#list');

let html = '';

for (let i = 0; i < data.length; i++) {
  let item = data[i];
  html += `<li class="item" style="background-color: ${item.bg}">${i} ${item.title}</li>`;
}

list.innerHTML = html;

new Drag(list, data);
