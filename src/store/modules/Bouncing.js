const init = {
    num: 0,
    animation: false
}

const state = () => ({
    outStockShop: {...init},
    waitInstock: {...init},
    instockError: {...init}
})


const getters = {}


const actions = {
    jump({commit}, payload) {
        commit('start', payload)
        setTimeout(() => {
            commit('stop', payload)
        }, 500)
    }
}


const mutations = {
    start(state, payload) {
        const {name} = payload
        state[name].animation = true
    },
    stop(state, payload) {
        const {number, after, name} = payload
        if (number !== null) {
            state[name].num = state[name].num + number
        }
        state[name].animation = false
        after();
    },
    number(state, payload) {
        const {number, name} = payload
        state[name].num = number
    },
    batchNumber(state, payload) {
        const {shops = []} = payload
        shops.map(item => {
            state[item.name].num = item.number
        })

    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
