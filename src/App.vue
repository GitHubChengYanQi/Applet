<script>
import {Init} from "MES-Apis/src/Init";
import {Message} from "./components/Message";


Init.initBaseURL(process.env.NODE_ENV === "development" ? 'http://192.168.2.100' : process.env.VUE_APP_BASE_URL)


export default {
  onLaunch: function () {
    const updateManager = uni.getUpdateManager();

    updateManager.onUpdateReady(function (res) {
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
          uni.navigateTo({
            url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
          })
        },
        errorMessage: (res) => {
          Message.errorToast(res)
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
@import '/wxcomponents/common/index.wxss';
</style>
