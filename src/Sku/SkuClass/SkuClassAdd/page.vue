<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <view class="skuClassAdd">
        <uni-forms ref="form" :model="formData" :rules="rules" labelWidth="100px" validateTrigger="bind">

          <uni-forms-item
              label="上级分类"
              name="pid"
              required
          >
            <view :class="[formData.pid?'grey2':'grey','select']" @click="show = true">
              <view class="value"> {{ formData.pidTitle || '请选择所属分类' }}</view>
              <u-icon name="arrow-down" size="15"></u-icon>
            </view>

            <Popup
                :show="show"
                position="bottom"
                @close="show = false"
                title="选择上级分类"
                @closeAfter="showContent = false"
                @showBefore="showContent = true"
            >
              <Cascader
                  v-if="showContent"
                  :data="cateGoryData"
                  :value="formData.pid"
                  @change="onChange"
                  @close="show=false"
              />
            </Popup>
          </uni-forms-item>

          <uni-forms-item
              label="分类名称"
              name="name"
              required
          >
            <uni-easyinput v-model="formData.name" placeholder="请输入分类名称" />
          </uni-forms-item>

        </uni-forms>
      </view>
      <BottomButton
          :loading="loading"
          only
          text="保存"
          @onClick="save"
      />
    </view>

    <Modal ref="modal" />


  </view>
</template>

<script>
import Popup from "../../../components/Popup";
import {Sku} from "MES-Apis/lib/Sku/promise";
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Loading from "../../../components/Loading";
import Modal from "../../../components/Modal";
import Cascader from "../../../components/Cascader";

export default {
  name: 'SkuClassAdd',
  components: {Cascader, Modal, Loading, BottomButton, Popup},
  data() {
    return {
      show: false,
      showContent: false,
      cateGoryDataLoading: false,
      cateGoryData: [],
      formData: {
        // pid: '0'
      },
      refreshLoading: false,
      loading: false,
      rules: {
        pid: {
          rules: [
            {
              required: true,
              errorMessage: '请选择上级分类!',
            },
          ]
        },
        name: {
          rules: [
            {
              required: true,
              errorMessage: '请输入分类名称!',
            },
          ]
        },
      }
    }
  },
  mounted() {
    this.getCateGory()
  },
  methods: {
    save() {
      this.$refs.form.validate((err) => {
        if (!err) {
          this.loading = true
          Sku.spuClassAdd({
            data: {
              ...this.formData,
              pidTitle: undefined
            }
          }).then((res) => {

            uni.$emit('skuClassAddSuccess', res.data)

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
                _this.getCateGory()
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
    async getCateGory() {
      this.refreshLoading = true
      const response = await Sku.spuClassTreeView({data: {}});
      const {
        data
      } = response;
      this.cateGoryData = [{
        name: '顶级',
        id: '0',
        children: this.format(data || [])
      }];
      this.refreshLoading = false
    },
    format(data) {
      const list = [];
      data.forEach(item => {
        const obj = {
          name: item.title,
          id: item.key
        }
        if (item.children.length > 0) {
          obj.children = this.format(item.children);
        }
        list.push(obj);
      })

      return list;
    },
    onChange({id, name}) {
      this.formData = {
        ...this.formData,
        pid: id,
        pidTitle: name
      }
    },
  }
}
</script>

<style lang="scss">

.skuClassAdd {
  border-radius: 8px;
  margin: 16px 8px;
  padding: 12px;
  background-color: #fff;
}

.select {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  padding: 0 10px;
  line-height: 34px;
  border-radius: 4px;

  .value {
    flex-grow: 1;
  }

  .icon {

  }
}


.grey {
  color: #999999;
}

.grey2 {
  color: #434343;
}

.sort {
  height: 36px;
  display: flex;
  align-items: center;
}

</style>
