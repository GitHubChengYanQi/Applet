<template>
  <view>
    <view :style="{ backgroundColor: !show && '#fff' }" class='shopNumber'>
      <view
          :class="['number',className]"
          :style="{ border: show && 'none', padding: show && 0, textAlign:textAlign || 'center' }"
          @click="click"
      >
        <view v-if="!number">
          × {{ value }}
        </view>
        <view v-else-if="value">
          {{ value }}
        </view>
        <view v-else>
          <span style="color:#cccccc">{{ placeholder }}</span>
        </view>
      </view>
    </view>

    <Keybord
        :decimal='decimal'
        :visible='visible'
        @visiblChange="(visi)=>visible = visi"
        :value='value'
        :min='min'
        :max='max'
        @onChange="(num)=>$emit('onChange',num)"
    />
  </view>
</template>

<script>
import Keybord from "../Keybord";

export default {
  name: 'ShopNumber',
  components: {Keybord},
  props: {
    textAlign: String,
    value: String || Number,
    show: Boolean,
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 999999
    },
    className: String,
    number: Boolean,
    placeholder: String,
    decimal: Number
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    click() {
      if (!this.show) {
        this.visible = true
      }
    }
  }
}
</script>

<style lang="scss">
.shopNumber {
  height: 24px;

  .number {
    border-radius: 2px;
    border: 1px solid #D9D9D9;
    display: inline-block;
    height: 24px;
    line-height: 24px;
    min-width: 36px;
    max-width: 100px;
    padding: 0 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
