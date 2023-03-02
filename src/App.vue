<script>
import {Init} from "MES-Apis/src/Init";
import {Message} from "./components/Message";
import "uview-ui-x/index.scss";

Init.initBaseURL(process.env.NODE_ENV === "development" ? 'http://192.168.2.111' : process.env.VUE_APP_BASE_URL)

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
    appInit() {
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
