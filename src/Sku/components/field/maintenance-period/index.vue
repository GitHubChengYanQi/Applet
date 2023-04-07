<template>
  <view class="choice">
    <ShopNumber :min="0" :value="value || 0" @onChange="onInput" />
    天
  </view>
</template>

<script>
import ShopNumber from "../../../../components/ShopNumber";

export default {
  components: {ShopNumber},
  behaviors: ['uni://form-field'],
  props: {
    placeholder: String,
    value: {
      type: Number,
      default: _ => 0
    }
  },
  data() {
    return {}
  },
  methods: {
    onInput(value) {
      this.value = value
      this.$emit('input', value)
    }
  }
}
</script>

<style>
.choice {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 36px;
}
</style>
