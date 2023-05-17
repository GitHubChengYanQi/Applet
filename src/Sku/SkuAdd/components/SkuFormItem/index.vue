<template>
  <view class="skuFormItem">
    <Icon :icon="icon" size="25" v-if="icon" />
    <view class="skuFormItemContent" :style="{paddingLeft:icon ? '16px' : '0'}">
      <view class="label">
        {{ label }}
        <view v-if="required" class="required">
          <u-badge class="badge" isDot />
        </view>
      </view>
    </view>
    <u-icon name="arrow-right" size="12" color="#D3D3D3" />
  </view>
</template>

<script>
import Icon from "../../../../components/Icon";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SkuFormItem',
  components: {Icon},
  props: ['label', 'icon', 'required']
}
</script>

<style lang="scss">
.skuFormItem {
  height: 85px;
  padding-top: 16px;
  border-bottom: 1px solid #EDEDED;
  display: flex;
  align-items: center;
  width: 100%;

  .skuFormItemContent {
    flex-grow: 1;
    padding: 0 16px;

    .label {
      font-size: 12px;
      color: #666666;
      position: relative;
      display: inline-block;

      .required {
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
}
</style>
