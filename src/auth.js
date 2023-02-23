import {User} from "MES-Apis/src/User/promise";
import {Login} from "MES-Apis/src/Login/promise";
import GetUserInfo from "./util/GetUserInfo";

const Auth = {}

export const errorHandler = () => {
    getApp().globalData.error = true
    getApp().globalData.token = ''
    uni.redirectTo({
        url: "/pages/Error/index",
    })
}

export const tokenType = async (auth) => {
    const userInfo = GetUserInfo().userInfo || {};
    const userId = !!userInfo.userId;
    if (!userId) {
        typeof auth.notLogin == "function" && auth.notLogin();
    } else {
        if (!getApp()?.globalData?.userInfo) {
            const userRes = await User.getUserInfo().catch(() => {
                errorHandler()
            })
            getApp().globalData.userInfo = userRes.data
        }
        typeof auth.logined == "function" && auth.logined();
    }
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
            const auth = this
            if (this.$mp.app || this.mpType !== 'page') {
                return
            }

            if (getApp().globalData.error) {
                return
            }

            const token = GetUserInfo().token;
            if (token) {
                tokenType(auth)
            } else {
                // typeof auth.notLogin == "function" && auth.notLogin();
                // return
                uni.login({
                    success: async function (loginRes) {
                        if (loginRes.errMsg === 'login:ok') {
                            await Login.codeToSession({code: loginRes.code}, {
                                onSuccess: (token) => {
                                    getApp().globalData.token = token
                                    tokenType(auth)
                                },
                                onError: (res) => {
                                    errorHandler()
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
