import { getApps } from './index'
import { importHTML } from './import-html'
import { getPrevRoute,getNextRoute } from './rewrite-router'

export const handleRouter = async () => {
     
  const apps = getApps()

  // 获取上一个应用
  const prevApp = apps.find((item) => {
    return getPrevRoute().startsWith(item.activeRule)
})


  // 获取下一个应用
  const app = apps.find((item) => {
    return getNextRoute().startsWith(item.activeRule)
  })

  // 如果又上一个应用先销毁
  if (prevApp) {
    await unmount(prevApp);
  }


  if (!app) {
    // 初始化应用，没有匹配到路由返回
    return
  }

  // 3. 加载子应用
  const { template, execScripts, getExternalScripts } = await importHTML(app.entry)
  const container = document.querySelector(app.container)
  container.appendChild(template)

  // 配置全局变量
  window.__POWERED_BY_QIANKUN__ = true;
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + '/';
 

  const appExports = await execScripts();

  app.bootstrap = appExports.bootstrap;
  app.mount = appExports.mount;
  app.unmount = appExports.unmount;



  // getExternalScripts().then((script) => {
  //    console.log(script);
     
  // })
  // 请求获取子应用的资源：html、css、js
  // const html = await fetch(app.entry).then(res => res.text())
  // const container = document.querySelector(app.container);
  // 1. 客户端渲染需要通过执行 JavaScript 来生成内容
  // 2. 浏览器出于安全考虑，innerHTML 中的 script 不会加载执行
  // container.innerHTML = html;


  // 手动加载子应用的 script
  // 执行 script 中的代码
  //eval 或 new Function”

  // 4. 渲染子应用
}

async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}

async function mount(app) {
  app.mount && (await app.mount({
    container: document.querySelector(app.container)
  }));
}

async function unmount(app) {
  app.unmount && (await app.unmount({
    container: document.querySelector(app.container)
  }));
}
