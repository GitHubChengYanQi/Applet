const init = {
    systemInfo: null,
    navHeight: 0
}

const state = () => ({...init})


const getters = {}


const actions = {
    async getSystemInfo({state = {}}) {
        if (!state.systemInfo) {
            await new Promise((resolve,reject) => {
                uni.getSystemInfo({
                    success(system) {
                        state.systemInfo = system
                        //获取胶囊信息
                        const menu = uni.getMenuButtonBoundingClientRect()
                        //计算组件高度
                        const statusBarHeight = system.statusBarHeight //状态栏高度
                        const navigatorHeight = (menu.top - system.statusBarHeight) * 2 + menu.height //导航栏高度
                        state.navHeight = statusBarHeight + navigatorHeight //总高度
                        resolve()
                    },
                    fail() {
                        reject()
                    }
                })
            })
        }
    }
}


const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
