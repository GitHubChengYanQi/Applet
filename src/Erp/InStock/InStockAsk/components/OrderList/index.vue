<template>
  <view class="orderList" :style="{padding:maxHeight && '0'}">
    <Search
        placeholder='搜索编码、主题、供应商名称'
        :value="searchValue"
        @onChange="(value)=>searchValue = value"
        @onSearch="onSearch"
    />
    <List
        ref="listRef"
        :max-height="maxHeight || '50vh'"
        @request="InStock.showOrderListV2_0"
        :list="list"
        @listSource="(newList)=>list = newList"
    >
      <view
          v-for="(item,index) in list"
          :key="index"
          @click="$emit('onCheck',item)"
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
            <view>供应商</view>
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
  </view>
</template>
<script>
import Search from "../../../../../components/Search";
import {InStock} from "MES-Apis/src/InStock/promise";
import List from "../../../../../components/List/indx";
import {timeDifference} from "../../../../../util/Tools";
import Avatar from "../../../../../components/Avatar";

export default {
  name: 'OrderList',
  props: ['maxHeight'],
  components: {Avatar, List, Search},
  data() {
    return {
      InStock,
      list: [],
      orderList: [],
      timeDifference,
      searchValue: ''
    }
  },
  mounted() {
    getApp().globalData.token = ''
  },
  methods: {
    onSearch(value) {
      this.$refs.listRef.submit({
        keywords: value
      })
    }
  }
}
</script>

<style lang="scss">
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
