<script>
import {Init} from "MES-Apis/src/Init";

Init.initBaseURL('http://192.168.2.111')
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
      const publicInfo = await Init.getPublicInfo({
        onError: () => {

        }
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
