<template>
  <view>
    <u-notify ref="uNotify"></u-notify>
    <view class="white">

      <view class="breadcrumb">
        <uni-breadcrumb separator="/">
          <uni-breadcrumb-item v-for="(route,index) in navs" :key="index">
            <view @click="pageClick(route,index)">
              {{ route.name }}
            </view>
          </uni-breadcrumb-item>
        </uni-breadcrumb>
      </view>

      <view class="search">
        <Search />
      </view>

      <view>
        <view
            v-for="(item,index) in list"
            :key="index"
            class="item"
            @click="action(item)"
        >
          <view class="name">
            {{ item.name }}
          </view>

          <view class="actions">
            <LinkButton v-if="item.type === 'position' && isArray(item.children).length === 0">
              <u-icon color="#007aff" name="play-circle" />
            </LinkButton>
            <LinkButton v-else>
              <u-icon name="arrow-right" />
            </LinkButton>
          </view>

        </view>
      </view>

    </view>
    <view class="bottomButton">
      <view class="icon">
        <u-icon name="scan" size='36px' color="#fff"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import Search from "../../../components/Search";
import {Storehouse} from "MES-Apis/src/Storehouse";
import {isArray} from "../../../util/Tools";
import LinkButton from "../../../components/LinkButton";

export default {
  components: {
    LinkButton,
    Search
  },
  data() {
    return {
      show: true,
      navs: [{name: '全部仓库', id: 'all'}],
      list: [],
      isArray
    }
  },
  mounted() {
    this.$refs.uNotify.show({
      type: 'primary ',
      message: '请打开手机摄像头或选择库位进行盘点',
      duration: 0,
      safeAreaInsetTop: false
    })
    this.getStorehouse()
  },
  methods: {
    getStorehouse() {
      Storehouse.listSelect({
        data: {}
      }, {}).then((res) => {
        this.list = isArray(res.data).map(item => ({
          name: item.label,
          id: item.value,
          type: 'storehouse'
        }))
      })
    },
    getPositions(id) {
      Storehouse.positionsTreeView({
        data: {id}
      }, {}).then((res) => {
        this.list = isArray(res.data).map(item => ({
          name: item.title,
          id: item.key,
          type: 'position',
          children: item.children || []
        }))
      })
    },
    action(item) {
      if (item.type === 'storehouse') {
        this.navs.push(item)
        this.getPositions(item.id)
      } else if (isArray(item.children).length > 0) {
        this.navs.push(item)
        this.list = isArray(item.children).map(item => ({
          name: item.title,
          id: item.key,
          type: 'position',
          children: item.children || []
        }))
      } else {
        uni.navigateTo({
          url: '/Erp/Stocktaking/immediatelyDetail/index'
        })
      }
    },
    pageClick(route, clickIndex) {
      if (clickIndex === 0) {
        this.navs = [{name: '全部仓库', id: 'all'}]
        this.getStorehouse()
      } else {
        this.navs = this.navs.filter((item, index) => index < clickIndex)
        this.action(route)
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.white {
  padding-top: 36px;
  background-color: #fff;

  .search {
    padding: 0 12px;
  }
}

.breadcrumb {
  padding: 12px;
  border-bottom: solid 1px #eee;
}

.grey {
  color: #878585;
  font-size: 14px;
}

.bottomButton {
  text-align: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #007AFF;
  position: absolute;
  bottom: 24px;
  left: calc(50% - 40px);
  box-shadow: 0px -4px 10px 0px rgb(0 0 0 / 10%);
}

.item {
  padding: 12px;
  border-bottom: solid 1px #eee;
  display: flex;
  align-items: center;

  .name {
    flex-grow: 1;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.icon {
  width: 50px;
  padding: 22px;
}
</style>
