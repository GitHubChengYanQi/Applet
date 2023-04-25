<template>
  <view class="choice">
    <view class="skuSizeItem">
      长：
      <ShopNumber :decimal="2" :value="length || 0" @onChange="(value)=>onInput('length',value)" />
    </view>
    <view class="skuSizeItem">
      宽：
      <ShopNumber :decimal="2" :value="width || 0" @onChange="(value)=>onInput('width',value)" />
    </view>
    <view class="skuSizeItem">
      高：
      <ShopNumber :decimal="2" :value="height || 0" @onChange="(value)=>onInput('height',value)" />
    </view>
  </view>
</template>

<script>
import ShopNumber from "../../../../components/ShopNumber";

export default {
  components: {ShopNumber},
  behaviors: ['uni://form-field'],
  data() {
    return {
      length: 0,
      width: 0,
      height: 0
    }

  },
  props: {
    placeholder: String,
  },
  methods: {
    onInput(type, value) {
      let inputValue = ''
      switch (type) {
        case 'length':
          this.length = value
          inputValue = `${value},${this.width},${this.height}`
          break;
        case 'width':
          this.width = value
          inputValue = `${this.length},${value},${this.height}`
          break;
        case 'height':
          this.height = value
          inputValue = `${this.length},${this.width},${value}`
          break;
        default:
          break
      }
      this.$emit('input', inputValue)
    }
  }
}
</script>

<style lang="scss">
.choice {
  display: flex;
  align-items: center;
  gap: 8px;

  .skuSizeItem {
    display: flex;
    align-items: center;
  }
}
</style>
