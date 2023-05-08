<template>
  <Auth>

    <van-dialog id="van-dialog" />
    <Page v-if="auth && id" :orderId="id" />
  </Auth>
</template>
<script>
import Page from "./page";
import Auth from "../../../components/Auth";

export default {
  components: {Auth, Page},
  onLoad(option) {
    this.id = option.id
  },
  data() {
    return {
      id: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>

<style scoped>
.back{

}
.list{
  padding: 8px;
  margin-top: 8px;
  background-color: #FFFFFF;
  position: relative;
}
.button{
  background-color: #FFFFFF;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  z-index: 999;
}
.input{
  font-size: 14px;
  line-height: 22px;
  position: absolute;
  top: 18px;
  right: 8px;
  width: 80px;
}
</style>
