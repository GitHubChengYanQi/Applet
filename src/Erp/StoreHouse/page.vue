<template>
  <view>
    <view class="search">
      <Search :value="searchValue" @onChange="(value)=>searchValue = value" @onSearch="onSearch" />
    </view>
    <view :class="{list:list.length > 0}">
      <List
          :max-height="`calc(100vh - 58px - 8px - 60px - ${safeAreaHeight(this,8)}px)`"
          ref="list"
          :list="list"
          @request="Storehouse.storeHouseList"
          @listSource="(newList)=>list = newList"
      >
        <view
            v-for="(item,index) in list"
            :key="index"
            class="listItem"
        >
          <view class="name">
            <view class="storeName">
              <Icon icon="icon-cangkuguanli1" size="22" />
              {{ item.name }}
            </view>
            <view class="skuCount">
              <Icon icon="icon-pandianwuliao" size="18" />
              {{ item.number || 0 }}
            </view>
          </view>
          <view class="coding">
            仓库码：{{ item.coding }}
          </view>
          <view class="palce">
            地点：{{ item.palce || '-' }}
          </view>
          <view class="action">
            <view class="actionItem" @click="edit(item)">
              修改
            </view>
            <view style="color: #e1ebf6">|</view>
            <view class="actionItem" @click="positions(item)">
              管理库位
            </view>
            <view style="color: #e1ebf6">|</view>
            <view class="actionItem remove" @click="del(item)">
              删除
            </view>
          </view>
        </view>
      </List>
    </view>
    <BottomButton
        only
        text="新建仓库"
        @onClick="create"
    />

    <Modal ref="modal" />

  </view>
</template>

<script>
import List from "../../components/List/indx";
import Icon from "../../components/Icon";
import Search from "../../components/Search";
import BottomButton from "../../components/BottomButton";
import {safeAreaHeight} from "../../util/Tools";
import {Message} from "../../components/Message";
import {Storehouse} from "MES-Apis/lib/Storehouse";
import Modal from "../../components/Modal";

export default {
  components: {Modal, BottomButton, Search, Icon, List},
  data() {
    return {
      safeAreaHeight,
      Storehouse,
      list: [],
      searchValue: '',
      loading: false
    }
  },
  mounted() {
    const _this = this
    uni.$on('storeHouseAddSuccess', () => {
      _this.searchValue = ''
      _this.$refs.list.submit()
    })

    uni.$on('storeHouseEditSuccess', (data) => {
      _this.searchValue = ''
      _this.list = _this.list.map(item => {
        if (item.storehouseId === data.storehouseId) {
          return data
        }
        return item
      })
    })
  },
  methods: {
    onSearch(value) {
      this.$refs.list.submit({name: value})
    },
    create() {
      uni.navigateTo({
        url: '/Erp/StoreHouse/StoreHouseAdd/index'
      })
    },
    edit(item) {
      uni.navigateTo({
        url: `/Erp/StoreHouse/StoreHouseAdd/index?id=${item.storehouseId}`
      })
    },
    positions(item) {
      uni.navigateTo({
        url: `/Erp/Positions/index?storehouseId=${item.storehouseId}&store=${item.name}`
      })
    },
    del(item) {
      const _this = this
      this.$refs.modal.dialog({
        title: '确定要删除仓库【' + item.name + '】吗？',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            Storehouse.storeHouseDelete({
              data: {
                storehouseId: item.storehouseId
              }
            }).then(() => {
              _this.list = _this.list.filter(listItem => listItem.storehouseId !== item.storehouseId)
              Message.successToast('删除成功！')
              resolve(true)
            }).catch(() => {
              Message.errorToast('删除失败！')
              resolve(false)
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.search {
  padding: 0 12px;
  background-color: #fff;
}

.list {
  padding: 8px 12px;
}

.listItem {
  background-color: #fff;
  border-radius: 4px;
  padding: 12px 12px 0;
  margin-bottom: 4px;

  .name {
    display: flex;
    align-items: center;
    gap: 4px;
    border-bottom: solid 1px $body-color;
    padding-bottom: 8px;

    .storeName {
      flex-grow: 1;
      display: flex;
      gap: 4px;
      font-weight: bold;
    }

    .skuCount {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      color: #f0ad4e;
    }
  }

  .coding {
    font-size: 14px;
    padding-top: 8px;
  }

  .palce {
    font-size: 14px;
    padding: 8px 0;
    color: #666666;
    border-bottom: solid 1px $body-color;
  }

  .action {
    display: flex;
    align-items: center;

    .actionItem {
      padding: 8px;
      flex-grow: 1;
      display: flex;
      justify-content: center;
      color: #007aff;
      font-size: 14px;
    }

    .remove {
      color: $uni-color-error;
    }
  }
}
</style>
