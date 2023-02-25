import Vue from 'vue'
import Vuex from 'vuex'
import bouncing from './modules/Bouncing'
import userInfo from './modules/UserInfo'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        bouncing,
        userInfo
    },
})
