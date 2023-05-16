<script>
import {Init} from "MES-Apis/lib/Init";
import {Message} from "./components/Message";
import "uview-ui/index.scss";
import {getLocalParmas} from "./util/Tools";


Init.initBaseURL(
    process.env.NODE_ENV === "development" ?
        // 'http://192.168.2.100'
        'http://192.168.2.220:8885'
        // 'https://api.hh.zz2025.com'
        :
        process.env.VUE_APP_BASE_URL
)


export default {
  onLaunch: function () {
    this.appInit();
  },
  onShow: function (res) {
    // this.globalData.shareTenantId = res.query.shareTenantId
    // this.globalData.shareInviteId = res.query.inviteId

    uni.onKeyboardHeightChange((res) => {
      this.$store.commit('keyboard/keyboardHeightChange', res.height)
    })

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
  },
  onHide: function () {
    // console.log('App Hide')
  },
  methods: {
    appInit() {
      const miniProgram = uni.getAccountInfoSync().miniProgram

      //浑河 wx4e0e2e89ad2e48ef
      //道昕 wx8f5e5bc74c513993
      Init.requestParams({appid: miniProgram.appId}) //
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
          // Message.toast(res)
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
@import "@/static/font/iconfont-weapp-icon.css";

.u-border-right {
  border-right-width: 0.5px !important;
  border-color: rgba(57, 116, 199, 0.1) !important;
  border-right-style: solid;
}
</style>
