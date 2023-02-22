import {Init} from "MES-Apis/src/Init";
import {getLocalParmas} from "./util/Tools";
import {User} from "MES-Apis/src/User/promise";
import {Message} from "./components/Message";
import {Login} from "MES-Apis/src/Login/promise";

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
            if (this.$mp.app || this.mpType !== 'page') {
                return
            }
            const token = getApp().globalData.token
            if (token) {
                if (!getApp()?.globalData?.userInfo) {
                    console.log(this)
                    const res = await User.getUserInfo()
                    getApp().globalData.userInfo = res.data
                }
                typeof this.logined == "function" && this.logined();
            } else if (getLocalParmas().route !== '/pages/login/index') {
                const auth = this
                uni.login({
                    success: async function (loginRes) {
                        if (loginRes.errMsg === 'login:ok') {
                            Login.codeToSession({code: loginRes.code}, {
                                onSuccess: () => {
                                    typeof auth.notLogin == "function" && auth.notLogin();
                                },
                                onError:()=>{

                                }
                            })
                        }
                    }
                });
            }
        },
    })
}

export default Auth
