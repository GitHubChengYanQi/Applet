<template>
  <view>
    <List
        ref="listRef"
        :max-height="`calc(100vh - 8px)`"
        @request="Process.auditList"
        :list="list"
        @listSource="(newList)=>list = newList"
        :default-params="{type:ReceiptsEnums.outstockOrder,status:7,source:'productionPlan',sourceId:planId}"
    >
      <view
          v-for="item in list"
          :key="item.processTaskId"
      >
        <OutStockItem
            v-if="item.type === ReceiptsEnums.outstockOrder"
            :noProgress="noProgress"
            @onClick="onClick"
            @deleteTask="()=>deleteTask(item)"
            :item="item"
        />
      </view>
    </List>
  </view>
</template>

<script>
import {Process} from "MES-Apis/lib/Process/promise";
import {ReceiptsEnums} from "../Receipt/ReceiptsEnums";
import OutStockItem
  from "../Receipt/ReceiptList/components/MyAudit/components/ProcessList/components/OutStockItem";
import List from "../../components/List/indx";
import {safeAreaHeight} from "../../util/Tools";

export default {
  name: 'ProcessList',
  components: {
    List,
    OutStockItem
  },
  props: [
    'noProgress',
    'manual',
    'listRef',
    'api',
    'processListRef',
    'ReceiptDom',
    'type',
    'planId'
  ],
  data() {
    return {
      Process,
      ReceiptsEnums,
      list: [],
      safeAreaHeight
    }
  },
  methods: {
    onClick(item) {
      uni.navigateTo({
        url: `/Erp/Receipt/ReceiptDetail/index?id=${item.processTaskId}`,
      })
    },
    submit(params) {
      this.$refs.listRef.submit({type: this.type, status: 7, ...params})
    },
    deleteTask(item) {
      this.list = [...this.list.filter(listItem => listItem.processTaskId !== item.processTaskId)]
    }
  }
}
</script>
