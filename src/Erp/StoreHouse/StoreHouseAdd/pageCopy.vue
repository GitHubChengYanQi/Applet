<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <map id="myMap" :scale="scale" latitude="23.099994" longitude="113.324520"></map>

      <view class="comment-container" :style="{height: `${height}px`}">
        <!-- 顶部不参与手势协商，单独控制 -->
        <pan-gesture-handler worklet:ongesture="handlePan" style="flex-shrink: 0;">
          <view class="comment-header" @touchend="handleTouchEnd">
            <view class="comment-handler"></view>
            留言
          </view>
        </pan-gesture-handler>
        <!-- 滚动区要与 pan 手势协商 -->
        <pan-gesture-handler id="pan" worklet:should-response-on-move="shouldPanResponse" simultaneousHandlers="{{['scroll']}}" worklet:ongesture="handlePan">
          <vertical-drag-gesture-handler id="scroll" native-view="scroll-view" worklet:should-response-on-move="shouldScrollViewResponse" simultaneousHandlers="{{['pan']}}">
            <scroll-view class="comment-list" scroll-y worklet:adjust-deceleration-velocity="adjustDecelerationVelocity" bindscroll="handleScroll" type="list" show-scrollbar="{{false}}">
              <view class="comment-item" wx:for="{{list}}" wx:key="index">
                <view class="main-comment">
                  <image fade-in class="user-head-img" src="{{item.userHeadImg}}"></image>
                  <view class="others">
                    <text class="user-name">{{item.userName}}</text>
                    <text class="content">{{item.comment}}</text>
                  </view>
                </view>
                <view class="sub-comment" wx:for="{{item.subCommentList}}" wx:key="id" wx:for-item="subItem" wx:for-index="subIndex">
                  <image fade-in class="user-head-img" src="{{subItem.userHeadImg}}"></image>
                  <view class="others">
                    <text class="user-name">{{subItem.userName}} 回复 {{subItem.replyUserName}}</text>
                    <text class="content">{{subItem.comment}}</text>
                  </view>
                </view>
              </view>
              <view class="safe-area-inset-bottom"></view>
            </scroll-view>
          </vertical-drag-gesture-handler>
        </pan-gesture-handler>
      </view>

      <Modal ref="modal" />

    </view>
  </view>
</template>

<script>
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Loading from "../../../components/Loading";
import {Storehouse} from "MES-Apis/lib/Storehouse";
import Modal from "../../../components/Modal";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId'],
  components: {Modal, Loading, BottomButton},
  watch: {
    storehouseId(storehouseId) {
      if (storehouseId) {
        this.getDetail(storehouseId)
      }
    }
  },
  data() {
    return {
      show: false,
      formData: {},
      refreshLoading: false,
      loading: false,
      latitude: '',
      longitude: '',
      rules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: '请输入仓库名称!',
            },
          ]
        },
        coding: {
          rules: [
            {
              required: true,
              errorMessage: '请输入仓库码！'
            },
            {
              pattern: '^[A-Z\\d\\+\\-\\*\\/\\(\\)\\%（）]+$',
              errorMessage: '只能输入大写字母或数字！'
            },
          ]
        },
      }
    }
  },
  mounted() {

  },
  methods: {
    getDetail(storehouseId) {
      this.refreshLoading = true
      Storehouse.storeHouseDetail({
        data: {
          storehouseId
        }
      }).then((res) => {
        const data = res.data || {}
        this.formData = {
          name: data.name,
          coding: data.coding,
          palce: data.palce
        }
      }).catch(() => {
      }).finally(() => {
        this.refreshLoading = false
      })
    },
    save() {
      this.$refs.form.validate((err) => {
        if (!err) {
          this.loading = true

          if (this.storehouseId) {
            Storehouse.storeHouseEdit({
              data: {storehouseId: this.storehouseId, ...this.formData}
            }).then((res) => {
              uni.$emit('storeHouseEditSuccess',res.data)
              this.$refs.modal.dialog({
                title: "修改成功！",
                onConfirm() {
                  uni.navigateBack()
                  return true
                }
              })
            }).catch(() => {
              this.$refs.modal.dialog({
                title: '修改失败！'
              })
            }).finally(() => {
              this.loading = false
            })
            return
          }

          Storehouse.storeHouseAdd({
            data: this.formData
          }).then((res) => {
            uni.$emit('storeHouseAddSuccess')

            const _this = this
            this.$refs.modal.dialog({
              only: false,
              title: "添加成功！",
              confirmText: '继续添加',
              cancelText: '返回',
              onCancel() {
                uni.navigateBack()
                return true
              },
              onConfirm() {
                _this.formData = {}
                _this.refreshLoading = true
                setTimeout(() => {
                  _this.refreshLoading = false
                }, 1000)
                return true
              }
            })
          }).catch(() => {
            this.$refs.modal.dialog({
              title: '添加失败！'
            })
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    openMap() {
      const _this = this
      uni.authorize({
        scope: 'scope.userLocation',
        success() {
          uni.chooseLocation({
            latitude: _this.latitude || undefined,
            longitude: _this.longitude || undefined,
            success: function (res) {
              _this.formData.palce = res.address + res.name
              _this.latitude = res.latitude
              _this.longitude = res.longitude
            },
            fail(res) {

            }
          });
        },
        fail: () => {

          uni.showToast({

            title: '请打开地理位置权限!',

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
      })

    }
  }
}
</script>

<style lang="scss">

.skuClassAdd {
  border-radius: 8px;
  margin: 16px 8px;
  padding: 12px;
  background-color: #fff;

  .uni-forms-item {
    margin: 0;
    padding: 12px 0;
  }
}

.des {
  padding: 0 12px;
  font-size: 12px;
  color: #cccccc;
}

.map {
  display: flex;
  align-items: center;
  gap: 4px;
}

</style>
