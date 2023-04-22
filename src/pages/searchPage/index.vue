<template>
  <Auth>

    <Page v-if="auth && formType" :formType="formType" :searchValue="searchValue" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  onLoad(option) {
    this.formType = option.eventName
    this.searchValue = option.searchValue
  },
  data() {
    return {
      formType: '',
      searchValue: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
