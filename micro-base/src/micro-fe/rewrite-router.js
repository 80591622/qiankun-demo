
import { handleRouter } from './handle-router.js';


let prevRoute = ''
let nextRoute = window.location.pathname

export const getPrevRoute = () => prevRoute
export const getNextRoute = () => nextRoute

export const rewriteRouter = () => {
  
  // 监听 popstate 事件
  window.addEventListener('popstate', () => { 
    console.log('popstate');
    // popstate 事件触发时，路由已经完成导航
    // 假设prevRoute之前已经定义过，这里获取变化前的路由
    prevRoute = nextRoute; 
    nextRoute = window.location.pathname; // 最新的    
    handleRouter();
  });
  
  // 重写 pushState 方法
  const rawPushState = window.history.pushState;
  window.history.pushState = (...args) => {

    // 导航前
    prevRoute = window.location.pathname
    rawPushState.apply(window.history, args); // 改变历史路由
    nextRoute = window.location.pathname

    // 导航后
    handleRouter();

  };
  
  // 重写 replaceState 方法
  const rawReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    prevRoute = window.location.pathname
    rawReplaceState.apply(window.history, args);
    nextRoute = window.location.pathname  
    handleRouter();
  };
}


