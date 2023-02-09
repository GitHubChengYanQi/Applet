<template>
    <div>
         <!-- 登录前 -->
       <div id="top" v-show="bool" >
            <div id="img">
                <img src="../assets/下载.png" alt="">
            </div>
            <div id="deng">
                <p @click="deng()">点击登录</p>
                <p>></p>
            </div>
        </div>
       <!-- 登录后 -->
       <div id="top" v-show="!bool">
            <div class="de">
                <p>{{username}}</p>
                <p @click="del()">X</p>
            </div>
        </div>

          <!-- 遮罩层 -->
          <van-overlay :show="show" @click="show = false">
              <div class="wrapper" @click.stop>
               <div class="block" >
                <!-- 表单 -->
                <div id="from">
                <van-form @submit="onSubmit">
                        <van-field
                            v-model="username"
                            name="用户名"
                            label="用户名"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
                        />
                        <van-field
                            v-model="password"
                            type="password"
                            name="密码"
                            label="密码"
                            placeholder="密码"
                            :rules="[{ required: true, message: '请填写密码' }]"
                        />
                        <div style="margin:.5rem;">
                            <van-button round block type="danger" native-type="submit">登录/注册</van-button>
                        </div>
                        </van-form>
                    </div>
                 </div>
               </div>
       </van-overlay>


      


    </div>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
import {loginByWeb} from '@/request/api'
    export default {
        data(){
          return{
            show: false,
            username: '',
            password: '',
            token:'',
            bool:1
          }
        },
        methods:{
            qing(){
                Toast('该功能未开放');
            },
            deng(){
              this.show=true
            },
            onSubmit(values) {
            //    console.log( values);
              
               loginByWeb({username:this.username,pwd:this.password})
               .then(res=>{
                //  console.log(res,111); 
                this.token=res.token
                localStorage.setItem("token",res.data.token)
                localStorage.setItem("username",res.data.userInfo.username)
                this.$toast.success('登录成功')
                this.$router.go(0)
               })
             },
            del(){
                localStorage.removeItem('token')
                this.$router.go(0)
            }
        },
        created(){
          this.username = localStorage.getItem('username')
          this.token=localStorage.getItem('token')
                if(this.token){
                    this.bool=0
                }else{
                    this.bool=1
                }
        }
    }
</script>

<style lang="less" scoped>
#top{
    width: 100%;
    height: 1rem;
    background-color: rgb(51, 51, 51);
    .de{
    // margin-top: .2rem;
    width: 2.6rem;
    height: .2rem;
    padding-top: .4rem;
    margin-left: 1rem;
    // background-color: aqua;
    color: #fff;
    display: flex;
    justify-content: space-between;
  }
}
#img{
    padding-top: .15rem;
    margin-left: .2rem;
    img{
    width: 20%;
    border-radius: 50%;
}
}

#deng{
    display: flex;
    justify-content: space-between;
    font-size: .18rem;
    width: 2.6rem;
    height: .2rem;
    line-height: .2rem;
    // background-color: aqua;
    margin-left: 1rem;
    margin-top: -.45rem;
    color: white;
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 3.4rem;
    height:2.6rem;
    background-color: #fff;
    color: black;
     #from{
        margin-top: .2rem;
     }
  }
  
</style>