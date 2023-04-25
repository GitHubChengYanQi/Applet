<template>
  <Auth>
    <Page v-if="auth && storehouseId" :storehouseId="storehouseId" :store="store" />

  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(options){
    this.storehouseId = options.storehouseId
    this.store = options.store
  },
  components: {Page, Auth},
  data() {
    return {
      storehouseId:'',
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
