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

      <view class="search" v-if="false">
        <Search />
      </view>

      <Empty v-if="list.length === 0" description="暂无数据" />
      <view v-else>
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
    <view class="bottomButton" @click="scan">
      <view class="icon">
        <u-icon name="scan" size='36px' color="#fff"></u-icon>
      </view>
    </view>
    <Loading :loading="loading" />
  </view>
</template>

<script>
import Search from "../../../components/Search";
import {Storehouse} from "MES-Apis/lib/Storehouse";
import {isArray} from "../../../util/Tools";
import LinkButton from "../../../components/LinkButton";
import Loading from "../../../components/Loading";
import {Message} from "../../../components/Message";
import Empty from "../../../components/Empty";

export default {
  components: {
    Empty,
    Loading,
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
      message: '请点击扫码按钮扫描库位码或选择库位进行盘点',
      duration: 0,
      safeAreaInsetTop: false
    })
    this.getStorehouse()
  },
  computed: {
    loading() {
      return this.$store.state.qrCode.loading
    }
  },
  watch: {
    '$store.state.qrCode.codeId'(codeId) {
      if (codeId) {
        const qrCode = {...this.$store.state.qrCode}
        if (qrCode.type === 'storehousePositions') {
          const result = qrCode.result || {};
          if (result.storehousePositionsId) {
            if (result.lowestLevel) {
              this.goToStocktaking(result.storehousePositionsId, result.name, result.storehouseResult?.name)
            } else {
              Message.toast('请扫描最下级库位!');
            }
          } else {
            Message.errorToast('获取失败!');
          }
        } else {
          Message.errorToast('请扫描库位码!');
        }
      }
      this.$store.commit("qrCode/clear")
    }
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
        params: {ids: id}
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
        this.goToStocktaking(item.id, item.name, this.navs.find(item => item.type === 'storehouse')?.name)
      }
    },
    goToStocktaking(positionId, name, storehouse) {
      uni.navigateTo({
        url: `/Erp/Stocktaking/immediatelyDetail/index?positionId=${positionId}&name=${name}&storehouse=${storehouse}`
      })
    },
    pageClick(route, clickIndex) {
      if (clickIndex === 0) {
        this.navs = [{name: '全部仓库', id: 'all'}]
        this.getStorehouse()
      } else {
        this.navs = this.navs.filter((item, index) => index < clickIndex)
        this.action(route)
      }

    },
    scan() {
      this.$store.dispatch('qrCode/scanCode')
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
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
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
