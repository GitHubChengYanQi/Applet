<template>
  <u-upload
      :disabled="loading"
      use-before-read
      @beforeRead="uploader"
      :multiple="multiple"
  >
    <slot>
      <view v-if="file">
        <u-button size="small" customStyle="width:100px">
          <view class="uploadFile">
            <uni-icons type="upload"></uni-icons>
            上传
          </view>
        </u-button>
      </view>
      <view v-else-if="!$slots.default" class="upload" :style="{width:`${size}px`,height:`${size}px`}">
        <u-loading-icon v-if="loading" mode="circle" :vertical="true"></u-loading-icon>
        <u-icon v-else :size="size / 2" color="#dcdee0" name="camera-fill"></u-icon>
      </view>
    </slot>
  </u-upload>
</template>

<script>
import {request} from 'MES-Apis/lib/Service/request';
import {Message} from "../Message";

export default {
  name: 'Uploader',
  props: {
    value: Array,
    multiple: Boolean,
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
      loading: false,
      uploadCount: 0
    }
  },
  methods: {
    getToken(fielname) {
      this.fielname = fielname
      return request({
        url: '/media/getToken',
      }, {
        params: {
          type: fielname
        }
      });
    },
    async uploader(event) {

      const {
        file,
        callback
      } = event;

      if (Array.isArray(file)) {
        this.uploadCount = 0
        this.batchUpload(file)
      } else {
        callback(await this.uploadFile(file.url));
      }

    },
    async batchUpload(files) {
      await this.uploadFile(files[this.uploadCount].url).then(() => {
        this.uploadCount = this.uploadCount + 1
        if (this.uploadCount !== files.length) {
          this.batchUpload(files)
        }
      })
    },
    uploadFile(url, params) {
      const _this = this;
      return new Promise(async (resolve) => {
        const fileSuffix = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (!this.file && !['jpg', 'jpeg', 'png', 'webp'].includes(fileSuffix)) {
          Message.toast('请上传图片!')
          resolve(false)
          return
        }
        this.loading = true
        this.$emit('loading', true)
        const response = await this.getToken(url).catch(() => {
          Message.errorToast('上传失败！')
          resolve(false)
          this.loading = false
          this.$emit('loading', false)
        });
        const oss = response.data;
        uni.uploadFile({
          url: oss.host,
          filePath: url,
          name: 'file',
          formData: {
            ...oss
          },
          success: () => {
            this.loading = false
            this.$emit('loading', false)
            _this.$emit("onChange", {
              id: oss.mediaId,
              url: `${oss.host}/${oss.key}`,
              name: this.fielname,
              type: fileSuffix,
              ...params
            });
            resolve(true)
          },
          fail: () => {
            Message.errorToast('上传失败！')
            this.loading = false
            this.$emit('loading', false)
            resolve(false)
          }
        });
      })
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

.uploadFile {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
