<template>
  <view class="voucher">
    <Loading :skeleton="true" v-if="loading" />
    <view v-else style="background-color: #fff;">
      <image v-show="show" :src="tempFilePath" :style="{ width: '100vw', height:`${height}px`}" />
      <canvas
          v-show="!show"
          canvas-id="secondCanvas"
          id="secondCanvas"
          :style="{ width: '100vw', height:`${height}px`,backgroundColor:'#fff'}"
      />
      <view class="bottom"></view>
      <BottomButton
          right-text='保存凭证'
          @rightOnClick="savePic"
          :right-loading="loading"
          left-text="返回"
          @rleftOnClick="back"
      />
      <view @click="addImg" class="addImg">
        <Icon icon="icon-shenpi3" color="#007aff" />
      </view>
    </view>

    <Modal ref="modal" />


  </view>
</template>

<script>
import moment from "util/Common/moment";
import SkuItem from "../../../components/SkuItem";
import BottomButton from "../../../components/BottomButton";
import Empty from "../../../components/Empty";
import {SkuResultSkuJsons} from "../../../Sku/sku";
import {Process} from "MES-Apis/lib/Process/promise";
import Loading from "../../../components/Loading";
import {Message} from "../../../components/Message";
import Bouncing from "../../../components/Bouncing";
import Icon from "../../../components/Icon";
import Modal from "../../../components/Modal";

const md5 = require('md5');

export default {
  name: 'InStockVoucher',
  components: {Modal, Icon, Bouncing, Loading, Empty, BottomButton, SkuItem},
  props: ['taskId'],
  data() {
    return {
      loading: false,
      moment,
      SkuResultSkuJsons,
      userName: '',
      taskDetail: {},
      instockListResults: [],
      windowWidth: 0,
      tempFilePath: '',
      height: '',
      show: false,
      img: ''
    }
  },
  mounted() {
    this.userName = this.$store.state.userInfo.userInfo.name
    this.getTaskDetail(this.taskId)
  },
  methods: {

    getTaskDetail(taskId) {
      const current = this
      this.loading = true
      Process.auditDetail({
        taskId
      }).then((res) => {
        this.taskDetail = res.data
        const receipts = res.data.receipts || {}
        const instockListResults = receipts.instockListResults || []
        this.instockListResults = instockListResults
        this.height = instockListResults.length * 20 + 270
        uni.getSystemInfo({
          success: (res) => {
            this.windowWidth = res.windowWidth;
            current.capture('', true)
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },

    async capture(addImg) {


      this.show = false

      const taskDetail = this.taskDetail || {}
      const receipts = taskDetail.receipts || {}
      const instockListResults = this.instockListResults

// canvas绘制文本

      const ctx = uni.createCanvasContext('secondCanvas', this)

      // ctx.rect(0,0,this.windowWidth,100);

      ctx.rect(0, 0, this.windowWidth, this.height)
      ctx.setFillStyle('#fff')
      ctx.fill()

// begin another path
      ctx.beginPath()
      ctx.fill()

// canvas布局

      ctx.setFontSize(20)

      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.fillText('入库凭证', this.windowWidth / 2, 40)

      ctx.setFillStyle('#f95455')

      ctx.fillText(receipts.coding || '', this.windowWidth / 2, 75)

// 绘制矩形，在矩形中添加文本
      ctx.setFontSize(14)

      ctx.setTextAlign('left')

      ctx.setFillStyle('#999999')

      ctx.fillText('入库人员', 25, 110)

      ctx.setTextAlign('right')

      ctx.setFillStyle('#333333')

      ctx.fillText(taskDetail.user?.name || '', this.windowWidth - 25, 110)

      ctx.setTextAlign('left')

      ctx.setFillStyle('#999999')

      ctx.fillText('入库时间', 25, 130)

      ctx.setTextAlign('right')

      ctx.setFillStyle('#333333')

      ctx.fillText(taskDetail.createTime || '', this.windowWidth - 25, 130)

// 绘制虚线

      ctx.setLineDash([2, 4], 5);

      ctx.beginPath();

      ctx.moveTo(25, 145);

      ctx.lineTo(this.windowWidth - 25, 145);

      ctx.stroke();

      ctx.setTextAlign('left')

      ctx.setFillStyle('#999999')

      ctx.fillText('物料', 25, 170)

      ctx.setTextAlign('right')

      ctx.setFillStyle('#999999')

      ctx.fillText('入库数量', this.windowWidth - 25, 170)

      instockListResults.forEach((item, index) => {
        ctx.setTextAlign('left')

        ctx.setFillStyle('#333333')
        let sku = SkuResultSkuJsons({skuResult: item.skuResult})
        if (sku.length > 20) {
          sku = sku.substring(0, 20) + '...'
        }
        ctx.fillText(sku || '', 25, 190 + (20 * index))

        ctx.setTextAlign('right')

        ctx.setFillStyle('#333333')

        ctx.fillText(item.number || '', this.windowWidth - 25, 190 + (20 * index))
      })

      ctx.setTextAlign('right')
      ctx.fillText(this.$store.state.userInfo.publicInfo.enterprise || '', this.windowWidth - 25, 220 + (instockListResults.length * 20))
      if (addImg) {
        const path = await this.base64Save(this.$store.state.userInfo.publicInfo.seal || '')
        // this.img = this.$store.state.userInfo.publicInfo.seal || ''
        ctx.drawImage(path, this.windowWidth - 160, 165 + (instockListResults.length * 20), 100, 100)
      }
      ctx.fill()


// canvas画布转为图片 ，有时draw调用不成功，写了个定时器

      ctx.draw(setTimeout(() => {

        uni.canvasToTempFilePath({

          x: 0,

          y: 0,

          // width: 325,
          //
          // height: 375,
          //
          // destWidth: 325,
          //
          // destHeight: 375,

          fileType: 'jpg',

          canvasId: 'secondCanvas',

          success: (res) => {

            uni.hideLoading()

            // // 保存当前绘制图片
            this.tempFilePath = res.tempFilePath
            this.show = true


          },

          fail: function (err) {

            console.log(err, '图片生成失败')

          }

        }, this)

      }, 500))

    },

// 保存图片到本地，下面保存到手机百度CV的

    savePic() {
      const current = this

      uni.getSetting({

        //获取用户的当前设置

        success: res => {

          if (res.authSetting['scope.writePhotosAlbum']) {

            //验证用户是否授权可以访问相册

            current.print()
          } else {

            uni.authorize({

              //如果没有授权，向用户发起请求

              scope: 'scope.writePhotosAlbum',

              success: () => {

                current.print()
              },

              fail: () => {

                uni.showToast({

                  title: '请打开保存相册权限，再点击打印凭证!',

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

    },
    print() {
      const current = this
      this.$refs.modal.dialog({
        only: false,
        title: '是否保存凭证？',
        onConfirm() {
          current.saveImageToPhotosAlbum()
          return true
        },
        onCancel() {
          return true
        }
      })
    },
    addImg() {
      if (this.$store.state.userInfo.publicInfo.seal){
        this.capture(true)
      }else {
        uni.showToast({

          title: '请在后台管理设置印章！',

          icon: 'none',

          duration: 3000

        });
      }
    },
    saveImageToPhotosAlbum() {
      uni.saveImageToPhotosAlbum({

        filePath: this.tempFilePath,

        success: function () {

          uni.hideLoading();

          uni.showToast({

            title: '保存成功，请在相册中查看',

            icon: 'none',

            duration: 2000

          });

        },

        fail: function (err) {
          console.log(err)
          uni.hideLoading();

          uni.showToast({

            title: '保存失败',

            icon: 'none',

            duration: 2000

          });

        }

      });
    },
    back() {
      uni.navigateBack();
    },
    base64Save(base64File) { //base64File 需要加前缀
      const fsm = uni.getFileSystemManager();//获取全局文件管理器

      let extName = base64File.match(/data\:\S+\/(\S+);/)
      if (extName) {
        //获取文件后缀
        extName = extName[1]
      }

      //获取自1970到现在的毫秒 + 文件后缀 生成文件名
      let fileName = md5(base64File) + '.' + extName

      return new Promise((resolve, reject) => {
        //写入文件的路径
        let filePath = wx.env.USER_DATA_PATH + '/' + fileName

        fsm.writeFile({
          filePath,
          data: base64File.replace(/^data:\S+\/\S+;base64,/, ''), //替换前缀为空
          encoding: 'base64',
          success: (res) => {
            resolve(filePath);
          },
          fail() {
            reject('写入失败');
          },
        });
      });
    },
  }
}

</script>

<style lang="scss">

.voucher {
  height: calc(100vh - 100px);
  overflow: auto;
}

.addImg {
  background-color: $body-color;
  border-radius: 100%;
  position: fixed;
  right: 24px;
  bottom: 100px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px #fff;
}


</style>
