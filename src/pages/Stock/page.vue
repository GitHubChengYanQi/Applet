<template>
  <view>
    <uni-nav-bar
        background-color="#e1ebf6"
        :height="totalHeight"
        color="#000"
        fixed
        class="navBar"
        leftWidth="100%"
    >
      <view slot="left" class="navLeft" @click="goToTenant">
        所有仓库
      </view>
    </uni-nav-bar>
    <view class="stock">
      <view class="stockSearch">
        <Search placeholder="请输入物料相关信息" :value="value" :readonly="true" @click="click" />
      </view>
      <view v-if="!loading" class="skuClass">
        <scroll-view scroll-x="true" class="scroll-view">
          <view :class="{classItem:true, choose:!screenData.categoryId}" @click="clickSkuClass(null)">
            全部
          </view>
          <view
              v-for="(item,index) in skuClass"
              :key="index"
              :class="{classItem:true, choose:screenData.categoryId === item.value}"
              @click="clickSkuClass(item.value)"
          >
            {{ item.label }}
          </view>
        </scroll-view>
      </view>
      <view class="content">
        <List
            ref="skuList"
            :list="skuList"
            :max-height="`calc(100vh - 103px - ${totalHeight}px)`"
            @request="Sku.listV1_1"
            @listSource="listSource"
        >
          <view
              v-for="(item,index) in skuList"
              :key="index"
              class="skuItem"
          >
            <SkuItem :sku-result="skuResultFormat(item)" />
          </view>
        </List>
      </view>

      <uni-fab :popMenu="false" horizontal="right" @fabClick="fabClick"></uni-fab>
    </view>
  </view>

</template>

<script>
import SkuItem from '../../components/SkuItem'
import Search from "../../components/Search";
import List from "../../components/List/index";
import {Sku} from "MES-Apis/lib/Sku/promise";
import {isArray} from "../../util/Tools";
import Loading from "../../components/Loading";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'Stock',
  components: {Loading, List, Search, SkuItem},
  data() {
    return {
      value: '',
      eventName: 'stock',
      Sku,
      skuList: [],
      skuImages: [],
      skuClass: [],
      totalHeight: 0,
      loading: false,
      screenData: {}
    }
  },
  mounted() {
    this.totalHeight = this.$store.state.systemInfo.navHeight
    const _this = this;
    _this.getSkuClass()
    uni.$on(this.eventName, data => {
      _this.refreshList({keyWord: data.searchValue})
      _this.value = data.searchValue
    })

    uni.$on('skuAddSuccess', _ => {
      _this.getSkuClass()
      _this.refreshList({})
    })
  },
  methods: {
    async getSkuClass() {
      this.loading = true
      await Sku.spuClassListSelect({data: {}}).then((res) => {
        this.skuClass = res.data || []
      }).finally(() => {
        this.loading = false
      })
    },
    skuResultFormat(item) {
      const media = this.skuImages.find(mediaItem => mediaItem.mediaId === item.images?.split(',')[0]) || {}
      return {
        ...item,
        thumbUrl: media.thumbUrl
      }
    },
    click() {
      uni.navigateTo({
        url: '/pages/searchPage/index?eventName=' + this.eventName + '&searchValue=' + this.value
      });
    },
    async listSource(skuList, newSkuList) {
      this.skuList = skuList
      if (newSkuList.length > 0) {
        await Sku.getMediaUrls({
          mediaIds: newSkuList.map(item => item.images?.split(',')[0]),
          option: 'image/resize,m_fill,h_74,w_74',
        }).then((res) => {
          isArray(res?.data).map(item => {
            this.skuImages.push(item)
          })
        }).catch(() => {
        })
      }
    },
    clickSkuClass(checkSkuClass) {
      this.refreshList({categoryId: checkSkuClass})
    },
    refreshList(data) {
      const newScreenData = {
        ...this.screenData,
        ...data
      }
      this.screenData = newScreenData
      this.$refs.skuList.submit(newScreenData)
    },
    async refresh() {
      await this.$refs.skuList.submit(this.screenData)
      await this.getSkuClass()
      uni.stopPullDownRefresh();
    },
    fabClick() {
      uni.navigateTo({
        url: '/Sku/SkuAdd/index'
      })
    }
  }
}
</script>

<style lang="scss">

.navBar {
  .uni-navbar__header {

    > view {
      align-items: flex-end;
    }
  }

  .uni-navbar__content {
    border: none;
  }

  .navLeft {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center !important;
    gap: 8px;
    padding-bottom: 9px;
  }
}

.stock {
  background-color: #FFFFFF;
  overflow-x: hidden;
}

.skuClass {
  background-color: $body-color;
}

.stockSearch {
  padding: 0 12px;
}

.scroll-view {
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  width: 100%;
  padding: 8px;
}

.classItem {
  display: inline-block;
  padding: 0 8px;
  text-align: center;
  margin: 0 8px;
}

.choose {
  background-color: #257BDE;
  border-radius: 50px;
  color: #fff;
  padding: 4px 12px;
}

.content {
  .skuItem {
    padding: 8px 12px;
    border-bottom: solid 1px #eee;
  }
}
</style>
