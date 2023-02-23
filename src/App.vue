<script>
import {Init} from "MES-Apis/src/Init";
import {errorHandler} from "./auth";
import {Message} from "./components/Message";


Init.initBaseURL(process.env.NODE_ENV === "development" ? 'http://192.168.2.100' : process.env.VUE_APP_BASE_URL)
export default {
  onLaunch: function () {
    this.appInit();
  },
  onShow: function () {

  },
  onHide: function () {
    // console.log('App Hide')
  },
  methods: {
    async appInit() {
      Init.responseConfig({
        loginTimeOut: () => {
          uni.redirectTo({
            url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
          })
        },
        errorMessage: (res) => {
          Message.errorToast(res)
        },
      })

      const publicInfo = await Init.getPublicInfo().catch(() => {
        errorHandler()
      })
      if (!publicInfo) {
        return
      }
      getApp().globalData.publicInfo = publicInfo.data
    }
  },
  globalData: {
    token: ''
  }
}
</script>

<style>
/*每个页面公共css */
@import "@/static/iconfont.css";
@import '/wxcomponents/common/index.wxss';
</style>
