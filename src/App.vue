<script>
import {Init} from "MES-Apis/src/Init";
import {getLocalParmas} from "./util/Tools";
Init.initBaseURL('http://192.168.2.111')
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
.input-boder {
		display: flex;
		    box-sizing: border-box;
		    flex-direction: row;
		    align-items: center;
		    border: 1px solid #dcdfe6;
		    border-radius: 4px;
	}
	.content-input {
	    width: auto;
	    position: relative;
	    overflow: hidden;
	    flex: 1;
	    line-height: 1;
	    font-size: 14px;
	    height: 35px;
	}
	.grey {
		display: block;
		right: 8px;
		position: absolute;
	}
</style>
