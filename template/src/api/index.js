import axios from "axios";
import '@/plugins/axios'
import store from '../store'
import * as cookie from '@/utils/cookie'
import '@/plugins/iview.js'

//export const apiMap = store.state.modelApiMap
//菜单后端链接映射
/*export const apiMap = {
    menu_model:{
        label:'菜单模型(auth_menu)',
        main_action: 'get_menu_tree',
        component: 'template/list/tree',
        actions:{
            get_nav_menu: { label:'获取导航菜单', path:'/menu' },  //获取导航菜单
            get_menu_tree: { label:'获取菜单列表', path:'/menu/tree' }, //获取菜单列表
            save_node: { label:'保存菜单节点', path:'/menu/save' }, //保存菜单节点
            del_node: { label:'删除菜单节点', path:'/menu/del' }, //删除菜单节点
            get_format_tree: { label:'获取格式化下拉菜单', path:'/menu/format' } //获取格式化菜单
        }

    }

}*/


export function getUrl(modelName,actionName) {
    let baseUrl = process.env.VUE_APP_API

    let apiMap = store.state.modelApiMap

    if(apiMap[modelName] === undefined){
        return axios.get('/auth_model/getModelApiMap').then(function(res){
            store.dispatch('setModelApiMap', res.data)
            apiMap = res.data
            return baseUrl + apiMap[modelName]['actions'][actionName].path  + '?token=' + cookie.get('token')
        })
    }else{
        return  baseUrl + apiMap[modelName]['actions'][actionName].path  + '?token=' + cookie.get('token')
    }


}


//公共后端请求API
export function request(modelName,actionName,method,data){
    let apiMap = store.state.modelApiMap
    if(apiMap[modelName] === undefined || apiMap[modelName]['actions'] === undefined || apiMap[modelName]['actions'][actionName] === undefined){
        return axios.get('/auth_model/getModelApiMap').then(function(res){
            if(res.code === 0){
                store.dispatch('setModelApiMap', res.data)
                apiMap = res.data

                if(typeof apiMap[modelName]['actions'][actionName] == "undefined"){
                    return { code: 500, msg:'对不起，您没有此操作权限！' }
                }else{
                    return axios({
                        method: method,
                        url: apiMap[modelName]['actions'][actionName].path + '?token=' + cookie.get('token'),
                        data: data
                    });
                }

            }else if(res.code === 1000){
                cookie.remove('token');
                cookie.remove('user');
                cookie.remove('server');
                //location.reload();
            }else{
                return res;
            }


        })
    }else{
        if(typeof apiMap[modelName]['actions'][actionName] == "undefined"){
            return { code: 500, msg:'对不起，您没有此操作权限！' }
        }else {
            return axios({
                method: method,
                url: apiMap[modelName]['actions'][actionName].path + '?token=' + cookie.get('token'),
                data: data
            });
        }
    }

}


