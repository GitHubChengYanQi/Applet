<template>
  <view style="height: 100vh;background-color: #fff">
    <view style="padding: 0 12px">
      <Search />
    </view>
    <Card
        title="请选择Bom"
        body-style="padding: 8px 0 0"
        style="padding-top: 0"
    >
      <List
          max-height="calc(100vh - 100px)"
          :list="list"
          @listSource="(newList)=>list = newList"
          @request="Bom.list"
      >
        <view
            v-for="item in list"
            :key="item.partsId"
        >
          <view class="bomItem" @click="click(item.partsId)">
            <view class="sku">
              <SkuItem
                  no-view
                  extra-width="60px"
                  :sku-result="item.skuResult"
                  :other-data="['当前版本：'+(item.name || '-')]"
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
import Card from '../../components/Card/index.vue'
import Search from "../../components/Search";
import List from "../../components/List/index";
import {Bom} from "MES-Apis/lib/Bom/promise";
import SkuItem from "../../components/SkuItem";

export default {
  components: {
    SkuItem,
    List,
    Search,
    Card,
  },
  data() {
    return {
      Bom,
      list: []
    }
  },
  mounted() {

  },
  methods: {
    click(partsId) {
      uni.navigateTo({
        url:`/Production/BomDetailList/index?bomId=${partsId}`
      })
    }
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
