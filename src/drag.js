/*
  1、默认只在子元素可拖拽，孙元素默认无法拖拽，可通过添加class方式规定可拖拽元素,未来添加限制子元素拖拽功能。


*/

class Drag {
  constructor(drag, data, callBack, animation = false) {
    if (!drag) {
      return new Throw('未传入参数：drag');
    }
    drag.setAttribute('data-abc', '');
    // 此次实例的随机ID
    let randomID = Number(Math.random().toString().substr(3, 7) + Date.now()).toString(36);
    if (randomID.indexOf('.') >= 0) {
      randomID = randomID.match(/\.(.*)\(/)[1];
    }
    console.log(randomID);
    this.randomID = randomID;
    // 为容器元素添加自定义data属性
    try {
      drag.dataset[this.randomID] = '';
    } catch (e) {
      console.log(`data-${this.randomID}`);
      drag.setAttribute(`data-${this.randomID}`, true);
    }
    // console.log('set: ', drag.dataset);
    // if (drag.dataset) {
      
    // } else {
      
    // }
    let dragItems = drag.children;

    if (!drag.children.length) {
      console.warn('未发现子元素！');
      return;
    }

    if (!data) {
      console.warn('未传入data，将不会修改任何数据！');
    } else {
      this.data = data;
    }

    // 容器
    this.drag = drag;
    // 子元素
    this.dragItems = Array.from(dragItems);
    // 上次被撞元素正在移动中，transitionend事件结束后置为false代表碰撞有效
    this.isMovein = false;

    // 当前正在拖拽的元素
    this.dragItem = null;

    // 回调方法
    this.callBack = callBack;
    // 是否开启移动动画效果
    this.animation = animation;
    
    if (animation) {
       // 开启动画效果后计算距离
      this.itemWidth = null;
      this.itemHeight = null;
      this.positionList = [];

      // 计算每一项的宽高
      // 临时方案：计算宽高只取第一个chileren计算，这么做的话必须所有children宽高一样，否则会出问题!
      let itemInfo = dragItems[0].getBoundingClientRect();
      this.itemWidth = itemInfo.width;
      this.itemHeight = itemInfo.height;
      // 计算每行有多少个
      let parentWidth = dragItems[0].parentNode.getBoundingClientRect().width;
      let rowCount = parseInt(parentWidth / this.itemWidth);
      let positionList = [];
      for (let i = 0; i < dragItems.length; i++) {
        positionList.push({
          left: (i % rowCount) * this.itemWidth,
          top: Math.floor(i / rowCount) * this.itemHeight
        })
      }
      this.positionList = positionList;

      // 保存容器的宽高，用来拖拽时使宽高不为0
      const containerInfo = drag.getBoundingClientRect();

      const styleTag = document.createElement('style');

      styleTag.innerHTML = `
        .child-drag-in[data-${this.randomID}] {
          position: relative;
          width: ${containerInfo.width}px;
          height: ${containerInfo.height}px;
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleTag);
      this.styleTag = styleTag;
    }

    document.addEventListener('mouseup', this.recoveryDrag);
    let that = this;
    for (let i = 0; i < dragItems.length; i++) {
      const item = dragItems[i];
      item.setAttribute('draggable', true);
      item.setAttribute('drag-index', i);
      item.classList.add('drag-item');
      
      item.addEventListener('mousedown', this.disableDrag);
      item.addEventListener('mouseup', this.enableDrag);
      item.addEventListener('dragstart', this.handlerDragStart);
      item.addEventListener('dragover', this.handlerDragOver);
      item.addEventListener('dragend', this.handlerDragEnd);
    }
  }

  // 当按下子元素时判断是否为子元素或有无规定的class(allow-drag)来决定是否禁用拖拽
  disableDrag = ev => {
    const {target} = ev;
    // 是否为直接子元素
    const isChildren = this.dragItems.indexOf(target) >= 0;
    // 是否存在特殊的class
    const isEnable = Array.from(target.classList).indexOf('allow-drag') >= 0;

    if (!isChildren || !isEnable) {
      for (let item of this.dragItems) {
        item.setAttribute('draggable', false);
      }
    }
  }

  // 当鼠标抬起时恢复拖拽
  enableDrag = () => {
    for (let item of this.dragItems) {
      item.setAttribute('draggable', true);
    }
  };

  // 开始拖动
  handlerDragStart = ev => {
    const target = ev.target;
    this.drag.classList.add('child-drag-in');
    target.classList.add('dragin')
    this.dragItem = target;
    // 兼容firefox
    ev.dataTransfer.setData('text', this.dragItem.innerHTML);
    if (this.animation) {
      this.drag.style.position = 'relative';
      for (let i = 0; i < this.dragItems.length; i++) {
        let item = this.dragItems[i];
        item.style.transition = '.2s';
        item.style.position = 'absolute';
        item.style.zIndex = '100';
        item.style.left = this.positionList[i].left + 'px';
        item.style.top = this.positionList[i].top + 'px';
      }
    }
    target.style.zIndex = '101';
  };

  handlerDragEnd = ev => {
    // 结束拖动
    const target = ev.target;
    this.drag.classList.remove('child-drag-in');
    target.classList.remove('dragin');
    this.dragItem = null;
    this.isMovein = false;
    if (this.animation) {
      // this.drag.style.position = '';
      for (let i = 0; i < this.dragItems.length; i++) {
        let item = this.dragItems[i];
        item.style.transition = '';
        item.style.position = '';
        item.style.zIndex = '';
        item.style.left = '';
        item.style.top = '';
      }
    }
  };

  // 在被碰撞元素中移动
  handlerDragOver = ev => {
    const dropItem = ev.target;
    // 如果拖拽的不是子节点就return掉。
    if (this.dragItems.indexOf(dropItem) < 0) {
      return;
    }
    // 如果碰撞的是拖拽元素或者拖拽元素在移动动画中
    if (ev.target === this.dragItem || this.isMovein) {
      return;
    }
    // 拖拽元素：this.dragItem
    // 被撞元素：dropItem
    // 获取列表
    let items = this.drag.children;
    // 拖拽元素的index
    let dragIndex = Number(this.dragItem.getAttribute('drag-index'));
    // 被撞元素的index
    let dropIndex = Number(dropItem.getAttribute('drag-index'));
    if (this.animation) {
      // 有动画效果
      this.isMovein = true;
      let that = this;
      this.dragItem.addEventListener('transitionend', handlerTransitionend);
      // 修改dom数组顺序
      let removeItem = that.dragItems.splice(dragIndex, 1)[0];
      that.dragItems.splice(dropIndex, 0, removeItem);
      // 元素移动动画效果结束
      function handlerTransitionend() {
        // 修改dom元素顺序
        if (dragIndex < dropIndex) {
          that.drag.insertBefore(this, items[dropIndex + 1]);
        } else if (dragIndex > dropIndex) {
          that.drag.insertBefore(this, dropItem);
        }
        // 修改data的顺序
        if (that.data && that.data.length) {
          let dragDataItem = that.data.splice(dragIndex, 1)[0];
          that.data.splice(dropIndex, 0, dragDataItem);
          that.callBack && that.callBack(that.data, that.dragItems);
        }
        // 删除事件
        this.removeEventListener('transitionend', handlerTransitionend);
        that.isMovein = false;
      }
      for (let i = 0; i < this.dragItems.length; i++) {
        let item = this.dragItems[i];
        item.style.left = this.positionList[i].left + 'px';
        item.style.top = this.positionList[i].top + 'px';
        item.setAttribute('drag-index', i);
      }
    } else {
      // 无动画效果
      // 移动dom元素
      if (dragIndex < dropIndex) {
        this.drag.insertBefore(this.dragItem, items[dropIndex + 1]);
      } else {
        this.drag.insertBefore(this.dragItem, dropItem);
      }
      // 让this.dragItems的顺序和dom元素顺序保持一致
      let dragItem = this.dragItems.splice(dragIndex, 1)[0];
      this.dragItems.splice(dropIndex, 0, dragItem);
      // 处理data
      if (this.data && this.data.length) {
        let dragDataItem = this.data.splice(dragIndex, 1)[0];
        this.data.splice(dropIndex, 0, dragDataItem);
        this.callBack && this.callBack(this.data, this.dragItems);
      }

      for (let i = 0; i < this.dragItems.length; i++) {
        this.dragItems[i].setAttribute('drag-index', i);
      }
    }
  }

  clear() {
    for (let item of this.dragItems) {
      document.getElementsByTagName('head')[0].removeChild(this.styleTag);
      item.removeAttribute('draggable');
      item.removeAttribute('drag-index');
      item.classList.remove('drag-item');

      item.removeEventListener('dragstart', this.handlerDragStart);
      item.removeEventListener('dragover', this.handlerDragOver);
      item.removeEventListener('dragend', this.handlerDragEnd);
    }
  }

  reload() {

  }
}

export default Drag;