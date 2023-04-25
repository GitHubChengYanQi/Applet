<template>
  <Auth>
    <Page v-if="auth" />
  </Auth>
</template>

<script>

import Auth from "@/components/Auth";
import Page from "./page";

export default {
  components: {Page, Auth},
  data() {
    return {
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>

<style lang="scss">

</style>
