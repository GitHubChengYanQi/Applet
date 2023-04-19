<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <view class="skuClassAdd">
        <uni-forms ref="form" :model="formData" :rules="rules" labelWidth="100px" validateTrigger="bind">

          <uni-forms-item
              label="仓库名称"
              name="name"
              required
          >
            <uni-easyinput v-model="formData.name" placeholder="请输入仓库名称" />
          </uni-forms-item>

          <uni-forms-item
              label="仓库码"
              name="coding"
              required
          >
            <uni-easyinput v-model="formData.coding" placeholder="仓库码用于生成编码规则" />
          </uni-forms-item>

          <uni-forms-item
              label="仓库地点"
              name="palce"
          >
            <view class="map">
              <uni-easyinput type="textarea" autoHeight v-model="formData.palce" placeholder="仓库地点" />
              <u-icon name="map" size="24" color="#007aff" @click="openMap" />
            </view>
          </uni-forms-item>

        </uni-forms>
      </view>
      <BottomButton
          only
          text="保存"
          @onClick="save"
      />
    </view>
  </view>
</template>

<script>
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Loading from "../../../components/Loading";
import {Storehouse} from "MES-Apis/lib/Storehouse";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId'],
  components: {Loading, BottomButton},
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
              Message.dialog({
                title: "修改成功！",
                onConfirm() {
                  uni.navigateBack()
                  return true
                }
              })
            }).catch(() => {
              Message.dialog({
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
            Message.dialog({
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
            Message.dialog({
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
