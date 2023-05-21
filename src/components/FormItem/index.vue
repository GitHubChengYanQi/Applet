<template>
  <view class="forItem">
    <uni-forms-item :name="name">
      <slot name="label">
        <view class="forItem-label">
          {{ label }}
          <view v-if="required" class="forItem-required">
            <u-badge isDot />
          </view>
        </view>
      </slot>
      <slot></slot>
    </uni-forms-item>
  </view>
</template>

<script>
export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'FormItem',
  props: ['name', 'label', 'required']
}
</script>

<style lang="scss">

.forItem {
  .uni-forms-item {
    margin: 0;
    padding: 12px 0;
  }

  .forItem-label {
    font-size: 14px;
    color: #666666;
    padding: 0;
    height: fit-content;
    width: fit-content;
    position: relative;

    .forItem-required {
      position: absolute;
      top: 0;
      right: -4px;

      .u-badge {
        width: 4px;
        height: 4px;
      }
    }
  }
}

</style>
