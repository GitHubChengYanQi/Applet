import {User} from "MES-Apis/lib/User/promise";
import {Init} from "MES-Apis/lib/Init";
import {base64src, isArray} from "../../util/Tools";
import {logo} from "../../images/logo";

const init = {
    auth: false,
    userInfo: {},
    tenant: {},
    publicInfo: {},
    refresh: false,
    homeMenus: [],
    myMenus: [],
    menus: []
}

const state = () => ({...init})


const getters = {}


const actions = {
    async getUserInfo({state, dispatch}, payload) {
        if (Object.keys(state.userInfo).length === 0 || payload) {
            const userRes = await User.getUserInfo()
            const userInfo = userRes.data || {}
            const url = await base64src(logo)
            state.userInfo = {...userInfo, avatar: userInfo.miniAppAvatar || userInfo.avatar}
            state.tenant = {
                tenantId: userInfo.tenantId,
                name: userInfo.tenantName,
                logo: userInfo.tenantLogo,
                admin: !!userInfo.isTenantAdmin,
                imgLogo: userInfo.tenantLogo?.url || url
            }
            state.menus = isArray(userInfo.miniAppMenus).filter(item => isArray(item.subMenus).length > 0)
            if (!payload) {
                dispatch('getHomeMenus', true)
            }
        }
    },
    async getPublicInfo({state}) {
        if (Object.keys(state.publicInfo).length === 0) {
            const publicInfo = await Init.getPublicInfo({})
            state.publicInfo = publicInfo.data || {}
        }
    },
    async getHomeMenus({state}, payload) {
        if (Object.keys(state.homeMenus).length === 0 || payload) {

            const menus = []
            const menuCodes = []
            state.menus.forEach(item => {
                const subMenus = item.subMenus
                subMenus.forEach(item => {
                    menuCodes.push(item.code)
                    menus.push(item)
                })
            })

            // 我的页面菜单
            const myMenuCodes = ['miniapp-skuAdd', 'miniapp-storeHouse']
            state.myMenus = menus.filter(item => myMenuCodes.find(code => code === item.code))


            const res = await User.homeMenus({})
            const homeMenus = isArray(res.data && res.data.details)
            if (homeMenus.length > 0) {
                // 首页菜单
                state.homeMenus = homeMenus.filter(item => menuCodes.find(code => code === item.code))
            } else {
                // 首页默认菜单
                const homeMenusCode = ['miniapp-outStock', 'miniapp-inStock', 'miniapp-inStockAsk', 'miniapp-stocktaking', 'miniapp-StockForewarn']
                state.homeMenus = menus.filter(item => homeMenusCode.find(code => code === item.code))
            }
        }
    }
}


const mutations = {
    authStatus(state, payload) {
        state.auth = payload
    },
    refresh(state, payload) {
        state.refresh = payload
    },
    clear(state) {
        Object.keys(init).forEach((key) => {
            state[key] = init[key]
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
