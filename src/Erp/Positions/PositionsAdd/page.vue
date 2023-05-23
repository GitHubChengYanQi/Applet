<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <view
          class="positionAdd"
          :style="{
             height: `calc(100vh - 52px - ${safeAreaHeight(this,12)}px)`
          }"
      >
        <uni-forms
            ref="form"
            :model="formData"
            :rules="rules"
            validateTrigger="bind"
        >

          <view class="box">

            <FormItem label="库位名称" name="name" required>
              <u--input
                  border="bottom"
                  v-model="formData.name"
                  placeholder="请输入库位名称"
                  :adjustPosition="false"
              />
            </FormItem>

            <FormItem label="库位描述" name="note">
              <u--input
                  border="bottom"
                  v-model="formData.note"
                  placeholder="请输入库位描述"
                  :adjustPosition="false"
              />
            </FormItem>

          </view>


          <view class="box">
            <FormItem label="库位结构" name="pid">

              <PositionStructure
                  :current="formData"
                  v-if="positionTree"
                  :position-id="storehousePositionsId"
                  :positionData="positionTree"
                  ref="positionStructure"
                  :store="store"
                  @authShow="authShow = true"
                  @goToBindSku="goToBindSku"
              />
            </FormItem>
          </view>

        </uni-forms>

      </view>
      <BottomButton
          only
          :loading="loading"
          text="保存"
          @onClick="save"
      />
    </view>

    <Popup
        :show="authShow"
        title="权限设置"
        @close="authShow = false"
        left-text="取消"
        right-text="确定"
        @onLeft="authShow = false"
        @onRight="authShow = false"
    >
      <Loading skeleton v-if="deptTreeLoading" />
      <view v-else class="deptTree">
        <Tree icon="icon-bumen1" :data="deptTree" v-model="positionAuths" />
      </view>
    </Popup>

    <Modal ref="modal" />

  </view>
</template>

<script>
import BottomButton from "../../../components/BottomButton";
import Loading from "../../../components/Loading";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Popup from "../../../components/Popup";
import Modal from "../../../components/Modal";
import Cascader from "../../../components/Cascader";
import FormItem from "../../../components/FormItem";
import PositionStructure from "../components/PositionStructure";
import {isArray, safeAreaHeight} from "../../../util/Tools";
import {Init} from "MES-Apis/lib/Init";
import MyButton from "../../../components/MyButton";
import {Dept} from "MES-Apis/lib/Dept/promise";
import Tree from "../../../components/Tree";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'storehousePositionsId', 'pid', 'store'],
  components: {Tree, MyButton, PositionStructure, FormItem, Cascader, Modal, Popup, Loading, BottomButton},
  data() {
    return {
      safeAreaHeight,
      showContent: false,
      positionTree: null,
      show: false,
      formData: {},
      refreshLoading: false,
      loading: false,
      deptTreeLoading: false,
      deptTree: [],
      positionAuths: [],
      positionBindSkus: [],
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
      },
      authShow: false,
    }
  },
  mounted() {
    const _this = this
    uni.$on('positionBindSkus', (list) => {
      _this.positionBindSkus = list
    })
    this.formData = {pid: this.pid}
    if (this.storehousePositionsId) {
      this.getDetail(this.storehousePositionsId)
    } else {
      this.getPositionTree()
    }
    this.getDeptTree()
  },
  watch: {
    formData: {
      deep: true,
      handler(formData) {
        if (Object.keys(formData).length > 1) {
          uni.enableAlertBeforeUnload({
            message: '数据未提交，是否退出？',
            success: () => {
            }
          })
        } else {
          uni.disableAlertBeforeUnload()
        }
      }
    }
  },
  methods: {
    getDeptTree() {
      this.deptTreeLoading = true
      Dept.deptTree().then((res) => {
        this.deptTree = [
          {
            title: this.$store.state.userInfo.tenant.name,
            key: '0',
            children: isArray(res.data)[0]?.children
          }
        ]
      }).catch(() => {
      }).finally(() => {
        this.deptTreeLoading = false
      })
    },
    async getDetail(storehousePositionsId) {
      this.refreshLoading = true
      await Storehouse.positionsDetail({
        data: {storehousePositionsId}
      }).then((res) => {
        const data = res.data || {}
        this.formData = {
          name: data.name,
          pid: data.pid,
          note: data.note
        }
      }).catch(() => {
      })
      await Storehouse.positionsBindGetDeptIds({
        params: {positionId: storehousePositionsId}
      }).then((res) => {
        this.positionAuths = (res || []).map(key => ({key}))
      }).catch(() => {
      })
      this.getPositionTree()
    },
    save() {
      this.$refs.form.validate((err) => {
        if (!err) {
          const deptIds = this.positionAuths.map(item => item.key).toString()
          const skuIds = this.positionBindSkus.map(item => item.skuId)
          this.loading = true
          const sort = this.$refs.positionStructure.getCurrentSort()
          if (this.storehousePositionsId) {
            Storehouse.positionsEdit({
              data: {
                storehousePositionsId: this.storehousePositionsId,
                ...this.formData,
                sort,
                deptIds
              }
            }).then((res) => {
              uni.$emit('positionsEditSuccess', {
                pid: this.formData.pid,
                id: this.storehousePositionsId,
                name: this.formData.name
              })
              this.$refs.modal.dialog({
                title: "修改成功！",
                onConfirm() {
                  uni.disableAlertBeforeUnload()
                  uni.navigateBack()
                  return true
                }
              })
            }).catch(() => {
              this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '修改失败！'
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
              sort,
              deptIds,
              skuIds
            }
          }).then((res) => {

            uni.$emit('positionsAddSuccess', {
              pid: this.formData.pid,
              id: res.data,
              name: this.formData.name
            })

            const _this = this
            this.$refs.modal.dialog({
              only: false,
              title: "添加成功！",
              confirmText: '继续添加',
              cancelText: '返回',
              onCancel() {
                uni.disableAlertBeforeUnload()
                uni.navigateBack()
                return true
              },
              onConfirm() {
                _this.formData = {pid: _this.pid}
                _this.getPositionTree()
                return true
              }
            })
          }).catch(() => {
            this.$refs.modal.dialog({
              title: Init.getNewErrorMessage() || '添加失败！'
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
      if (this.pid === '0') {
        this.positionTree = {key: '0', title: this.store, children: data}
      } else {
        this.positionTree = this.findPosition(data || [], this.pid)
      }
      this.refreshLoading = false
    },
    findPosition(data, key) {
      let position = null
      data.forEach(item => {
        if ((item.key + '') === key) {
          position = item
        } else {
          const children = this.findPosition(item.children || [], key);
          if (children) {
            position = children
          }
        }
      })
      return position
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
    goToBindSku() {
      const _this = this
      uni.navigateTo({
        url: `/Erp/Positions/PositionBind/index?storehousePositionsId=${this.storehousePositionsId || ''}&position=${this.formData.name}&store=${this.store}`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('positionBindSkus', {positionBindSkus: _this.positionBindSkus})
        }
      })
    }
  }
}
</script>

<style lang="scss">

.positionAdd {
  padding: 0 12px;
  overflow: hidden auto;

  .box {
    margin-top: 18px;
    padding: 0 12px;
    background-color: #fff;
    border-radius: 8px;
  }
}

</style>
