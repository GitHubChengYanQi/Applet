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
        :createTime='item.createTime'
        :taskName="item.taskName"
        @onClick="() => $emit('onClick',item)"
    >
      <view slot="processRender">
        <Process :progress="[
        {num: successPercent, color: '#257BDE'},
        {num: percent, color: '#D3E7FD'},
        {num: 100 - successPercent - percent, color: '#E8E8E8'},
      ]" />
      </view>
    </TaskItem>
  </view>
</template>

<script>
import TaskItem from "../TaskItem";
import {isArray} from "../../../../../../../../../util/Tools";
import Process from "../../../../../../../../components/Process";

export default {
  name: 'OutStockItem',
  components: {Process, TaskItem},
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
      progress: [],
      successPercent: 0,
      percent: 0,
      received: 0,
      collectable: 0
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

    this.progressChange(receipts, received, collectable, false);
    const current = this
    uni.$on('outStockAction', function (data) {
      if (data.receivedAction && data.pickListsId === receipts.pickListsId) {
        current.progressChange(receipts, current.received + data.received, current.collectable - data.collectable, true)
      } else if (data.taskId === current.item.processTaskId) {
        current.progressChange(receipts, data.received, data.collectable, true);
      }
    })
  },
  methods: {
    progressChange(receipts, received, collectable, action) {
      this.received = received
      this.collectable = collectable
      const successPercent = Number(((received / receipts.numberCount)).toFixed(2)) * 100 || 0;
      this.percent = Number(((collectable / receipts.numberCount)).toFixed(2)) * 100 || 0;
      this.successPercent = successPercent
      if (successPercent === 100 && action) {
        this.$emit('deleteTask')
      }
    }
  }
}
</script>

<style lang="scss">

</style>
