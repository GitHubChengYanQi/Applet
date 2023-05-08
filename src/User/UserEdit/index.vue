<template>
  <Auth>
    <Page
        v-if="auth && userId"
        :userId="userId"
    />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  onLoad(option) {
    this.userId = option.userId // 选择用户
  },
  data() {
    return {
      userId: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  },
  methods: {}
}
</script>
