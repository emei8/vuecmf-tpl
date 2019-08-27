import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modelApiMap:{}, //菜单后端链接映射
    sideCollapse: false, //侧边栏展开与折叠
    isCollapse: false, //头部logo及导航菜单的展开与折叠
    side_width: 'side_large_width', //头部logo宽度
    side_menu_width: 'side_menu_large_width', //侧边菜单栏宽度
    active_menu_nav: 0, //头部导航菜单默认选中
    active_side_menu: 0, //侧边菜单默认选中
    side_menu_data: {},  //侧边菜单
    nav_menu: {}, //菜单列表
    //主体部分标签页
    navTabsData:{
      currentNavTab: 'welcome',
      navTabs:[{
        title: '系统首页',
        name: 'welcome',
        closable: false
      }]
    }
  },
  mutations: {
    setModelApiMap(state,modelApiMap){
      state.modelApiMap = modelApiMap
    },
    toggleSideCollapse(state,sideCollapse) {
      state.sideCollapse = sideCollapse
      if(!sideCollapse){
          state.side_menu_width = 'side_large_width'
      }else {
          state.side_menu_width = 'side_small_width'
      }
    },
    toggleIsCollapse(state,isCollapse) {
      state.isCollapse = isCollapse
      if(!isCollapse){
          state.side_width = 'side_large_width'
      }else {
          state.side_width = 'side_small_width'
      }
    },
    setSideMenuData(state, menu) {
      state.side_menu_data = menu['children']
      state.active_side_menu = menu['active']
      state.active_menu_nav = menu['active_header']
    },
    setNavTabs(state, newTab){
      state.navTabsData.currentNavTab = newTab.name

      let flag = true
      state.navTabsData.navTabs.forEach((tab, index) => {
        if(tab.name === newTab.name)  flag = false
      });
      if(flag){
        state.navTabsData.navTabs.push(newTab)
      }

    },
    setNavTabsData(state, tabsData){
        state.navTabsData = tabsData
    },
    setNavMenu(state, navMenu){
        state.nav_menu = navMenu
    }
  },
  actions: {
    setModelApiMap({ commit },modelApiMap) {
      commit('setModelApiMap',modelApiMap)
    },
    toggleCollapse({ commit },collapse) {
        commit('toggleIsCollapse',collapse)
        commit('toggleSideCollapse',collapse)
    },
    toggleSideCollapse({ commit },collapse) {
        commit('toggleSideCollapse',collapse)
    },
    setSideMenuData({ commit },menu) {
      commit('setSideMenuData',menu)
    },
    setNavTabs({ commit },newTab) {
      commit('setNavTabs',newTab)
    },
    setNavTabsData({ commit },tabsData) {
      commit('setNavTabsData',tabsData)
    },
    setNavMenu({ commit },navMenu) {
        commit('setNavMenu',navMenu)
    }
  },
  getters: {
    notSideCollapse: state => {
      return !state.sideCollapse
    }
  }
})
