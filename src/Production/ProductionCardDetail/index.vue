<template>
  <Auth>
    <Page v-if="auth && cardId" :cardId="cardId" />

  </Auth>
</template>

<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(option){
    this.cardId = option.cardId
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
