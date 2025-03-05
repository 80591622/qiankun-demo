
import { handleRouter } from './handle-router.js';
import { rewriteRouter } from './rewrite-router.js';

// {name, entry, container, activeRule, bootstrap, mount, unmount}
let _apps = [];

export const getApps = (apps) => _apps;

export const registerMicroApp = (apps) => {

  _apps = apps;
}

export const start = () => {
  // 微前端原理
  // 1. 监视路由变化
  //  hash 路由：windows.onhashchange
  //  history 
  //    history.go、history.back、history.forward、history.pushState、history.replaceState  
  //      事件：windows.popstate
  //      history.pushState、history.replaceState  需要通过函数重写的方式进行劫持

  rewriteRouter();

  // 初始化执行匹配
  handleRouter();

}