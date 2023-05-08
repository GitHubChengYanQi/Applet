<template>
  <view class="orderList">
    <view class="search">
      <Search
          placeholder='搜索编码、主题、供应商名称'
          :value="searchValue"
          @onChange="(value)=>searchValue = value"
          @onSearch="onSearch"
      />
    </view>
    <List
        ref="listRef"
        max-height="calc(100vh - 100px)"
        @request="Order.list"
        :list="list"
        @listSource="(newList)=>list = newList"
    >
      <view
          v-for="(item,index) in list"
          :key="index"
      >
        <view class="card" @click="click(item.orderId)">
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
            <view>{{ item.bcustomer ? item.bcustomer.customerName : '无' }}</view>
            <div class='user'>
              创建人：
              <view class='userItem'>
                <Avatar
                    :circular="true"
                    style="margin-right: 4px"
                    :src="item.user && item.user.miniAppAvatar" size="18"
                />
                {{ item.user ? item.user.name : '无' }}
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
import {timeDifference} from "../../../util/Tools";
import Search from "../../../components/Search";
import List from "../../../components/List/index.vue";
import Avatar from "../../../components/Avatar";
import {Order} from "MES-Apis/lib/Order/promise";

export default {
  name: 'OrderList',
  components: {Avatar, List, Search},
  data() {
    return {
      Order,
      list: [],
      orderList: [],
      timeDifference,
      searchValue: ''
    }
  },
  onLoad(option) {

  },
  methods: {
    onSearch(value) {
      this.$refs.listRef.submit({
        keywords: value
      })
    },
    click(id) {
      uni.navigateTo({
        url: `/Purchase/Order/OrderDetail/index?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss">
.orderList {
  background-color: #fff;
  height: 100vh;
  padding: 0;
}

.search {
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
    //border-bottom: solid 1px $body-Combox;

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
