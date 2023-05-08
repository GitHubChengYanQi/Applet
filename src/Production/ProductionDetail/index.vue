<template>
  <Auth>
    <Page v-if="auth && id" :productionPlanId="id" />

  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(option) {
    this.id = option.id
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      const tenant = this.$store.state.userInfo.tenant || {}
      const target = res.target
      const dataset = target.dataset
      return {
        title: dataset.cardcoding,
        path: `/Production/ProductionCard/index?scene=${target.id}`,
        imageUrl: dataset.skuimg ||   tenant.imgLogo
      }
    }
  },
  components: {Page, Auth},
  data() {
    return {
      id: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
