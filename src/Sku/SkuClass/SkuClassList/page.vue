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
      <view class="header">
        <uni-breadcrumb separator="/">
          <uni-breadcrumb-item v-for="(route,index) in skuClassPage" :key="index">
            <view @click="skuClassPageClick(route)">
              {{ route.name }}
            </view>
          </uni-breadcrumb-item>
        </uni-breadcrumb>
      </view>
      <view
          class="users"
          :style="{height: `calc(100vh - ${47+safeAreaHeight(this,8)}px - 36px)`}"
      >
        <view
            v-if="skuClassPage.length > 1"
            class="item"
            @click="skuClassPageClick(skuClassPage[skuClassPage.length - 2])"
        >
          <view class="deptIcon">
            <Icon icon="icon-fanhui" size="20" />
          </view>
          <view class="backDept">返回上级分类</view>
        </view>
        <Empty
            v-if="skuClassList.length === 0"
            description="暂无数据"
        />
        <view
            v-for="item in skuClassList"
            :key="item.key"
            class="item"
            @click="onCheckSkuClass(item)"
        >
          <view class="deptIcon">
            <Icon icon="icon-gaojizujian" size="20" />
          </view>
          {{ item.title }}
        </view>
      </view>
    </view>

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
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
        <LinkButton @click="actionShow = true">更多管理</LinkButton>
        <u-action-sheet
            cancelText="取消"
            :actions="actionList"
            :show="actionShow"
            @close="actionShow = false"
            @select="actionSelect"
        />
      </view>
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
import {Tenant} from "MES-Apis/lib/Tenant/promise";
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
      skuClassPage: [],
      loading: true,
      skuClassList: [],
      tree: [],
      searchValue: '',
      actionShow: false,
      error: false,
      safeAreaHeight,
      tenant: {},
      actionUser: {},
      pageContainerShow: false,
      userActionShow: false,
      skuClassName: '',
      admin: false,
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
    this.init()
    this.getList()

    const _this = this

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
          disabled: this.skuClassPage.length <= 1
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
          break
      }
    },
    init() {
      const tenant = this.$store.state.userInfo.tenant || {}
      this.tenant = tenant
      this.admin = tenant.admin
      this.showFooter = tenant.admin
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
                _this.skuClassList = _this.skuClassList.map(item => {
                  if (item.key === newSkuClass.key) {
                    return {...item, title: newSkuClass.title}
                  }
                  return item
                })
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
              _this.tree = _this.delSkuClassChildren(thisSkuClass.key, _this.tree)
              if (current) {
                _this.skuClassList = _this.skuClassList.filter(item => item.key !== thisSkuClass.key)
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
      }
    },
    afterleave() {
      if (this.skuClassPage.length > 1) {
        this.pageContainerShow = false
        this.skuClassPageClick(this.skuClassPage[this.skuClassPage.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.skuClassPage.length > 1
        }, 0)
      }
    },
    async getList() {
      this.loading = true
      const res = await Sku.spuClassTreeView({data: {}}).catch(() => {
        this.error = true
      })
      this.loading = false

      this.tree = res.data || []
      this.skuClassList = res.data || []
      this.skuClassPage = [{key: '0', name: '分类管理'}]
    },
    async onCheckSkuClass(skuClass) {
      const thisSkuClass = this.findSkuClass(skuClass.key, this.tree) || {}
      const children = thisSkuClass.children || []
      if (children.length === 0) {
        this.allActionShow = true
        this.allActionData = skuClass
        return
      }
      this.skuClassList = children
      this.skuClassPage = [...this.skuClassPage, {key: thisSkuClass.key, name: thisSkuClass.title}]
      this.pageContainerShow = true
    },
    async skuClassPageClick(route) {
      if (route.key === '0') {
        this.skuClassList = this.tree
      } else {
        const thisSkuClass = this.findSkuClass(route.key, this.tree) || {}
        this.skuClassList = thisSkuClass.children || []
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
                sort: _this.skuClassList.length,
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
                _this.skuClassList = [..._this.skuClassList, newSkuClass]
              }

              const key = pid || _this.skuClassPage[_this.skuClassPage.length - 1].key
              if (key === '0') {
                _this.tree = [..._this.tree, newSkuClass]
              } else {
                _this.tree = _this.addSkuClassChildren(key, newSkuClass, _this.tree)
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
    addSkuClassChildren(key, skuClass, skuClassList = []) {
      return skuClassList.map(item => {
        if ((key + '') === (item.key + '')) {
          return {...item, children: [...item.children, skuClass]}
        } else {
          return {...item, children: this.addSkuClassChildren(key, skuClass, item.children || [])}
        }
      })
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
    delSkuClassChildren(key, skuClassList = []) {
      const newSkuClassList = []
      skuClassList.map(item => {
        if ((key + '') !== (item.key + '')) {
          newSkuClassList.push({...item, children: this.delSkuClassChildren(key, item.children || [])})
        }
      })
      return newSkuClassList
    },
    editUser(user) {
      this.actionUser = user
      this.userActionShow = true
    }
  }
}
</script>

<style lang="scss">

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

  .header {
    padding: 8px 12px;
    background-color: #fff;
    border-bottom: solid 1px #EEEEEE;
  }

  .users {
    overflow: auto;
    background-color: #fff;
    padding: 0 12px;
  }

}

.item {
  padding: 6px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;

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
