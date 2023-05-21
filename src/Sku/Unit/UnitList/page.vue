<template>
  <view>
    <Empty v-if="error" type="error" description="获取信息异常" />
    <Loading
        skeleton-type="page"
        skeleton
        v-else-if="loading"
    />
    <view v-else class="manage" :style="{height: `calc(100vh - ${47+safeAreaHeight(this,8)}px)`}">
      <Empty
          v-if="unitList.length === 0"
          description="暂无数据"
      />
      <view
          v-for="(unit,index) in unitList"
          :key="index"
          class="item"
          @click="editUnit(unit)"
      >
        <view class="itemIon">
          <Icon icon="icon-jiliangdanwei" size="35" />
        </view>
        {{ unit.label }}
      </view>
    </view>

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <view class="action">
        <LinkButton @click="addSkuClass">添加单位</LinkButton>
        <Modal ref="addUnitModal">
          <u--input
              placeholder="请输入单位名称"
              clearable
              v-model="unitName"
          />
        </Modal>
      </view>
    </view>

    <u-action-sheet
        cancelText="取消"
        :actions="unitActionList"
        :show="unitActionShow"
        @close="unitActionShow = false"
        @select="unitActionSelect"
    />

    <Modal ref="modal" />
  </view>
</template>

<script>
import Search from "../../../components/Search";
import Loading from "../../../components/Loading";
import UserName from "../../../components/UserName";
import Empty from "../../../components/Empty";
import Avatar from "../../../components/Avatar";
import {safeAreaHeight} from "../../../util/Tools";
import MyButton from "../../../components/MyButton";
import Check from "../../../components/Check";
import Icon from "../../../components/Icon";
import LinkButton from "../../../components/LinkButton";
import AddUser from "../../../components/AddUser";
import Modal from "../../../components/Modal";
import {Message} from "../../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {Sku} from "MES-Apis/lib/Sku/promise";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SelectUser',
  components: {Modal, AddUser, LinkButton, Icon, Check, MyButton, Avatar, Empty, UserName, Loading, Search},
  data() {
    return {
      loading: true,
      unitList: [],
      error: false,
      actionUnit: {},
      safeAreaHeight,
      unitName: '',
      unitActionShow: false,
      unitActionList: [
        {
          name: '修改单位名',
          key: 'edit',
        },
        {
          name: '删除单位',
          key: 'delete',
          color: 'red'
        }
      ]
    }
  },
  mounted() {
    this.getList()

    const _this = this

  },
  methods: {
    unitActionSelect({key}) {
      const _this = this
      const thisUnit = this.actionUnit
      switch (key) {
        case 'edit':
          _this.unitName = thisUnit.label
          _this.$refs.addUnitModal.dialog({
            title: '修改单位名',
            only: false,
            confirmText: '修改',
            onConfirm() {
              return new Promise((resolve) => {
                if (!_this.unitName) {
                  Message.toast('请输入单位名称！')
                  resolve(false)
                  return
                }
                Sku.unitEdit({
                  data: {
                    unitId: thisUnit.value,
                    unitName: _this.unitName
                  }
                }).then(() => {
                  _this.unitList = _this.unitList.map(item => {
                    if (item.value === thisUnit.value) {
                      return {...item, label: _this.unitName}
                    }
                    return item
                  })
                  resolve(true)
                }).catch(() => {
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '修改失败!'
                  })
                  resolve(true)
                })
              })
            }
          })
          break;
        case 'delete':
          _this.$refs.modal.dialog({
            title: '删除后不可恢复，是否确认删除？',
            content: '删除单位【' + thisUnit.label + '】',
            only: false,
            confirmError: true,
            onConfirm() {
              return new Promise((resolve) => {
                Sku.unitDelete({
                  data: {
                    unitId: thisUnit.value
                  }
                }).then(() => {
                  _this.unitList = _this.unitList.filter(item => item.value !== thisUnit.value)
                  resolve(true)
                }).catch(() => {
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '删除失败!'
                  })
                  resolve(true)
                })
              })
            }
          })
          break
      }
    },
    async getList() {
      this.loading = true
      const res = await Sku.unitListSelect({data: {}}).catch(() => {
        this.error = true
      })
      this.loading = false
      this.unitList = res.data || []
    },
    addSkuClass() {
      const _this = this
      _this.unitName = ''
      _this.$refs.addUnitModal.dialog({
        title: '添加单位',
        only: false,
        confirmText: '添加',
        onConfirm() {
          return new Promise((resolve) => {
            if (!_this.unitName) {
              Message.toast('请输入单位名称！')
              resolve(false)
              return
            }
            Sku.unitAdd({
              data: {
                unitName: _this.unitName,
              }
            }).then((res) => {
              _this.unitList = [{label: _this.unitName, value: res.data}, ..._this.unitList]
              resolve(true)
            }).catch(() => {
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '添加失败!'
              })
              resolve(true)
            })
          })
        }
      })
    },
    editUnit(unit) {
      this.actionUnit = unit
      this.unitActionShow = true
    }
  }
}
</script>

<style lang="scss">

.manage {
  overflow: auto;
  background-color: #fff;
  padding: 0 12px;
}

.item {
  padding: 6px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff;

  .itemIon {
    //background-color: $body-color;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
  }

}

.footer {
  display: flex;
  align-items: center;
  padding: 12px;
  z-index: 1;
  position: fixed;
  bottom: 0;
  background-color: #eee;
  width: calc(100% - 24px);

  .checkUsers {
    height: 35px;
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .action {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
  }
}


</style>
