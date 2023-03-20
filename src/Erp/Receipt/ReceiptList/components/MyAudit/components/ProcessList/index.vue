<template>
  <view>
    <List
        ref="listRef"
        :max-height="type === ReceiptsEnums.outstockOrder ? 'calc(100vh - 185px)' : 'calc(100vh - 125px)'"
        @request="Process.auditList"
        :list="list"
        @listSource="(newList)=>list = newList"
        :default-params="{type,status:7}"
    >
      <view
          v-for="item in list"
          :key="item.processTaskId"
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
            @deleteTask="()=>deleteTask(item)"
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
import {Process} from "MES-Apis/lib/Process/promise";
import {getLocalParmas} from "../../../../../../../util/Tools";

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
    'type'
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
      this.$refs.listRef.submit({type: this.type, status: 7, ...params})
    },
    deleteTask(item) {
      this.list = [...this.list.filter(listItem => listItem.processTaskId !== item.processTaskId)]
    }
  }
}
</script>
