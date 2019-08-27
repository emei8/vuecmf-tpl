<template>
  <i-header :style="{height:'42px'}">
    <div class="header-inner">
        <!-- logo start -->
        <div class="header-logo" :class="side_width" >
            <span v-if="isCollapse">
                <i-dropdown class="main-nav" trigger="click" @on-click="handleSelect">
                  <span class="ivu-dropdown-link">
                      <i-icon type="md-menu" />
                  </span>
                  <i-dropdown-menu slot="list">
                      <template v-for="menu_item in nav_menu">
                        <i-dropdown-item :key="menu_item.path" :name="menu_item.path">{{ menu_item.title }}</i-dropdown-item>
                      </template>
                  </i-dropdown-menu>
                </i-dropdown>
            </span>
            <span v-else class="logo">VueCMF</span>
        </div>
        <!-- logo end -->

        <!-- main-menu start -->
        <div v-if="isCollapse" class="menu-nav">VueCMF</div>
        <i-menu v-else
                :active-name="active_menu_nav"
                class="menu-nav"
                mode="horizontal"
                @on-select="handleSelect"
                theme="light"
                >
            <template v-for="menu_item in nav_menu">
                <i-menu-item :key="menu_item.id" :name="menu_item.id">{{ menu_item.title }}</i-menu-item>
            </template>
        </i-menu>
        <!-- main-menu end -->

        <!-- user-info start -->
        <i-dropdown class="user-info"  trigger="click" placement="bottom-end" @on-click="userEvent">
          <span class="ivu-dropdown-link user-face">
            <i-icon type="ios-contact" />
          </span>
          <i-dropdown-menu slot="list">
              <i-dropdown-item>账号：{{ user.username }}</i-dropdown-item>
              <i-dropdown-item>角色：{{ user.role }}</i-dropdown-item>

              <i-dropdown-item divided name="logout"> <i-icon type="md-power" /> 退出系统</i-dropdown-item>
          </i-dropdown-menu>
        </i-dropdown>
        <!-- user-info end -->
    </div>
  </i-header>
</template>

<script>
import { mapState } from 'vuex'


export default {
    name: 'vc-header',
    data() {
        return {
            nav_menu: {},
            user:{}
        }
    },
    computed: {
        ...mapState({
            isCollapse: state => state.isCollapse,
            side_width: state => state.side_width,
            active_menu_nav: state => state.active_menu_nav
        })
    },
    mounted() {
        let that = this
        that.user = JSON.parse(that.$cookie.get('user'));
        this.$api.request('auth_menu_model','get_nav_menu','get').then(function(res){

            if(res.code === 0){
               that.nav_menu = res.data.nav_menu
               that.$store.dispatch('setNavMenu', that.nav_menu)
            }else if(res.code === 1000){
                that.$router.push({ path:'/login' })
            }else{
                that.$Message.error(res.msg);

            }

        })

    },
    methods: {
        userEvent(name){
            let that = this
            if(name === 'logout'){
                that.$api.request('admin_model','logout','post').then(function (data) {
                    if(data.code === 0){
                        that.$cookie.remove('token');
                        that.$cookie.remove('user');
                        that.$cookie.remove('server');
                        that.$Message.success(data.msg)
                        window.sessionStorage.clear()
                        that.$store.dispatch('setNavTabsData', {
                            currentNavTab: 'welcome',
                            navTabs: [{title: '系统首页',name: 'welcome',closable: false}]
                        })

                        that.$router.push({ path:'/login' })
                    }else{
                        that.$Message.error(data.msg)
                    }
                });
            }
        },
        getMenuRouter(sideMenu,oldMenuData,sideMenuRouter){
            if(sideMenu !== undefined){
                for(let index in sideMenu){
                    let item = sideMenu[index]

                    console.log(item)

                    if(item['children'] !== undefined){
                        this.getMenuRouter(item['children'],oldMenuData,sideMenuRouter)
                    }else{
                        if(item.component === '') return

                        let routerItem = {
                            path: item.path,
                            component: item.component,
                            name: item.title,
                            meta: {
                                    permission: item.permission,
                                    model: item.model_name,
                                    filter_field: item.filter_field,
                                    title: item.title,
                                    icon: item.icon,
                                    noCache: true,
                                    topId: item.top_id,
                                    id: item.id
                                }
                        }

                        if(oldMenuData !== undefined){
                            let flag = true
                            oldMenuData.forEach((oldItem, oldIndex) => {
                                if(oldItem.path === item.path || oldItem.name === item.title){
                                    flag = false
                                }

                            })

                            if(flag){
                                sideMenuRouter.push(routerItem)
                            }

                        }else{
                            sideMenuRouter.push(routerItem)
                        }


                    }
                }
            }

        },
        handleSelect(key) {
            let that = this
            let sideMenu = this.nav_menu[key]
            if(sideMenu === undefined) sideMenu = [];
            sideMenu['active_header'] = key

            that.$store.dispatch('setSideMenuData', sideMenu)

            let sideMenuRouter = []
            let oldMenuData = JSON.parse(window.sessionStorage.getItem('sideMenuRouter'))

            this.getMenuRouter(sideMenu['children'],oldMenuData,sideMenuRouter)

            sideMenuRouter = this.$helper.mergeObj(oldMenuData,sideMenuRouter)


            if(sideMenuRouter.length > 0){
                window.sessionStorage.setItem('sideMenuRouter',JSON.stringify(sideMenuRouter)) //防止刷新时动态添加路由丢失，为此存入本地会话缓存
                let oldRouter = that.$router.options.routes[0].children
                let newRouter = []
                sideMenuRouter.forEach((routerItem, routerIndex) => {
                    let flag = true
                    oldRouter.forEach((oldRouterItem, oldRouterIndex) => {
                        if(routerItem.path === oldRouterItem.path || routerItem.name === oldRouterItem.name){
                            flag = false
                        }
                    })

                    if(flag){
                        newRouter.push({
                            path: routerItem.path,
                            component: () => import('@/views/' + routerItem.component) ,
                            name: routerItem.name,
                            meta: routerItem.meta
                        })
                    }
                })

                if(newRouter.length > 0){
                    that.$router.options.routes[0].children = newRouter
                    that.$router.addRoutes(that.$router.options.routes)
                }

            }

        }
    }
}
</script>

<style lang="scss">

@import '~@/assets/style/admin-base.scss';

/* 头部 */
.ivu-layout-header{
    box-shadow: 0 2px 2px #ddd;
    padding:0;
    width: 100%;
}

.header-inner{
    height: $header_height;
    text-align: center;
    display: flex;
    align-items: center;
}

.header-logo{ line-height: $header_height; color: $font_color; }

.ivu-layout-header, .ivu-menu-horizontal.ivu-menu-light, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item{
  background-color: $background_color_hover;
  color: $font_color;
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active{
    color: $font_color_hover
}
.ivu-menu-horizontal.ivu-menu-light:after{ height: 0;}

.user-face{ font-size: 32px;}
.user-face .ivu-icon{  padding-right: 3px;}
.menu-nav{ flex-grow: 1; text-align: center; font-size: 18px; height: $header_height; line-height: $header_height; }
.header-logo{ flex-grow: 0; }
.logo{ font-size: 18px;}



.ivu-dropdown-link{
    color: $font_color;
    cursor: pointer;
}


.header-inner .ivu-select-dropdown{ top:$header_height !important; }


.user-info{
 width: 46px;
 color: $font_color;
 position: relative;
}

.user-info .ivu-select-dropdown{
    position: absolute;
    top: 50px !important;
    left:auto;
    right: 15px;
    width:120px;
}

.ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
    padding-top: 8px !important;
    padding-bottom: 8px !important;
}

</style>
