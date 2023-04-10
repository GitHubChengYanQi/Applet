<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <view class="skuClassAdd">
        <uni-forms ref="form" :model="formData" :rules="rules" labelWidth="100px" validateTrigger="bind">

          <uni-forms-item
              label="材质名称"
              name="name"
              required
          >
            <uni-easyinput v-model="formData.name" placeholder="请输入材质名称" />
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
import {Sku} from "MES-Apis/lib/Sku/promise";
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Loading from "../../../components/Loading";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'MaterialAdd',
  components: {Loading, BottomButton},
  data() {
    return {
      show: false,
      formData: {},
      refreshLoading: false,
      loading: false,
      rules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: '请输入材质名称!',
            },
          ]
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    save() {
      this.$refs.form.validate((err) => {
        if (!err) {
          this.loading = true
          Sku.materialAdd({
            data: {
              ...this.formData,
              pidTitle: undefined
            }
          }).then((res) => {
            uni.$emit('materialAddSuccess', res.data)

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

</style>
