import {Init} from "MES-Apis/src/Init";
import {getLocalParmas} from "./util/Tools";
import {User} from "MES-Apis/src/User/promise";
import {Message} from "./components/Message";

const Auth = {}

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
            if (this.$mp.app) {
                return
            }
            // Init.initBaseURL('http://192.168.3.59')

            Init.responseConfig({
                loginTimeOut: () => {
                    uni.redirectTo({
                        url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
                    })
                },
                errorMessage: (res) => {
                    Message.errorToast(res)
                },
            })
            if (!getApp()?.globalData?.publicInfo) {
                // const publicInfo = await Init.getPublicInfo({
                //     onError: () => {

                //     }
                // })
                // if (!publicInfo) {
                //     return
                // }
                // getApp().globalData.publicInfo = publicInfo.data
            }
            const token = getApp().globalData.token
            if (token) {
                if (!getApp()?.globalData?.userInfo) {
                    // const res = await User.getUserInfo()
                    // getApp().globalData.userInfo = res.data
                }
                typeof this.logined == "function" && this.logined();
            } else if (getLocalParmas().route !== '/pages/login/index') {
                typeof this.notLogin == "function" && this.notLogin();
            }
        },
    })
}

export default Auth
