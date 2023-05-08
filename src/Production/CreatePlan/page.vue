<template>
  <view style="height: 100vh;background-color: #fff">
    <view style="padding: 0 12px">
      <Search :value="searchValue" @onChange="(value)=>searchValue = value" @onSearch="onSearch" />
    </view>
    <Card
        title="请选择Bom"
        body-style="padding: 8px 0 0"
        style="padding-top: 0"
    >
      <List
          ref="list"
          max-height="calc(100vh - 100px)"
          :list="list"
          @listSource="listSource"
          @request="Bom.bomListV2_0"
      >
        <view
            v-for="item in list"
            :key="item.bomId"
        >
          <view class="bomItem" @click="click(item.bomId)">
            <view class="sku">
              <SkuItem
                  no-view
                  extra-width="60px"
                  :sku-result="skuResultFormat(item.skuResult)"
                  :other-data="['版本号：'+(item.version || '-')]"
              />
            </view>
            <u-icon name="arrow-right"></u-icon>
          </view>
        </view>
      </List>
    </Card>
  </view>
</template>

<script>
import Card from '../../components/Card/index'
import Search from "../../components/Search";
import List from "../../components/List/index";
import {Bom} from "MES-Apis/lib/Bom/promise";
import SkuItem from "../../components/SkuItem";
import {Sku} from "MES-Apis/lib/Sku/promise";
import {isArray} from "../../util/Tools";

export default {
  components: {
    SkuItem,
    List,
    Search,
    Card,
  },
  data() {
    return {
      searchValue: '',
      Bom,
      list: [],
      skuImages: [],
    }
  },
  mounted() {

  },
  methods: {
    onSearch(value) {
      this.$refs.list.submit({keywords: value})
    },
    click(bomId) {
      uni.navigateTo({
        url: `/Production/BomDetailList/index?bomId=${bomId}`
      })
    },
    async listSource(list, newList) {
      this.list = list
      await Sku.getMediaUrls({
        mediaIds: newList.map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      }).then((res) => {
        isArray(res?.data).map(item => {
          this.skuImages.push(item)
        })
      }).catch(() => {
      })
    },
    skuResultFormat(item) {
      const media = this.skuImages.find(mediaItem => mediaItem.mediaId === item.images?.split(',')[0]) || {}
      return {
        ...item,
        thumbUrl: media.thumbUrl
      }
    },
  }
}
</script>

<style lang="scss">
.bomItem {
  padding-bottom: 8px;
  display: flex;
  align-items: center;

  .sku {
    flex-grow: 1;
  }
}
</style>
