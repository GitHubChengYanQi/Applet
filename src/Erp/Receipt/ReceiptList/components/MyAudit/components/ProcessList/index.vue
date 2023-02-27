<template>
  <view>
    <List
        ref="listRef"
        max-height="calc(100vh - 140px)"
        @request="Process.auditList"
        :list="list"
        @listSource="(newList)=>list = newList"
        :default-params="{type:'OUTSTOCK',status:7}"
    >
      <view
          v-for="(item,index) in list"
          :key="index"
      >
        <InStockItem
            v-if="item.type === ReceiptsEnums.instockOrder"
            :noProgress="noProgress"
            @onClick="onClick"
            :item="item"
        />
        <OutStockItem
            v-if="item.type === ReceiptsEnums.outstockOrder"
            :noProgress="noProgress"
            @onClick="onClick"
            @deleteTask="list = list.filter(listItem=>listItem.processTaskId !== item.processTaskId)"
            :item="item"
        />
        <MaintenaceItem
            v-if="item.type === ReceiptsEnums.maintenance"
            :noProgress="noProgress"
            @onClick="onClick"
            :item="item"
        />
        <StocktakingItem
            v-if="item.type === ReceiptsEnums.stocktaking"
            :noProgress="noProgress"
            @onClick="onClick"
            :item="item"
        />
        <AllocationItem
            v-if="item.type === ReceiptsEnums.allocation"
            :noProgress="noProgress"
            @onClick="onClick"
            :item="item"
        />
        <ErrorItem
            v-if="item.type === ReceiptsEnums.error"
            :noProgress="noProgress"
            @onClick="onClick"
            :item="item"
        />
        <ForwardItem
            v-if="item.type === ReceiptsEnums.errorForWard"
            :noProgress="noProgress"
            @onClick="onClick"
            :item="item"
        />
      </view>
    </List>
  </view>
</template>

<script>
import List from "../../../../../../../components/List/indx";
import {ReceiptsEnums} from "../../../../../ReceiptsEnums";
import InStockItem from "./components/InStockItem";
import OutStockItem from "./components/OutStockItem";
import MaintenaceItem from "./components/MaintenaceItem";
import StocktakingItem from "./components/StocktakingItem";
import AllocationItem from "./components/AllocationItem";
import ErrorItem from "./components/ErrorItem";
import ForwardItem from "./components/ForwardItem";
import {Process} from "MES-Apis/src/Process/promise";

export default {
  name: 'ProcessList',
  components: {
    ForwardItem,
    ErrorItem,
    AllocationItem,
    StocktakingItem,
    MaintenaceItem,
    OutStockItem,
    InStockItem,
    List
  },
  props: [
    'noProgress',
    'manual',
    'listRef',
    'api',
    'processListRef',
    'ReceiptDom',
  ],
  data() {
    return {
      Process,
      ReceiptsEnums,
      list: []
    }
  },
  methods: {
    onClick(item) {
      uni.navigateTo({
        url: `/Erp/Receipt/ReceiptDetail/index?id=${item.processTaskId}`,
      })
    },
    submit(params) {
      this.$refs.listRef.submit(params)
    }
  }
}
</script>
