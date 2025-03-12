/**
 *
 * @param {vuex实例} store
 * @param {qiankun下发的props} props
 * @param {vue-router实例} router
 * @param {Function} resetRouter - 重置路由方法
 */
function registerCommonModule(store, props = {}, router, resetRouter) {
  if (!store || !store.hasModule) {
      return;
  }

  // 获取初始化的state
  // eslint-disable-next-line no-mixed-operators
  const initState = (props.getGlobalState && props.getGlobalState()) || {
      menu: null, // 菜单
      user: {}, // 用户
      auth: {}, // token权限
      app: 'main' // 启用应用名，默认main(主应用)，区分各个应用下，如果运行的是pms，则是pms，用于判断路由
  };

  // 将父应用的数据存储到子应用中，命名空间固定为common
  if (!store.hasModule('common')) {
      const commonModule = {
          namespaced: true,
          state: initState,
          actions: {
              // 子应用改变state并通知父应用
              setGlobalState({ commit }, payload = {}) {
                  commit('setGlobalState', payload);
                  commit('emitGlobalState', payload);
              },
              // 初始化，只用于mount时同步父应用的数据
              initGlobalState({ commit }, payload = {}) {
                  commit('setGlobalState', payload);
              },
              // 登录
              async login({ commit, dispatch }, params) {
                  try {
                      // ...
                      dispatch('setGlobalState');
                  } catch (error) {
                      console.error('登录失败:', error);
                  }
              },
              // 刷新token
              async refreshToken({ commit, dispatch }) {
                  try {
                      // ...
                      dispatch('setGlobalState');
                  } catch (error) {
                      console.error('刷新token失败:', error);
                  }
              },
              // 获取用户信息
              async getUserInfo({ commit, dispatch }) {
                  try {
                      // ...
                      dispatch('setGlobalState');
                  } catch (error) {
                      console.error('获取用户信息失败:', error);
                  }
              },
              // 登出
              logOut({ commit, dispatch }) {
                  // 这里假设to是一个自定义函数
                  to(api.logout());
                  commit('setUser');
                  commit('setMenu');
                  commit('setAuth');
                  dispatch('setGlobalState');
                  if (router) {
                      router && router.replace && router.replace({ name: 'Login' });
                  } else {
                      window.history.replaceState(null, '', '/login');
                  }
                  resetRouter && resetRouter(); // 重置路由
              },
              // 获取菜单
              async getMenu({ commit, dispatch, state }) {
                  try {
                      // ...
                      dispatch('setGlobalState');
                  } catch (error) {
                      console.error('获取菜单失败:', error);
                  }
              },
              setApp({ commit, dispatch }, appName) {
                  commit('setApp', appName);
                  dispatch('setGlobalState');
              }
          },
          mutations: {
              setGlobalState(state, payload) {
                  Object.assign(state, payload);
              },
              // 通知父应用
              emitGlobalState(state) {
                  if (props.setGlobalState) {
                      props.setGlobalState(state);
                  }
              },
              setAuth(state, data) {
                  state.auth = data || {};
                  if (data) {
                      setToken(data);
                  } else {
                      removeToken();
                  }
              },
              setUser(state, data) {
                  state.user = data || {};
              },
              setMenu(state, data) {
                  state.menu = data || null;
              },
              setApp(state, appName) {
                  state.app = appName;
              }
          },
          getters: {
              // ...
          }
      };
      store.registerModule('common', commonModule);
  } else {
      // 每次mount时，都同步一次父应用数据
      store.dispatch('common/initGlobalState', initState);
  }
}