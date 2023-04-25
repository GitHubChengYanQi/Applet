<template>
  <view>
    <view
        v-if="!hidden"
        :style="{ display: 'inline-block', minWidth: `${minWidth || 100}px`, textAlign: textAlign || 'right' }"
        @click="click"
    >
      <slot>
        <view class="content">
          <LinkButton>
            <Icon icon="icon-rili" size="20" />
          </LinkButton>
          {{
            value[0] && value[1] ? `${MyDate.Show(value[0])} - ${MyDate.Show(value[1])}` : placeholder
          }}
        </view>
      </slot>
    </view>
    <Popup
        :show="open"
        left-text="取消"
        right-text="确定"
        @onLeft="onLeft"
        @onRight="onRight"
        @close="open = false"
    >
      <view v-if="open">
        <u-tabs :list="tabs" @click="change" :scrollable="false"></u-tabs>
      </view>
    </Popup>
  </view>
</template>

<script>
import LinkButton from "../LinkButton";
import {MyDate} from "../../util/Tools";
import Popup from "../Popup";
import Icon from "../Icon";

export default {
  name: 'StartEndDate',
  components: {Icon, Popup, LinkButton},
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: String,
    min: String,
    max: String,
    precision: String,
    className: String,
    textAlign: String,
    minWidth: Number,
    hidden: Boolean
  },
  data() {
    return {
      startDate: '',
      open: false,
      key: 'start',
      time: [],
      MyDate,
      tabs: [{
        name: '起始时间',
      }, {
        name: '结束时间',
      }],
    }
  },
  mounted() {
    this.time = this.value || []
  },
  methods: {
    click() {
      this.key = 'start'
      this.time = this.value || []
      this.open = true
    },
    onLeft() {
      this.open = false
    },
    onRight() {
      this.open = false
    }
  }
}
</script>

<style lang="scss">
.content {
  //display: flex;
  //align-items: center;
}
</style>
