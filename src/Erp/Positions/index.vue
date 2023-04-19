<template>
  <Auth>
    <Page v-if="auth && storehouseId" :storehouseId="storehouseId" />
    <van-dialog id="van-dialog" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(options){
    this.storehouseId = options.storehouseId
  },
  components: {Page, Auth},
  data() {
    return {
      storehouseId:''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
