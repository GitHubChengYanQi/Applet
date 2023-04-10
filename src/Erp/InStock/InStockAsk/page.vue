<template>
  <view>
    <view class="selectOrder">
      <view style="padding: 0 12px">
        <Search
            placeholder='搜索编码、主题、供应商名称'
            :value="searchValue"
            @onChange="(val)=>searchValue = val"
            @onSearch="onSearch"
        />
      </view>
      <Card title="请选择采购订单" body-style="padding:0" style="padding-top: 0">
        <List
            :description="value ? '未查询到采购订单' : '请通过搜索查询采购订单'"
            ref="listRef"
            max-height="calc(100vh - 110px)"
            @request="InStock.showOrderListV2_0"
            :list="list"
            @listSource="(newList)=>list = newList"
        >
          <view
              v-for="(item,index) in list"
              :key="index"
              @click="onCheck(item)"
          >
            <view class="card">
              <view class="cardHeader">
                <view class='cardTitle'>
                  <div class='header'>
                    <div class='title'>{{ item.coding }}</div>
                  </div>
                </view>
                <view class="extra">
                  {{ timeDifference(item.createTime) }}
                </view>
              </view>
              <view class="body">
                <div class='theme'>{{ item.theme || '无主题' }}</div>
                <view>{{ item.sellerResult ? item.sellerResult.customerName : '无供应商' }}</view>
                <view style="display: flex;align-items: center">
                  入库进度：<u-line-progress :percentage="Math.round((item.inStockNumber / item.purchaseNumber) * 100) || 0"></u-line-progress>
                </view>
                <div class='user'>
                  创建人：
                  <view class='userItem'>
                    <Avatar
                        :circular="true"
                        style="margin-right: 4px"
                        :src="item.createUserResult && item.createUserResult.avatar" size="18"
                    />
                    {{ item.createUserResult && item.createUserResult.name }}
                  </view>
                </div>
              </view>
            </view>
            <div class='space' />
          </view>
        </List>
      </Card>
    </view>
  </view>
</template>

<script>

import Card from "../../../components/Card";
import Search from "../../../components/Search";
import {InStock} from "MES-Apis/lib/InStock/promise";
import List from "../../../components/List/index";
import {timeDifference} from "../../../util/Tools";
import Avatar from "../../../components/Avatar";

export default {
  name: 'InStockAsk',
  components: {Card, Avatar, List, Search},
  data() {
    return {
      InStock,
      list: [],
      orderList: [],
      timeDifference,
      searchValue: '',
      value: ''
    }
  },
  methods: {
    onCheck(order) {
      uni.navigateTo({
        url: '/Erp/InStock/InStockAction/index',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('selectOrder', order)
        }
      })
    },
    onSearch(value) {
      this.value = value
      this.$refs.listRef.submit({
        keywords: value
      })
    }
  }
}
</script>

<style lang="scss">
.selectOrder {
  height: 100vh;
  background-color: #fff;
}

.orderList {
  padding: 0 12px;
}

.card {
  background-color: #fff;
  padding: 12px;
  font-size: 14px;
  color: #000;
  margin-bottom: 0;

  .cardHeader {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    //border-bottom: solid 1px $body-color;

    .cardTitle {
      display: flex;
      align-items: center;
      flex-grow: 1;

      .header {
        display: flex;
        align-items: center;
        //line-height: 14px;

        .title {
          font-size: 14px;
          color: $primary-color;
        }
      }
    }

    .extra {
      font-size: 12px;
      color: #a7a7a9;
    }
  }

  .body {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;


    .theme {
      display: flex;
      align-items: center;

      .themeValue {
        flex-grow: 1;
      }
    }

    .user {
      color: #a7a7a9;
      display: flex;
      font-size: 12px;

      .userItem {
        display: flex;
        align-items: center;
        margin-right: 8px;
      }
    }
  }
}

.space {
  margin: 0 12px;
  height: 1px;
  background-color: #f3f3f3;
}
</style>
