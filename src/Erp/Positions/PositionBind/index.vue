<template>
  <Auth>
    <Page
        v-if="auth && storehousePositionsId"
        :storehousePositionsId="storehousePositionsId"
        :position="position"
        :store="store"
    />
    <van-dialog id="van-dialog" />
  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(options){
    this.storehousePositionsId = options.storehousePositionsId
    this.position = options.position
    this.store = options.store
  },
  components: {Page, Auth},
  data() {
    return {
      storehousePositionsId:'',
      position:'',
      store:''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
