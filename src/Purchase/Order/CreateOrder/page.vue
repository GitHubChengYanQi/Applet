<template>
  <view>
    <FormLayout

    />

  </view>
</template>

<script>

import FormLayout from "@/Purchase/Order/CreateOrder/FormLayout/index.vue";

export default {
  name: "page",
  components: {FormLayout},
  data() {
    return {
      showCorporateName: false,
    }
  },
  methods: {
    onClick() {
      this.showCorporateName = true
    },
    cancel() {
      this.showCorporateName = false
    },
  },
}
</script>

<style lang="scss">

</style>