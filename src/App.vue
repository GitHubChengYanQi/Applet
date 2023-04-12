<script>
import {Init} from "MES-Apis/lib/Init";
import {Message} from "./components/Message";
import "uview-ui/index.scss";
import {getLocalParmas} from "./util/Tools";


Init.initBaseURL(
    process.env.NODE_ENV === "development" ?
        'http://192.168.2.100'
        // 'http://192.168.2.220:8885'
        // 'https://api.hh.zz2025.com'
        :
        process.env.VUE_APP_BASE_URL)


export default {
  onLaunch: function () {
    const updateManager = uni.getUpdateManager();

    updateManager.onUpdateReady(function () {
      uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });

    });
    this.appInit();
  },
  onShow: function () {

  },
  onHide: function () {
    // console.log('App Hide')
  },
  methods: {
    appInit() {
      Init.responseConfig({
        loginTimeOut: () => {
          Message.toast('您已登录超时!\n正在重新登录...', () => {
            getApp().globalData.token = ''
            // this.$store.commit('userInfo/clear')
            uni.reLaunch({
              url: getLocalParmas().route,
            });
            // this.$store.commit('userInfo/refresh', true)
          })
        },
        errorMessage: (res) => {
          Message.toast(res)
        },
      })
    }
  },
  globalData: {
    token: ''
  }
}
</script>

<style>
/*每个页面公共css */
@import "@/static/font/iconfont.css";
@import "@/static/font/iconfont-weapp/iconfont-weapp-icon.css";
@import '/wxcomponents/common/index.wxss';
.u-border-right {
  border-right-width: 0.5px !important;
  border-color: rgba(57, 116, 199, 0.1) !important;
  border-right-style: solid;
}
</style>
