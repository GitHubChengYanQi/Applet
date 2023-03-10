const init = {
    systemInfo: null,
}

const state = () => ({...init})


const getters = {}


const actions = {
    async getSystemInfo({state = {}}) {
        if (!state.systemInfo){
            state.systemInfo = await new Promise((resolve) => {
                uni.getSystemInfo({
                    success(res) {
                        resolve(res)
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
