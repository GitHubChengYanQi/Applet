import {User} from "MES-Apis/src/User/promise";
import {Login} from "MES-Apis/src/Login/promise";
import GetUserInfo from "./util/GetUserInfo";

const Auth = {}


export const errorHandler = () => {
    getApp().globalData.error = true
    getApp().globalData.token = ''
    uni.navigateTo({
        url: "/pages/Error/index",
    })
}

Auth.install = function (Vue, options) {
    // 1. 添加全局方法或 property
    Vue.myGlobalMethod = function () {
        // 逻辑...
    }

    // 2. 添加全局资源
    Vue.directive('my-directive', {
        bind(el, binding, vnode, oldVnode) {
            // 逻辑...
        }
    })

    // 3. 注入组件选项
    Vue.mixin({
        mounted: async function () {

        },
    })
}

export default Auth
