import {User} from "MES-Apis/lib/User/promise";
import {Init} from "MES-Apis/lib/Init";
import {routes} from "../../route";
import {isArray} from "../../util/Tools";

const init = {
    auth: false,
    userInfo: {},
    tenant: {},
    publicInfo: {},
    refresh: false,
    homeMenus: []
}

const state = () => ({...init})


const getters = {}


const actions = {
    async getPublicInfo({state}) {
        if (Object.keys(state.publicInfo).length === 0) {
            const publicInfo = await Init.getPublicInfo({})
            state.publicInfo = publicInfo.data || {}
        }
    },
    async getHomeMenus({state}, payload) {
        if (Object.keys(state.homeMenus).length === 0 || payload) {
            const res = await User.homeMenus({})
            const homeMenus = isArray(res.data && res.data.details)
            if (homeMenus.length > 0) {
                state.homeMenus = homeMenus.map(item => ({
                    ...item,
                    key: item.code
                }))
            } else {
                const menus = []
                routes.forEach(item => {
                    item.menus.forEach(item => {
                        if (item.type && item.type.includes('common')) {
                            menus.push(item)
                        }
                    })
                })
                state.homeMenus = menus
            }

        }
    }
}


const mutations = {
    authStatus(state, payload) {
        state.auth = payload
    },
    setUserInfo(state, payload) {
        state.userInfo = payload
    },
    setTenant(state, payload) {
        state.tenant = payload
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
