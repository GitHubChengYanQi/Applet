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
              <van-cascader
                  :value="formData.pid"
                  v-if="showContent"
                  :show-header="false"
                  :options="cateGoryData"
                  @change="onChange"
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

          <uni-forms-item
              label="分类码"
              name="codingClass"
          >
            <uni-easyinput v-model="formData.codingClass" placeholder="请输入分类码" />
          </uni-forms-item>

          <uni-forms-item
              label="排序"
              name="sort"
          >
            <view class="sort">
              <uni-easyinput v-model="formData.sort" placeholder="请输入排序值" type="number" />
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
import Popup from "../../../components/Popup";
import {Sku} from "MES-Apis/lib/Sku/promise";
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Loading from "../../../components/Loading";

export default {
  name: 'SkuClassAdd',
  components: {Loading, BottomButton, Popup},
  data() {
    return {
      show: false,
      showContent: false,
      cateGoryData: [],
      formData: {},
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
        codingClass: {
          rules: [
            {
              pattern: '^[A-Z\\d\\+\\-\\*\\/\\(\\)\\%（）]+$',
              errorMessage: '只能输入大写字母或数字！'
            },
          ]
        },
        sort: {
          rules: [
            {
              format: 'number',
              errorMessage: '只能输入数字！'
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

            uni.$emit('skuClassAddSuccess',res.data)

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
    async getCateGory() {
      const response = await Sku.spuClassTreeView({data: {}});
      const {
        data
      } = response;
      this.cateGoryData = [{
        text: '顶级',
        value: '0',
        children: this.format(data)
      }];
    },
    format(data) {
      const list = [];
      data.forEach(item => {
        const obj = {
          text: item.title,
          value: item.key
        }
        if (item.children.length > 0) {
          obj.children = this.format(item.children);
        }
        list.push(obj);
      })

      return list;
    },
    async onChange(e) {
      // this.show = false;
      const {selectedOptions} = e.detail;
      this.formData = {
        ...this.formData,
        pid: selectedOptions[selectedOptions.length - 1].value,
        pidTitle: selectedOptions[selectedOptions.length - 1].text
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
  color: #ccc;
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
