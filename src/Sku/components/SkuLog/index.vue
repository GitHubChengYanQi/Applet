<template>
  <view style="height: 60vh; top: 0">
    <view class="space" style="height: 1px"></view>
    <view style="overflow: auto; max-height: calc(80vh - 60px)">
      <view class="logItem" v-for="operation in operationRecord" :key="operation.operationRecordId">
        <view class="flexCenter">
          <view class="flexGrow">
            <view class="type">{{ operation.type }}</view>
            ×{{ operation.operationNumber }}
            <view style="margin-left: 8px">结余：{{ operation.balanceNumber }}</view>
          </view>
          <view> {{ operation.brandName }}</view>
        </view>
        <view class="flexCenter info">
          <view class="flexGrow">
            {{ operation.positionName }}
          </view>
          <view class="user">{{ operation.user }} / {{ operation.time }}</view>
        </view>
        <view style="padding: 8px 0">
          来源：{{ operation.theme }}
          <uni-icons type="right"></uni-icons>
        </view>
        <view class="space"></view>
      </view>
      <view class="scroll">
        --- 我是有底线的 ---
      </view>
    </view>
  </view>
</template>


<script>

export default {
  name: "SkuLog",
  data() {
    return {
      operationRecord: [
        {
          operationRecordId: 1,
          type: '· 入库',
          operationNumber: 50,
          balanceNumber: 100634,
          brandName: '无品牌',
          positionName: 'Z1-3-2/南坡大库',
          user: '孙嘉龙',
          time: '03月02日 10:32',
          theme: '采购订单1111'
        },
        {
          operationRecordId: 2,
          type: '· 出库',
          operationNumber: 456,
          balanceNumber: 1078945,
          brandName: '浑河库存',
          positionName: 'mi电视库位 / 小米仓库',
          user: '孙嘉龙',
          time: '03月08日 10:32',
          theme: '第二份采购订单'
        },
        {
          operationRecordId: 3,
          type: '· 出库',
          operationNumber: 456,
          balanceNumber: 1078945,
          brandName: '浑河库存',
          positionName: 'mi电视库位 / 小米仓库',
          user: '孙嘉龙',
          time: '03月08日 10:32',
          theme: '第二份采购订单'
        },
        {
          operationRecordId: 4,
          type: '· 出库',
          operationNumber: 456,
          balanceNumber: 1078945,
          brandName: '浑河库存',
          positionName: 'mi电视库位 / 小米仓库',
          user: '孙嘉龙',
          time: '03月08日 10:32',
          theme: '第二份采购订单'
        },
        {
          operationRecordId: 5,
          type: '· 出库',
          operationNumber: 456,
          balanceNumber: 1078945,
          brandName: '浑河库存',
          positionName: 'mi电视库位 / 小米仓库',
          user: '孙嘉龙',
          time: '03月08日 10:32',
          theme: '第二份采购订单'
        },
        {
          operationRecordId: 6,
          type: '· 出库',
          operationNumber: 456,
          balanceNumber: 1078945,
          brandName: '浑河库存',
          positionName: 'mi电视库位 / 小米仓库',
          user: '孙嘉龙',
          time: '03月08日 10:32',
          theme: '第二份采购订单'
        },        {
          operationRecordId:7,
          type:'· 出库',
          operationNumber:456,
          balanceNumber:1078945,
          brandName:'浑河库存',
          positionName:'mi电视库位 / 小米仓库',
          user:'孙嘉龙',
          time:'03月08日 10:32',
          theme:'第二份采购订单'
        },
        {
          operationRecordId:8,
          type:'· 出库',
          operationNumber:456,
          balanceNumber:1078945,
          brandName:'浑河库存',
          positionName:'mi电视库位 / 小米仓库',
          user:'孙嘉龙',
          time:'03月08日 10:32',
          theme:'第二份采购订单'
        }
      ]
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
  background-color: #f5f5f5;
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