<template>
  <Auth>
    <Page v-if="auth"/>
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  data() {
    return {
      checkUsers: []
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  },
  methods: {

  }
}
</script>
