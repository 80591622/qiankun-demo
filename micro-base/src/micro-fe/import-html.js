import { fetchResource } from "./fetch-resource";

// https://github.com/kuitos/import-html-entry
export const importHtml = async(url) => {
  const html = await fetchResource(url);
  const template = document.createElement('div');
  template.innerHTML = html;

  // 获取所有 script 标签的代码: [代码, 代码]
  function getExternalScripts() {
    const scripts = document.querySelectorAll('script');
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src');
      if (!src) {
        return Promise.resolve(script.innerHTML);
      } else {
        return fetchResource(
          src.startsWith('http')? src : `${url}${src}`
        );
      }
    }));
  }

  // 获取并执行 script 标签的代码
  const execScripts = async(el) => {
    const scripts = await getExternalScripts();

    // 手动构造一个 CommonJs 环境
    const module = { exports: {} };
    const exports = module.exports;

    scripts.forEach((code) => {
      // eval 执行的代码可以访问全局变量
      eval(code);
    });

    return module.exports;
  }

  return {
    template,
    execScripts,
    getExternalScripts
  }
}