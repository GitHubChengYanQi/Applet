<template>
  <Auth>
    <Page v-if="auth"/>
  </Auth>
</template>

<script>
import Page from "./page";
import Auth from "@/components/Auth/index.vue";

export default {
  components: {Page, Auth},
  data() {
    return {}
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>