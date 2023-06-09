<template>
  <view>
    <page-container
        :show="pageContainerShow"
        :duration="false"
        :overlay="false"
        @afterleave="afterleave"
    />
    <Empty v-if="error" type="error" description="获取信息异常" />
    <Loading
        skeleton-type="page"
        skeleton
        v-else-if="loading"
    />
    <view v-else class="selectUser">
      <SkuManage
          ref="skuManage"
          :itemWidth="itemWidth"
          :itemHeight="itemHeight"
          :movableViewX="movableViewX"
          :movableViewY="movableViewY"
          :sku-class-list="skuClassList"
          :sku-class-page="skuClassPage"
          :tree="tree"
          :admin="admin"
          @skuClassPageClick="skuClassPageClick"
          @onCheckSkuClass="onCheckSkuClass"
          @onCheckSkus="onCheckSkus"
          @skuClassClick="skuClassClick"
          @skuClassListChange="skuClassListChange"
          @treeChange="(newTree)=>tree = newTree"
          @onDelete="(_this)=>del(_this,true)"
          @onEdit="(_this)=>edit(_this,true)"
          @skuListChange="(list)=>skuList = list"
          :checkSkus="checkSkus"
          :skuList="skuList"
          :sys="sys"
          :checkSkuClass="checkSkuClass"
      />
    </view>

    <view v-if="admin" class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <template v-if="sys">
        <view class="sys">
          <view class="total">
            已选
            <view class="num">{{ checkSkuClass.length + checkSkus.length }}</view>
            个
          </view>
          <view class="sysActions">
            <MyButton
                :loading="delLoading"
                type="error"
                :disabled="checkSkuClass.length === 0 && checkSkus.length === 0"
                @click="batchDelete"
            >
              批量删除
            </MyButton>
            <MyButton type="primary" @click="sys = false">退出管理</MyButton>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="action">
          <LinkButton @click="addSkuClass()">添加子分类</LinkButton>
          <Modal ref="addSkuClassModal">
            <u--input
                placeholder="请输入分类名称"
                clearable
                v-model="skuClassName"
            />
          </Modal>
        </view>
        <view class="action">
          <LinkButton @click="addSku">添加物料</LinkButton>
          <Modal ref="addSkuClassModal">
            <u--input
                placeholder="请输入分类名称"
                clearable
                v-model="skuClassName"
            />
          </Modal>
        </view>
        <view class="action">
          <LinkButton @click="actionShow = true;checkSkus=[];checkSkuClass=[]">更多管理</LinkButton>
          <u-action-sheet
              cancelText="取消"
              :actions="actionList"
              :show="actionShow"
              @close="actionShow = false"
              @select="actionSelect"
          />
        </view>
      </template>

    </view>

    <u-action-sheet
        :title="allActionData.title"
        cancelText="取消"
        :actions="allActionList"
        :show="allActionShow"
        @close="allActionShow = false"
        @select="allActionSelect"
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
import SkuManage from "../components/SkuManage";
import {addSkuClassChildren, delSkuClassChildren, delSkuClassIdsChildren} from "./index";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SelectUser',
  components: {SkuManage, Modal, AddUser, LinkButton, Icon, Check, MyButton, Avatar, Empty, UserName, Loading, Search},
  data() {
    return {
      skuClassPage: [],
      loading: true,
      skuClassList: [],
      itemWidth: 0,
      itemHeight: 55,
      movableViewY: 0,
      movableViewX: 0,
      tree: [],
      searchValue: '',
      actionShow: false,
      error: false,
      safeAreaHeight,
      pageContainerShow: false,
      skuClassName: '',
      skuList: [],
      checkSkuClass: [],
      checkSkus: [],
      delLoading: false,
      admin: false,
      sys: false,
      allActionList: [
        {
          name: '添加子分类',
          key: 'add'
        },
        {
          name: '修改分类名称',
          key: 'edit'
        },
        {
          name: '删除分类',
          key: 'delete',
          color: 'red'
        },
      ],
      allActionShow: false,
      allActionData: {}
    }
  },
  mounted() {
    this.admin = this.$store.state.userInfo.tenant.admin
    this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth
    this.getList()
  },
  computed: {
    actionList() {
      return [
        {
          name: '修改当前分类名称',
          key: 'edit',
          disabled: this.skuClassPage.length <= 1
        },
        {
          name: '删除当前分类',
          key: 'delete',
          color: 'red',
          disabled: this.skuClassPage.length <= 1 || this.skuList.length > 0
        },
        {
          name: '管理',
          key: 'sys',
          color: '#007aff',
        },
      ]
    }
  },
  methods: {
    allActionSelect({key}) {
      switch (key) {
        case 'add':
          this.addSkuClass(this.allActionData.key + '')
          break;
        case 'edit':
          this.edit({name: this.allActionData.title, key: this.allActionData.key}, true)
          break;
        case 'delete':
          this.del({name: this.allActionData.title, key: this.allActionData.key}, true)
          break;
      }
    },
    edit(thisSkuClass, current) {
      const _this = this
      _this.skuClassName = thisSkuClass.name
      _this.$refs.addSkuClassModal.dialog({
        title: '修改当前分类名称',
        only: false,
        confirmText: '修改',
        onConfirm() {
          return new Promise((resolve) => {
            if (!_this.skuClassName) {
              Message.toast('请输入分类名称！')
              resolve(false)
              return
            }
            Sku.spuClassEdit({
              data: {
                spuClassificationId: thisSkuClass.key,
                name: _this.skuClassName
              }
            }).then(() => {
              const newSkuClass = {
                key: thisSkuClass.key,
                title: _this.skuClassName
              }
              if (current) {
                _this.skuClassListChange(_this.skuClassList.map(item => {
                  if (item.key === newSkuClass.key) {
                    return {...item, title: newSkuClass.title}
                  }
                  return item
                }))
              } else {
                _this.skuClassPage = _this.skuClassPage.map(item => {
                  if (item.key === newSkuClass.key) {
                    return {...item, name: newSkuClass.title}
                  }
                  return item
                })
              }

              _this.tree = _this.editSkuClassChildren(newSkuClass, _this.tree)
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
    },
    del(thisSkuClass, current) {
      const _this = this
      _this.$refs.modal.dialog({
        title: '删除后不可恢复，是否确认删除？',
        content: '删除分类【' + thisSkuClass.name + '】',
        only: false,
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Sku.spuClassDelete({
              data: {
                spuClassificationId: thisSkuClass.key
              }
            }).then(() => {
              _this.tree = delSkuClassChildren(thisSkuClass.key, _this.tree)
              if (current) {
                const newSkuList = _this.skuList
                _this.skuList = []
                setTimeout(() => {
                  _this.skuList = newSkuList
                }, 0)
                _this.skuClassListChange(_this.skuClassList.filter(item => item.key !== thisSkuClass.key))
              } else {
                _this.skuClassPageClick(_this.skuClassPage[_this.skuClassPage.length - 2])
              }
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
    },
    actionSelect({key}) {
      const thisSkuClass = this.skuClassPage[this.skuClassPage.length - 1]
      switch (key) {
        case 'edit':
          this.edit(thisSkuClass)
          break;
        case 'delete':
          this.del(thisSkuClass)
          break
        case 'sys':
          this.sys = true
          break;
      }
    },
    addSku() {
      const thisSkuClass = this.skuClassPage[this.skuClassPage.length - 1]
      uni.navigateTo({
        url: `/Sku/SkuAdd/index?classId=${thisSkuClass.key}`
      })
    },
    afterleave() {
      if (this.sys || this.actionShow || this.allActionShow || this.$refs.addSkuClassModal?.showStatus() || this.$refs.modal.showStatus() || this.$refs.skuManage.showStatus()) {
        this.sys = false
        this.pageContainerShow = false
        this.actionShow = false
        this.allActionShow = false
        this.$refs.addSkuClassModal?.close()
        this.$refs.modal.close()
        this.$refs.skuManage.close()
        setTimeout(() => {
          this.pageContainerShow = this.skuClassPage.length > 1
        }, 0)
        return
      }
      if (this.skuClassPage.length > 1) {
        this.pageContainerShow = false
        this.skuClassPageClick(this.skuClassPage[this.skuClassPage.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.skuClassPage.length > 1
        }, 0)
      }
    },
    skuClassListChange(skuClassList) {
      this.skuClassList = skuClassList
      this.$nextTick(function () {
        this.movableViewY = this.skuClassPage.length > 1 ? this.itemHeight + 1 : 1
        this.movableViewX = this.itemWidth - 0.1
        setTimeout(() => {
          this.movableViewY = this.skuClassPage.length > 1 ? this.itemHeight : 0
          this.movableViewX = this.itemWidth
        }, 0)
      })
    },
    async getList() {
      this.loading = true
      const res = await Sku.spuClassTreeView({data: {}}).catch(() => {
        this.error = true
      })
      this.loading = false

      this.tree = res?.data || []
      this.skuClassListChange(res?.data || [])
      this.skuClassPage = [{key: '0', name: '分类'}]
    },
    async skuClassClick(skuClass) {
      const thisSkuClass = this.findSkuClass(skuClass.key, this.tree) || {}
      const children = thisSkuClass.children || []
      this.skuClassListChange(children)
      this.skuClassPage = [...this.skuClassPage, {key: thisSkuClass.key, name: thisSkuClass.title}]
      this.pageContainerShow = true
    },
    async skuClassPageClick(route) {
      if (route.key === '0') {
        this.skuClassListChange(this.tree)
      } else {
        const thisSkuClass = this.findSkuClass(route.key, this.tree) || {}
        this.skuClassListChange(thisSkuClass.children || [])
      }

      const newPage = []
      let stop = false
      this.skuClassPage.forEach(item => {
        if (!stop) {
          newPage.push(item)
        }
        if (item.key === route.key) {
          stop = true
        }
      })
      this.skuClassPage = newPage
      if (newPage.length === 1) {
        this.pageContainerShow = false
      }
    },
    addSkuClass(pid) {
      const _this = this
      _this.skuClassName = ''
      _this.$refs.addSkuClassModal.dialog({
        title: '添加子分类',
        only: false,
        confirmText: '添加',
        onConfirm() {
          return new Promise((resolve) => {
            if (!_this.skuClassName) {
              Message.toast('请输入分类名称！')
              resolve(false)
              return
            }
            Sku.spuClassAdd({
              data: {
                name: _this.skuClassName,
                pid: pid || _this.skuClassPage[_this.skuClassPage.length - 1].key
              }
            }).then((res) => {
              const newSkuClass = {
                key: res.data,
                children: [],
                title: _this.skuClassName
              }
              if (pid) {

              } else {
                _this.skuClassListChange([..._this.skuClassList, newSkuClass])
              }

              const key = pid || _this.skuClassPage[_this.skuClassPage.length - 1].key
              if (key === '0') {
                _this.tree = [..._this.tree, newSkuClass]
              } else {
                _this.tree = addSkuClassChildren(key, newSkuClass, _this.tree)
              }

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
    findSkuClass(key, skuClassList = []) {
      let skuClass = null
      skuClassList.forEach(item => {
        if ((key + '') === (item.key + '')) {
          skuClass = item
        } else {
          const children = this.findSkuClass(key, item.children)
          if (children) {
            skuClass = children
          }
        }
      })
      return skuClass
    },
    editSkuClassChildren(skuClass, skuClassList = []) {
      return skuClassList.map(item => {
        if ((skuClass.key + '') === (item.key + '')) {
          return {...item, ...skuClass}
        } else {
          return {...item, children: this.editSkuClassChildren(skuClass, item.children || [])}
        }
      })
    },
    async onCheckSkuClass(skuClass) {
      if (this.checkSkuClass.find(item => item.key === skuClass.key)) {
        this.checkSkuClass = this.checkSkuClass.filter(item => item.key !== skuClass.key)
      } else {
        this.checkSkuClass = [...this.checkSkuClass, skuClass]
      }
    },
    async onCheckSkus(sku) {
      if (this.checkSkus.find(item => item.skuId === sku.skuId)) {
        this.checkSkus = this.checkSkus.filter(item => item.skuId !== sku.skuId)
      } else {
        this.checkSkus = [...this.checkSkus, sku]
      }
    },
    batchDelete() {
      const skuIds = this.checkSkus.map(item => item.skuId)
      const classIds = this.checkSkuClass.map(item => item.key)
      const _this = this
      this.$refs.modal.dialog({
        title: '删除后不可恢复，是否确认删除？',
        only: false,
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Sku.spuClassBatchDelete({
              data: {skuIds, spuClassificationIds: classIds}
            }).then(() => {
              _this.skuClassListChange(_this.skuClassList.filter(item => !classIds.find(classId => classId === item.key)))

              _this.$refs.skuManage.setRemoveSkuIds(skuIds)
              _this.skuList = _this.skuList.filter(item => !skuIds.find(skuId => skuId === item.skuId))

              _this.tree = delSkuClassIdsChildren(classIds, _this.tree)
              _this.checkSkus = []
              _this.checkSkuClass = []
              resolve(true)
            }).catch(() => {
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '删除失败！'
              })
              resolve(true)
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

.movableArea {
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.movableView {
  width: 100%;
}

.inItem {
  background-color: rgba(0, 122, 255, 0.50);
}

.moveItem {
  opacity: 0.5;
  background-color: #fff;
  box-shadow: 0 1px 10px rgba(34, 33, 81, 0.15);
  z-index: 1;
}

.moveFixItem {
  opacity: 0.3;
  position: absolute;
  width: 100%;
}

.moveLine {
  height: 1px;
  background-color: rgba(0, 122, 255, 0.50);
  position: fixed;
  width: 100%;
}

.navBar {
  .uni-navbar__header {

    > view {
      align-items: flex-end;
    }
  }

  .uni-navbar__content {
    border: none;
  }
}

.title {
  padding: 8px;
  font-size: 14px;
  text-align: center;
  width: 100%;

  .tenantName {
    font-size: 12px;
    color: #ccc;
  }
}

.back {
  height: 51px;
  display: flex;
  align-items: center;
}

.selectUser {
  height: 100vh;
  background-color: #fff;

  .header {
    padding: 8px 12px;
    background-color: #fff;
    border-bottom: solid 1px #EEEEEE;
  }

}

.item {
  padding-left: 12px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;

  .itemTitle {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding-left: 12px;
  }

  .userItem {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .deptIcon {
    //background-color: $body-color;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    //margin-left: 32px;
  }

  .backDept {
    color: rgba(0, 0, 0, 0.5);
  }
}


.drag {
  margin: -6px 0 -5px;
  display: flex;
  align-items: center;
  padding: 0 24px 0;
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

  .sys {
    display: flex;
    align-items: center;
    width: 100%;
    height: 35px;

    .total {
      flex-grow: 1;
      margin-top: -4px;

      .num {
        display: inline-block;
        color: $primary-color;
        padding: 0 4px;
        font-size: 20px;
      }
    }

    .sysActions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

  }

}


</style>
