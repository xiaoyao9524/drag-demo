// 生成随机字符串ID
export function randomString(len = 32) {
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export function addClass(el, className) {
  if (!el || !className) {
    return;
  }
  if (el.classList) {
    el.classList.add(className);
    return;
  }

  const classStr = el.className.trim();

  const classList = classStr
    ? classStr.split(" ")
    : [];
  classList.push(className);
  el.className = classList.join(" ");
}

export function removeClass(el, className) {
  if (!el || !className) {
    return;
  }
  if (el.classList) {
    el.classList.remove(className);
    return;
  }

  const classStr = el.className.trim();

  const classList = classStr
    ? classStr.split(" ")
    : [];

  const indexOf = classList.indexOf(className);
  
  if (indexOf >= 0) {
    classList.splice(indexOf, 1);
  }
  el.className = classList.join(" ");
}
