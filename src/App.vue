<script>
import {Init} from "MES-Apis/src/Init";
import {getLocalParmas} from "./util/Tools";
Init.initBaseURL('http://192.168.3.59')
export default {
  onLaunch: function () {
    console.log('App Launch');
	this.appInit();
  },
  onShow: function () {
    console.log('App Show')
	
  },
  onHide: function () {
    // console.log('App Hide')
  },
  methods:{
	  async appInit(){
		  if (!getApp()?.globalData?.publicInfo) {
		      const publicInfo = await Init.getPublicInfo({
		          onError: () => {
		  
		          }
		      })
		      if (!publicInfo) {
		          return
		      }
		      getApp().globalData.publicInfo = publicInfo.data
		  }
		  const token = getApp().globalData.token
		  if (token) {
		      if (!getApp()?.globalData?.userInfo) {
		          const res = await User.getUserInfo()
		          getApp().globalData.userInfo = res.data
		      }
		      typeof this.logined == "function" && this.logined();
		  } else if (getLocalParmas().route !== '/pages/login/index') {
		      typeof this.notLogin == "function" && this.notLogin();
		  }
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
