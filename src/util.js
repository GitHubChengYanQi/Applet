const MyPlugin = {}

MyPlugin.install = function (Vue, options) {
    // 1. 添加全局方法或 property
    Vue.myGlobalMethod = function () {
        // 逻辑...
    }

    // 2. 添加全局资源
    Vue.directive('my-directive', {
        bind (el, binding, vnode, oldVnode) {
            // 逻辑...
        }
    })

    // 3. 注入组件选项
    Vue.mixin({
        mounted: function () {
            // console.log(this);
            typeof this.logined=="function" && this.logined();
            typeof this.notLogin=="function" && this.notLogin();
        }
    })
}

export default MyPlugin
