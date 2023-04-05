<template>
  <view>
    <view class="stock">
      <view class="search">
        <Search placeholder="请输入物料相关信息" :value="value" :readonly="true" @click="click" />
      </view>
      <view v-if="!loading" class="skuClass">
        <scroll-view scroll-x="true" class="scroll-view">
          <view :class="{classItem:true, choose:!checkSkuClass}" @click="clickSkuClass(null)">
            全部
          </view>
          <view
              v-for="(item,index) in skuClass"
              :key="index"
              :class="{classItem:true, choose:checkSkuClass === item.value}"
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
            max-height="calc(100vh - 150px)"
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
    </view>
  </view>

</template>

<script>
import SkuItem from '../../components/SkuItem'
import Search from "../../components/Search";
import List from "../../components/List/indx";
import {Sku} from "MES-Apis/lib/Sku/promise";
import {isArray} from "../../util/Tools";
import Loading from "../../components/Loading";

export default {
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
      checkSkuClass: '',
      loading: false
    }
  },
  mounted() {
    const _this = this;
    _this.getSkuClass()
    uni.$on(this.eventName, data => {
      _this.refreshList({keyWord: data.searchValue})
      _this.value = data.searchValue
    })
  },
  methods: {
    getSkuClass() {
      this.loading = true
      Sku.spuClassListSelect({data: {}}).then((res) => {
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
      await Sku.getMediaUrls({
        mediaIds: newSkuList.map(item => item.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      }).then((res) => {
        isArray(res?.data).map(item => {
          this.skuImages.push(item)
        })
      }).catch(() => {
      })
    },
    clickSkuClass(checkSkuClass) {
      this.refreshList({categoryId: checkSkuClass})
      this.checkSkuClass = checkSkuClass
    },
    refreshList(data) {
      const newScreenData = {
        ...this.screenData,
        ...data
      }
      this.screenData = newScreenData
      this.$refs.skuList.submit(newScreenData)
    }
  }
}
</script>

<style lang="scss">

.stock {
  height: 100vh;
  background-color: #FFFFFF;
}

.skuClass {
  background-color: $body-color;
}

.search {
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
