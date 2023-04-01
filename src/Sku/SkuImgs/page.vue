<template>
  <view class="skuImgs">
    <Uploader :size="imgWidth" @onChange="onChange" />
    <view
        v-for="(item,index) in imgList"
        :key="index"
        class="imgItem"
        @click="click(item)"
    >
      <u--image
          :showLoading="true"
          :src="item.url"
          :width='imgWidth'
          :height="imgWidth"
      />
    </view>

    <Loading :loading="loading" />
  </view>
</template>

<script>
import Uploader from "../../components/Uploader";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Loading from "../../components/Loading";

export default {
  name: 'SkuImgs',
  components: {Loading, Uploader},
  props: ['skuId', 'imgs'],
  data() {
    return {
      imgList: [],
      imgWidth: 0,
      loading: false,
    }
  },
  created() {
    this.imgList = this.imgs
    this.imgWidth = (this.$store.state.systemInfo.systemInfo.windowWidth - 36) / 2
  },
  methods: {
    onChange(file) {
      const newImgList = [file, ...this.imgList]
      this.updateImgs(newImgList)
    },
    click(item) {
      const _this = this
      uni.showActionSheet({
        itemList: ['删除'],
        success() {
          const newImgList = _this.imgList.filter(img => img.id !== item.id)
          _this.updateImgs(newImgList)
        },
      })
    },
    updateImgs(newImgList) {
      this.loading = true
      Sku.editEnclosure({
        data: {
          skuId: this.skuId,
          images: newImgList.map(item => item.id).join(','),
        },
      }).then(() => {
        this.$emit('update')
        this.imgList = newImgList
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.skuImgs {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  .imgItem {
    position: relative;

    .close {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }
}
</style>
