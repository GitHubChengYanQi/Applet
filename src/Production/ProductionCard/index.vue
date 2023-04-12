<template>
  <Auth>
    <Page v-if="auth" :cardId="cardId" />
    <van-dialog id="van-dialog" />
  </Auth>
</template>

<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(option){
    this.cardId = option.scene
  },
  components: {Page, Auth},
  data() {
    return {
      cardId:''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
