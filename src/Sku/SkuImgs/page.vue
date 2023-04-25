<template>
  <view class="body">
    <view
        class="header"
        :style="{backgroundImage:imgList.length > 0 && `url(${imgList[0].url.split('?')[0]+'?x-oss-process=image%2Fresize%2Cm_fill%2Ch_200%2Cw_'+windowWidth})`}"
    >
      <view class="box">
        <view class="title">
          物料相册
        </view>
        <view class="des">
          {{ imgList.length }} 照片
        </view>
      </view>
    </view>
    <Empty description="请为物料添加照片" v-if="imgList.length === 0" />
    <view class="skuImgs">
      <view
          v-for="(item,index) in imgList"
          :key="index"
          class="imgItem"
          @click="click(item)"
      >
        <u--image
            :showLoading="true"
            :src="item.thumbUrl || item.url"
            :width='imgWidth'
            :height="imgWidth"
        />
      </view>

      <Loading :loading="loading" />

      <Uploader @onChange="onChange">
        <uni-fab horizontal="right"></uni-fab>
      </Uploader>
    </view>
  </view>

</template>

<script>
import Uploader from "../../components/Uploader";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";

export default {
  name: 'SkuImgs',
  components: {Empty, Loading, Uploader},
  props: ['skuId', 'imgs'],
  data() {
    return {
      imgList: [],
      imgWidth: 0,
      windowWidth: 0,
      loading: false,
    }
  },
  created() {
    this.windowWidth = this.$store.state.systemInfo.systemInfo.windowWidth
    this.imgList = this.imgs
    this.imgWidth = (this.$store.state.systemInfo.systemInfo.windowWidth - 32) / 3
  },
  methods: {
    onChange(file) {
      const newImgList = [file, ...this.imgList]
      this.updateImgs(newImgList)
    },
    click(item) {
      const _this = this
      uni.showActionSheet({
        itemList: ['预览', '下载', '置顶', '删除'],
        success(event) {
          switch (event.tapIndex) {
            case 0:
              uni.previewImage({
                current: item.url,
                urls: _this.imgList.map(item => item.url)
              })
              break;
            case 1:
              uni.getSetting({

                //获取用户的当前设置

                success: res => {

                  if (res.authSetting['scope.writePhotosAlbum']) {
                    //验证用户是否授权可以访问相册
                    _this.saveImg(item.url)
                  } else {
                    uni.authorize({
                      //如果没有授权，向用户发起请求
                      scope: 'scope.writePhotosAlbum',
                      success: () => {
                        _this.saveImg(item.url)
                      },
                      fail: () => {
                        uni.showToast({
                          title: '请打开保存相册权限!',
                          icon: 'none',
                          duration: 2000
                        });
                        setTimeout(() => {

                          uni.openSetting({

                            //调起客户端小程序设置界面,让用户开启访问相册

                            success: res2 => {

                              // console.log(res2.authSetting)

                            }

                          });

                        }, 2000);

                      }

                    });

                  }

                }

              });
              break;
            case 2:
              _this.updateImgs([item, ..._this.imgList.filter(img => img.id !== item.id)])
              break;
            case 3:
              _this.updateImgs(_this.imgList.filter(img => img.id !== item.id))
              break
          }
        },
      })
    },
    saveImg(url) {
      uni.getImageInfo({
        src: url,
        success: function (image) {
          uni.saveImageToPhotosAlbum({
            filePath: image.path,
            success: function () {
              uni.showToast({
                title: '保存成功，请在相册中查看',
                icon: 'none',
                duration: 2000
              });
            },
            fail: function (err) {
              uni.hideLoading();
              uni.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      });
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
.body {
  height: 100vh;
  background-color: #fff;
}

.header {
  width: 100vw;
  height: 200px;
  text-align: center;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #fff;
  background-size: cover;
  color: #fff;
  position: relative;

  .box {
    top: 0;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    /* 主要内容 */
    background: rgba(0, 0, 0, .5);
    /* 模糊大小就是靠的blur这个函数中的数值大小 */
    backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .title {
    font-weight: bold;
    font-size: 24px;
  }

  .des {
    padding-top: 8px;
    font-size: 12px;
    color: #ccc;
  }
}

.skuImgs {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
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



