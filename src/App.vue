<script>

// const getPhoneNumber = async (event, context) => {
//   // event里包含着客户端提交的参数
//   const res = await uniCloud.getPhoneNumber({
//     appid: '_UNI_ABCDEFG', // 替换成自己开通一键登录的应用的DCloud appid
//     provider: 'univerify',
//     apiKey: 'xxx', // 在开发者中心开通服务并获取apiKey
//     apiSecret: 'xxx', // 在开发者中心开通服务并获取apiSecret
//     access_token: event.access_token,
//     openid: event.openid
//   })
//
//   console.log(res); // res里包含手机号
//   // 执行用户信息入库等操作，正常情况下不要把完整手机号返回给前端
//   // 如果数据库在uniCloud上，可以直接入库
//   // 如果数据库不在uniCloud上，可以通过 uniCloud.httpclient API，将手机号通过http方式传递给其他服务器的接口，详见：https://uniapp.dcloud.net.cn/uniCloud/cf-functions?id=httpclient
//   return {
//     code: 0,
//     message: '获取手机号成功'
//   }
// }

export default {
  onLaunch: function () {
    // console.log('App Launch')
  },
  onShow: function () {
    // console.log('App Show')
    // 在得到access_token后，通过callfunction调用云函数
    // uniCloud.callFunction({
    //   name: 'getPhoneNumber', // 你的云函数名称
    //   data: {
    //     'access_token': 'xxx', // 客户端一键登录接口返回的access_token
    //     'openid': 'xxx' // 客户端一键登录接口返回的openid
    //   }
    // }).then(res => {
    //   // res.result = {
    //   //   code: '',
    //   //   message: ''
    //   // }
    //   // 登录成功，可以关闭一键登录授权界面了
    // }).catch(err=>{
    //   // 处理错误
    // })
  },
  onHide: function () {
    // console.log('App Hide')
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
