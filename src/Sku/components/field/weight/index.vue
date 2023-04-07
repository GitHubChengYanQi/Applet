<template>
  <view class="weight">
    <ShopNumber :min="0" :value="value || 0" @onChange="onInput" :decimal="2" />
    kg
  </view>
</template>

<script>
import ShopNumber from "../../../../components/ShopNumber";

export default {
  components: {ShopNumber},
  behaviors: ['uni://form-field'],
  props: {
    placeholder: String,
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
.weight {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 36px;
}
</style>
