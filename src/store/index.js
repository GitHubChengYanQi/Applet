import Vue from 'vue'
import Vuex from 'vuex'
import bouncing from './modules/Bouncing'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        bouncing
    },
})
