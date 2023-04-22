<template>
  <view @click="()=>!disabled && $emit('change')" :class="{check:true,disabled}">
    <view :class="{checkBox:true,checked:value}">
      <u-icon v-if="value" name="checkbox-mark" :color="disabled ? '#c8c9cc':'#fff'" />
    </view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'Check',
  props: ['value', 'disabled', 'color'],
}
</script>

<style lang="scss">

.check {
  display: flex;
  align-items: center;
  gap: 4px;

  .checkBox {
    background-color: #ffffff;
    border-color: #c8c9cc;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    box-sizing: border-box;
    transition-property: border-color, background-color, color;
    transition-duration: 0.2s;
    color: #606266;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-right: 6px;
    font-size: 6px;
    border-width: 1px;
    border-style: solid;
  }

  .checked {
    background-color: #2979ff;
    border-color: #2979ff;
  }
}

.disabled {
  color: #c8c9cc;

  .checkBox {
    border-color: #c8c9cc;
    background-color: #ebedf0;
  }


}

</style>
