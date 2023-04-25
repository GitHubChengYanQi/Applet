<template>
  <view>
    <List
        @request="Sku.skuLogs"
        :list="list"
        @listSource="(newList)=>list = newList"
        maxHeight="50vh"
        :default-params="{skuId}"
    >
      <view v-for="(operation,index) in list" :key="index" class="logItem">
        <view class="flexCenter">
          <view class="flexGrow">
            <view class="type">{{ format(operation).typeName || '' }}</view>
            × {{ operation.operationNumber }}
            <view style="margin-left: 8px">结余：{{ format(operation).balanceNumber || 0 }}</view>
          </view>
          <view> {{ operation.brandResult ? operation.brandResult.brandName : '' }}</view>
        </view>
        <view class="flexCenter info">
          <view class="flexGrow">
            {{ isObject(operation.positionsResult).name || '-' }} /
            {{ isObject(isObject(operation.positionsResult).storehouseResult).name || '-' }}
          </view>
          <view class="user">{{ isObject(operation.user).name }} / {{ MyDate.Show(operation.operationTime) }}</view>
        </view>
        <view style="padding: 8px 0">
          来源：{{ operation.theme || '-' }}
          <uni-icons v-if="operation.taskId" type="right"></uni-icons>
        </view>
        <view class="space"></view>
      </view>
    </List>
  </view>
</template>


<script>

import List from "../../../components/List/index";
import {Sku} from "MES-Apis/lib/Sku/promise";
import {ReceiptsEnums} from "../../../Erp/Receipt/ReceiptsEnums";
import {isObject, MyDate} from "../../../util/Tools";

export default {
  name: "SkuLog",
  components: {List},
  props: ['skuId'],
  data() {
    return {
      Sku,
      list: [],
      isObject,
      MyDate
    }
  },
  methods: {
    format(item) {
      let typeName = '';
      let balanceNumber;

      switch (item.source) {
        case ReceiptsEnums.instockOrder:
          typeName = '入库';
          balanceNumber = item.balanceNumber;
          break;
        case ReceiptsEnums.outstockOrder:
          typeName = '出库';
          balanceNumber = item.balanceNumber;
          break;
        case ReceiptsEnums.stocktaking:
          typeName = item.taskId ? '盘点' : '即时盘点';
          break;
        case ReceiptsEnums.maintenance:
          typeName = '养护';
          break;
        case ReceiptsEnums.allocation:
          typeName = '调拨';
          break;
        default:
          break;
      }
      return {
        typeName,
        balanceNumber
      }
    }
  }
}
</script>

<style lang="scss">

.logItem {
  padding: 8px 12px 0 12px;
  font-size: 14px;

  > view {
    padding-bottom: 8px;
  }

  .info {
    border-bottom: solid 1px #D8D8D8;

    .user {
      min-width: 170px;
      text-align: right;
    }
  }

  .type {
    color: #2680eb;
  }

  .flexCenter {
    display: flex;
    align-items: center;

    .flexGrow {
      display: flex;
      flex-grow: 1;
    }
  }
}

.space {
  margin: 0 -12px;
  padding: 0 !important;
  background-color: $body-color;
  height: 3px;
}

.scroll {
  color: #999999;
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

</style>
