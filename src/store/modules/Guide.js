const init = {
    current: 0,
    openGuide: false,
    steps: [
        {
            text: '欢迎来到新手指南，下面花几分钟时间来简单学习一下，帮助您快速掌握！',
            page: '/pages/Home/index'
        },
        {
            text: '我的页面，可以设置团队和查看帮助',
            page: '/pages/User/index'
        },
        {
            text: '团队管理页面，邀请成员加入、审批、以及一些基础功能',
            page: '/Tenant/TenantSet/index'
        },
        {
            text: '仓库信息，可以查看所有的物料',
            page: '/pages/Stock/index'
        },
        {
            text: '物料管理页面，开始新增物料',
            page: '/Sku/Manage/index'
        },
    ]
}

const state = () => ({...init})


const getters = {}


const actions = {}


const mutations = {
    openGuide(state) {
        state.current = 0
        state.openGuide = true
    },
    next(state) {
        state.current = state.current + 1
    },
    close(state) {
        state.openGuide = false
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
