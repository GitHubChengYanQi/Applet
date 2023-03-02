<template>
  <view>
    <TaskItem
        :task="item"
        :noProgress="noProgress"
        :users="isArray(item.processUsers)"
        :statusName="receipts.statusName || '进行中'"
        :percent="parseInt((receipts.inStockNum / receipts.applyNum) * 100)"
        :coding="receipts.coding"
        :createTime='item.createTime'
        :taskName="item.taskName"
        @onClick="() => $emit('onClick',item)"
    />
  </view>
</template>

<script>
import TaskItem from "../TaskItem";
import {isArray} from "../../../../../../../../../util/Tools";

export default {
  name: 'InStockItem',
  components: {TaskItem},
  props: [
    'item',
    'index',
    'pick',
    'noProgress',
  ],
  data() {
    return {
      isArray,
      receipts: {},
    }
  },
  mounted() {

    this.receipts = this.item.receipts || {}
  },
}
</script>

<style lang="scss">

</style>
