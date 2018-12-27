const $k = (arg) => {
  const toExecute = [];
  if (arg instanceof HTMLElement) {
    return new DOMNodeCollection([arg]);
  } else if (typeof arg === "string") {
    const nodes = document.querySelectorAll(arg);
    const nodesArr = Array.from(nodes);
    return new DOMNodeCollection(nodesArr);
  } else if (arg instanceof Function) {
    toExecute.push(arg);
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        toExecute.forEach((func) => func());
      }
    }, 100);
  }
};

$k.extend = function (firstObject, ...objects) {
  const merged = Object.assign(firstObject, ...objects);
  return merged;
};

$k.ajax = function (options) {
  let defaultObject = {
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    url: "",
    method: 'GET',
  };
  
  options = Object.assign(defaultObject, options);
  if (options.method === "GET") {
    options.url += `${toQueryString(options.data)}`;
  }

  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    xhr.onload = function (e) {
      const jsonResponse = JSON.parse(xhr.response);
      if (xhr.status === 200) {
        resolve(jsonResponse);
      } else {
        reject(jsonResponse);
      }
    };
    xhr.send(JSON.stringify(options.data));
  });
  
  // const p = new Promise((resolve, reject) => {
  //   if (xhr.status === 200) {
  //     resolve(/* any args */);
  //   } else {
  //     reject(/* any args */);
  //   }
  // });
};

const toQueryString = (obj) => {
  let queryString = "?";
  for (let i = 0; i < Object.keys(obj).length; i++) {
    const key = Object.keys(obj)[i];
    const data = obj[key];
    queryString += `${key}=${data}&`;
  }
  if (queryString.length > 1)
    return queryString.slice(0, queryString.length-1);
  else return "";
};

class DOMNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

  html(string) {
    if (typeof string === 'undefined') {
      return this.nodes[0].innerHTML;
    } else {
      this.nodes.forEach( (node) => {
        node.innerHTML = string;
      });
    }
  }

  empty() {
    this.html("");
  }


  append(children) {
    if (this.nodes.length === 0) return;
    if (typeof children === 'object' && !(children instanceof DOMNodeCollection))
      children = $k(children);

    if (typeof children === 'string') {
      this.nodes.forEach(node => {
        node.innerHTML += children;
      });
    } else if (children instanceof DOMNodeCollection) {
      this.nodes.forEach(domNode => {
        children.nodes.forEach(childNode => {
          domNode.appendChild(childNode.cloneNode(true));
        });
      });
    }
  }

  attr(attributeName, value) {
    if (!value) {
      return this.nodes[0].getAttribute(attributeName);
    } else {
      this.nodes.forEach((node) => {
        node.setAttribute(attributeName, value);
      });
    }
  }

  addClass(classNames) {
    const classes = classNames.split(" ");
    this.nodes.forEach((node) =>{
      node.classList.add(...classes);
    });
  }

  removeClass(classNames) {
    const classes = classNames.split(" ");
    this.nodes.forEach((node) =>{
      node.classList.remove(...classes);
    });
  }

  children() {
    let children = [];

    this.nodes.forEach( (node) => {
      children = children.concat(Array.from(node.children));
    });
    return new DOMNodeCollection(children);
  }

  parent() {
    let parents = [];

    this.nodes.forEach ( (node) => {
      parents = parents.concat([node.parentElement]);
     });
    return new DOMNodeCollection(parents);
  }

  find(queryString) {
    let found = [];

    this.nodes.forEach ( (node) => {
      found = found.concat(node.querySelectorAll(queryString));
    });
    return found;
  }

  remove() {
    this.nodes.forEach ( (node) => {
      node.innerHTML = "";
    });
    this.nodes = [];
  }

  on(event, callback) {
    this.nodes.forEach ( (node) => {
      node.addEventListener(event, callback);
      node.callback = callback;
    });
  }

  off(event) {
    this.nodes.forEach ( (node) => {
      node.removeEventListener(event, node.callback);
    });
  }
}

export default $k;