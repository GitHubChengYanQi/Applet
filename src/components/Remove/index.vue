<template>
  <view class="remove" @click="$emit('click')">
    <u-icon name="trash" color="#dd524d" size="20" />
  </view>
</template>

<script>
import {Message} from "../Message";

export default {
  name: 'Remove',
  props: {
    onRemove: Function
  },
  data() {
    return {}
  },
  methods: {
    remove() {
      const _this = this
      Message.dialog({
        title: '删除后不可恢复，确定删除吗？',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            resolve(true)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.remove {

}
</style>
