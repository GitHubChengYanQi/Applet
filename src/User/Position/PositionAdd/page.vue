<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <view class="skuClassAdd">

        <uni-forms ref="form" :model="formData" :rules="rules" labelWidth="100px" validateTrigger="bind">

          <uni-forms-item
              label="职位名称"
              name="name"
              required
          >
            <uni-easyinput v-model="formData.name" placeholder="请输入职位名称" />
          </uni-forms-item>

          <uni-forms-item
              v-if="false"
              label="部门主管"
              name="governor"
              required
          >
            <view class="item">
              <u-radio-group
                  placement="row"
                  v-model="formData.governor"
              >
                <u-radio
                    :customStyle="{marginRight: '8px'}"
                    v-for="(item, index) in governor"
                    :key="index"
                    :label="item.name"
                    :name="item.key"
                >
                </u-radio>
              </u-radio-group>
            </view>
          </uni-forms-item>

        </uni-forms>
      </view>
      <BottomButton
          only
          text="保存"
          @onClick="save"
      />

      <Modal ref="modal" />

    </view>
  </view>
</template>

<script>
import {Sku} from "MES-Apis/lib/Sku/promise";
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Loading from "../../../components/Loading";
import Modal from "../../../components/Modal";
import {Position} from "MES-Apis/lib/Position/promise";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Modal, Loading, BottomButton},
  data() {
    return {
      show: false,
      formData: {governor: 0},
      refreshLoading: false,
      loading: false,
      governor: [
        {
          name: '是',
          key: 1
        },
        {
          name: '否',
          key: 0
        },
      ],
      rules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: '请输入职位名称!',
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
          Position.add({
            data: this.formData
          }).then((res) => {
            uni.$emit('positionAddSuccess', res.data)

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

.item {
  height: 100%;
  display: flex;
  align-items: center;
}

</style>
