<template>
  <Auth>
    <van-dialog id="van-dialog" />
    <Page
        v-if="auth && skuId"
        :imgs="imgs"
        :skuId="skuId"
        @update="update"
    />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  onLoad(option) {
    const _this = this
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    if (typeof eventChannel.on === 'function') {
      eventChannel.on('skuImgs', function (imgs) {
        _this.skuId = option.skuId
        _this.imgs = imgs.filter(item => item.mediaId).map(item => ({
          url: item.url,
          thumbUrl: item.thumbUrl,
          id: item.mediaId,
          name: item.filedName
        }))
      })
    }
  },
  data() {
    return {
      imgs: [],
      skuId: ''
    }
  },
  methods: {
    update() {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('refresh');
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
