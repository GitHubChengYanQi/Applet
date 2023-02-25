<template>
  <view>
    <TaskItem
        :task="item"
        :action="can"
        :noProgress="noProgress"
        :otherData="`领料人：${receipts.userResult && receipts.userResult.name}`"
        :users="isArray(item.processUsers)"
        :statusName="receipts.statusName"
        :percent="percent"
        :coding="receipts.coding"
        :endTime="receipts.endTime"
        :createTime='item.createTime'
        :taskName="item.taskName"
        :beginTime="receipts.beginTime"
        @onClick="() => $emit('onClick',item)"
    >
      <view slot="processRender">
        <MyProgress
            class='outProcess'
            :percent="percent + successPercent"
            :success="{ percent: successPercent, strokeColor: receivedColor }"
            :trailColor={notPreparedColor}
            :strokeColor={collectableColor}
        />
      </view>
    </TaskItem>
  </view>
</template>

<script>
import TaskItem from "../TaskItem";
import {isArray} from "../../../../../../../../../util/Tools";
export default {
  name: 'OutStockItem',
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
      can: false,
      successPercent: 0,
      percent: 0
    }
  },
  mounted() {
    const receipts = this.item.receipts || {}
    this.receipts = receipts
    const canPick = receipts.canPick;
    const canOperate = receipts.canOperate;

    this.can = this.pick ? canPick : (canOperate === undefined ? canPick : canOperate);

    const received = receipts.receivedCount || 0;
    const collectable = receipts.cartNumCount || 0;

    this.successPercent = Number(((received / receipts.numberCount)).toFixed(2)) * 100;
    this.percent = Number(((collectable / receipts.numberCount)).toFixed(2)) * 100;
  }
}
</script>

<style lang="scss">

</style>
