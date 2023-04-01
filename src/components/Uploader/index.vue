<template>
  <van-uploader
      use-before-read
      @before-read="uploader"
  >
    <view class="upload" :style="{width:`${size}px`,height:`${size}px`}">
      <Loading skeleton v-if="loading" loadingText="上传中" />
      <u-icon v-else :size="size / 2" color="#dcdee0" name="camera-fill"></u-icon>
    </view>
  </van-uploader>
</template>

<script>
import {request} from 'MES-Apis/lib/Service/request';
import {getLocalParmas} from "../../util/Tools";
import {Message} from "../Message";
import Loading from "../Loading";

export default {
  name: 'Uploader',
  components: {Loading},
  behaviors: ['uni://form-field'],
  props: {
    value: Array,
    file: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      fielname: '',
      loading: false
    }
  },
  methods: {
    getToken(fielname) {
      this.fielname = fielname
      return request({
        url: '/media/getToken',
        params: {
          type: fielname
        }
      });
    },
    async uploader(event) {
      const _this = this;
      const {
        file,
        callback
      } = event.detail;

      const fileSuffix = file.url.substring(file.url.lastIndexOf('.') + 1).toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(fileSuffix)) {
        Message.toast('请上传图片!')
        return
      }
      this.loading = true
      const response = await this.getToken(file.url).catch(() => {
        this.loading = false
      });
      const oss = response.data;
      uni.uploadFile({
        url: oss.host, //仅为示例，非真实的接口地址
        filePath: file.url,
        name: 'file',
        formData: {
          ...oss
        },
        success: () => {
          this.loading = false
          _this.$emit("onChange", {
            id: oss.mediaId,
            url: `${oss.host}/${oss.key}`,
            name: this.fielname
          });
        },
        fail: () => {
          Message.errorToast('上传失败！')
          this.loading = false
        }
      });
      callback(true);
    }
  }
}
</script>

<style lang="scss">
.upload {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #f7f8fa;
}
</style>
