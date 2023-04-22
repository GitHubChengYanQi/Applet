<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <view class="skuClassAdd">
        <uni-forms ref="form" :model="formData" :rules="rules" labelWidth="100px" validateTrigger="bind">

          <uni-forms-item
              label="库位名称"
              name="name"
              required
          >
            <uni-easyinput v-model="formData.name" placeholder="请输入仓库名称" />
          </uni-forms-item>

          <uni-forms-item
              label="上级库位"
              name="pid"
              required
          >
            <view :class="[formData.pid?'grey2':'grey','select']" @click="show = true">
              <view class="value"> {{ formData.pidTitle || '请选择上级库位' }}</view>
              <u-icon name="arrow-down" size="15"></u-icon>
            </view>
            <Popup
                :show="show"
                position="bottom"
                @close="show = false"
                title="选择上级库位"
                @closeAfter="showContent = false"
                @showBefore="showContent = true"
            >
              <Cascader
                  v-if="showContent"
                  :data="positionTree"
                  :value="formData.pid"
                  @change="onChange"
                  @close="show=false"
              />
            </Popup>
          </uni-forms-item>

          <uni-forms-item
              label="排序"
              name="sort"
          >
            <uni-easyinput v-model="formData.sort" placeholder="请输入排序值" type="number" />
          </uni-forms-item>

        </uni-forms>
      </view>
      <BottomButton
          only
          text="保存"
          @onClick="save"
      />
    </view>

    <Modal ref="modal" />

  </view>
</template>

<script>
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Loading from "../../../components/Loading";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Popup from "../../../components/Popup";
import Modal from "../../../components/Modal";
import Cascader from "../../../components/Cascader";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'storehousePositionsId'],
  components: {Cascader, Modal, Popup, Loading, BottomButton},
  data() {
    return {
      showContent: false,
      positionTree: [],
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
              errorMessage: '请输入库位名称!',
            },
          ]
        },
        pid: {
          rules: [
            {
              required: true,
              errorMessage: '请选择上级库位！'
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
    if (this.storehousePositionsId) {
      this.getDetail(this.storehousePositionsId)
    } else {
      this.getPositionTree()
    }
  },
  methods: {
    async getDetail(storehousePositionsId) {
      this.refreshLoading = true
      await Storehouse.positionsDetail({
        data: {storehousePositionsId}
      }).then((res) => {
        const data = res.data || {}
        this.formData = {
          name: data.name,
          pid: data.pid,
          pidTitle: data.parent?.name || '',
          sort: data.sort
        }
      }).catch(() => {
      })
      this.getPositionTree()
    },
    save() {
      this.$refs.form.validate((err) => {
        if (!err) {
          this.loading = true

          if (this.storehousePositionsId) {
            Storehouse.positionsEdit({
              data: {
                storehousePositionsId: this.storehousePositionsId,
                storehouseId: this.storehouseId,
                ...this.formData,
                pidTitle: undefined
              }
            }).then((res) => {
              uni.$emit('positionsAddSuccess')
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

          Storehouse.positionsAdd({
            data: {
              ...this.formData,
              storehouseId: this.storehouseId,
              pidTitle: undefined
            }
          }).then((res) => {
            uni.$emit('positionsAddSuccess')

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
                _this.getPositionTree()
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
    async getPositionTree() {
      this.refreshLoading = true
      const response = await Storehouse.positionsTreeView({params: {ids: this.storehouseId}});
      const {
        data
      } = response;
      this.positionTree = [{
        name: '顶级',
        id: '0',
        children: this.format(data)
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
    async onChange({id, name}) {
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

  .uni-forms-item {
    margin: 0;
    padding: 12px 0;
  }
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

</style>
