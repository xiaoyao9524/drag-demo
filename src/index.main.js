import "./scss/reset.scss";
import "./scss/index2.scss";

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
  html += `<li class="item" style="background-color: ${item.bg}">${i} ${item.title}</li>`;
}

list.innerHTML = html;
function cb1 (data, items) {
  console.log('list1回调: ', data, items);
}
const drag1 = new Drag(list, data, cb1, true);

const toggleList1DragBtn = document.querySelector('.toggle-list1-drag');
let list1DragIn = true;
toggleList1DragBtn.addEventListener('click', function () {
  list1DragIn = !list1DragIn;
  if (list1DragIn) {
    this.innerHTML = '取消拖拽';
    drag1.install();
  } else {
    this.innerHTML = '恢复拖拽';
    drag1.destroy();
  }
 
});

let list2 = document.querySelector('.list2');
let data2 = [1, 2, 3, 4, 5];
let html2 = '';
for (let item of data2) {
  html2 += `
    <li class="item">
      item${item}
      <button class="remove-btn">删除</button>
    </li>`;
}
list2.innerHTML = html2;



for (let item of Array.from(list2.children)) {
  const removeBtn = item.querySelector('.remove-btn');
  removeBtn.addEventListener('click', removeItem);
}

function cb2 (data, items) {
  console.log('list2回调: ', data, items);
}

let drag2 = new Drag(list2, data2, cb2, true);

function removeItem () {
  const item = this.parentNode;
  const index = Array.from(list2.children).indexOf(item);
  console.log('iii: ', index);
  data2.splice(index, 1);
  list2.removeChild(item);

  console.log(data2);
  
  drag2.reLoad();
}

const addList2ItemBtn = document.querySelector('.add-list2-item');

addList2ItemBtn.addEventListener('click', function () {
  let nextNum = Math.max(...data2) + 1;
  data2.push(nextNum);
  console.log(data2);
  const liItem = document.createElement('li');
  liItem.className = 'item';
  liItem.innerHTML = `
    item${nextNum}
    <button class="remove-btn">删除</button>
  `;
  const removeBtn = liItem.querySelector('.remove-btn');
  removeBtn.addEventListener('click', removeItem);
  list2.appendChild(liItem);

  drag2.reLoad();
})


