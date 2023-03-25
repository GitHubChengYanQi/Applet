<template>
  <view>
    <view :class="['skuList', className]">
      <view
          :id='imgId'
          class='img'
          :style="{ maxHeight: `${skuImgSize}px`, minWidth: `${skuImgSize}px` }"
          @click='view'
      >
        <image
            :src='skuResult.thumbUrl || (isArray(skuResult.imgResults)[0] || {}).thumbUrl || publicInfo.imgLogo'
            :style="{ height: `${skuImgSize}px`, width: `${skuImgSize}px` }"
            alt=''
        />
        <view v-if="!hiddenNumber" class='number'>
          {{ getStockNumber() || 0 }}{{ unitName || skuResult.unitName || unitResult.unitName || '' }}
          <span v-if="skuResult.lockStockDetailNumber > 0" class='error'>
              <van-icon name="warn-o" />
          </span>
        </view>
      </view>
      <view
          @click='view'
          class='sku'
          :style="{ height: `${skuImgSize}px`,maxWidth: `calc(100vw - ${skuImgSize}px - 13px - ${extraWidth || '0px'})`}"
      >
        <Elliptsis width='100%'>
          {{ title || SkuResultSkuJsons({skuResult, spu: !oneRow}) || '' }}
        </Elliptsis>
        <view v-if="!oneRow" class='describe'>
          <Elliptsis width='100%'>
            {{ describe || SkuResultSkuJsons({skuResult, sku: true}) || '' }}
          </Elliptsis>
        </view>
        <view v-if="!(otherData.length === 0 || !otherData.some(item => item))">
          <view
              v-for="(item,index) in otherData"
              :key="index"
              class='otherData'
          >
            <Elliptsis v-if="isString(item)" width='100%'>
              {{ item }}
            </Elliptsis>
            <view v-else>{{ item }}</view>
          </view>
        </view>
        <slot name="otherData"></slot>
      </view>
    </view>
    <view
        v-if="more"
        class='more'
        :style="{ maxWidth: `calc(100vw - 13px - ${extraWidth})` }"
        @click="$emit('moreClick')"
    >
      <Elliptsis width='100%'>
        {{ more }}
      </Elliptsis>
    </view>
  </view>
</template>

<script>
import {isArray} from "../../util/Tools";
import {SkuResultSkuJsons, SkuFormat} from "../../Sku/sku";
import Elliptsis from "../Ellipsis";

export default {
  name: 'SkuItem',
  components: {Elliptsis},
  props: {
    hiddenNumber: Boolean,
    number: undefined,
    unitName: String,
    skuResult: {
      type: Object,
      default() {
        return {}
      }
    },
    otherData: {
      type: Array,
      default() {
        return [];
      }
    },
    extraWidth: String,
    imgSize: Number,
    imgId: String,
    className: String,
    describe: String,
    title: String,
    more: Boolean,
    noView: Boolean,
    oneRow: Boolean,
    backTitle: Boolean,
    showDetail: Boolean
  },
  data() {
    return {
      SkuResultSkuJsons,
      SkuFormat,
      publicInfo: {},
      unitResult: {},
      skuImgSize: 74,
      isArray,
    }
  },
  mounted() {
    const spuResult = this.skuResult.spuResult || {};
    this.unitResult = spuResult.unitResult || {}
    this.publicInfo = this.$store.state.userInfo.publicInfo
    this.skuImgSize = this.imgSize || 74
  },
  methods: {
    isString(item) {
      return typeof item === 'string'
    },
    view() {
      if (!this.skuResult.skuId || this.noView) {
        return
      }
      uni.navigateTo({
        url: `/Sku/SkuDetail/index?skuId=${this.skuResult.skuId}`
      })
    },
    getStockNumber() {
      const stockNumber = (this.skuResult.stockNumber || this.skuResult.stockNum || 0) - (this.skuResult.lockStockDetailNumber || 0);
      return typeof this.number === 'number' ? this.number : stockNumber;
    }
  }
}
</script>

<style lang="scss">
.skuList {
  display: flex;
  font-size: 14px;
  line-height: normal;
  align-items: flex-start;

  .img {
    border-radius: 4px;
    border: solid #F1F1F1 1px;
    overflow: hidden;
    position: relative;

    img {
      filter: grayscale(50%);
    }

    .number {
      font-size: 12px;
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
      color: #fff;
      background-color: rgba(27, 27, 27, 0.5);

      .error {
        margin-left: 4px;

        svg {
          font-size: 12px;
        }
      }
    }
  }

  .sku {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-left: 12px;
    justify-content: space-evenly;

    .describe {
      color: #808080;
      height: 16px;
    }
  }


  .otherData {
    //display: inline-block;
    margin-top: 4px;
    max-width: 100%;
    color: #3D3D3D;
    //background-color: #F5F5F5;
    font-size: 12px;
    height: 16px;
    //padding: 2px 11px 2px 11px;
    //border-radius: 50px;
  }
}

.more {
  display: inline-block;
  max-width: 100%;
  margin: 8px 0;
  color: #3D3D3D;
  background-color: #F5F5F5;
  font-size: 12px;
  padding: 2px 11px 2px 11px;
  border-radius: 50px;
}

.skuDetail {
  :global {
    //.adm-popup-body {
    //  background-color: var(--body--background--color);
    //  overflow: auto;
    //}
  }
}

</style>
