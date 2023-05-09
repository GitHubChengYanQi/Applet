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
        v-if="loading"
    />
    <view v-else class="selectUser">
      <view class="header">
        <uni-breadcrumb separator="/">
          <uni-breadcrumb-item v-for="(route,index) in positionPage" :key="index">
            <view @click="positionPageClick(route)">
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
            v-if="positionPage.length > 1"
            class="item"
            @click="positionPageClick(positionPage[positionPage.length - 2])"
        >
          <view class="deptIcon">
            <Icon icon="icon-fanhui" size="20" />
          </view>
          <view class="backDept">返回上级库位</view>
        </view>
        <Empty
            v-if="positionList.length === 0"
            description="暂无数据"
        />
        <view
            v-for="item in positionList"
            :key="item.key"
            class="item"
            @click="onCheckPosition(item)"
        >
          <view class="deptIcon">
            <Icon icon="icon-pandiankuwei1" size="30" />
          </view>
          {{ item.title }}
        </view>
      </view>
    </view>

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <view class="action">
        <LinkButton @click="addPosition">添加子库位</LinkButton>
        <Modal ref="addPositionModal">
          <u--input
              placeholder="请输入库位名称"
              clearable
              v-model="positionName"
          />
        </Modal>
      </view>
      <view class="action">
        <LinkButton :disabled="this.positionPage.length <= 1" @click="actionShow = true">更多管理</LinkButton>
        <u-action-sheet
            cancelText="取消"
            :actions="actionList"
            :show="actionShow"
            @close="actionShow = false"
            @select="actionSelect"
        />
      </view>
    </view>

    <Popup
        :show="authShow"
        :title="authData.name + ' 权限设置'"
        @close="authShow = false"
        left-text="取消"
        right-text="保存"
        @onLeft="authShow = false"
        @onRight="saveAuth"
    >
      <Loading skeleton v-if="deptTreeLoading" />
      <view v-else class="deptTree">
        <Tree :data="deptTree" v-model="positionAuths" />
      </view>
    </Popup>

    <Loading :loading="getPositionAuthsLoading || saveAuthLoading" />

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
import Search from "../../components/Search";
import Loading from "../../components/Loading";
import UserName from "../../components/UserName";
import Empty from "../../components/Empty";
import Avatar from "../../components/Avatar";
import {safeAreaHeight} from "../../util/Tools";
import MyButton from "../../components/MyButton";
import Check from "../../components/Check";
import Icon from "../../components/Icon";
import LinkButton from "../../components/LinkButton";
import AddUser from "../../components/AddUser";
import Modal from "../../components/Modal";
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Popup from "../../components/Popup";
import Tree from "../../components/Tree";
import {Dept} from "MES-Apis/lib/Dept/promise";
import {Sku} from "MES-Apis/lib/Sku/promise";
import {Position} from "MES-Apis/lib/Position/promise";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'store'],
  name: 'SelectUser',
  components: {
    Tree,
    Popup,
    Modal,
    AddUser,
    LinkButton,
    Icon,
    Check,
    MyButton,
    Avatar,
    Empty,
    UserName,
    Loading,
    Search
  },
  data() {
    return {
      authShow: false,
      positionPage: [],
      loading: true,
      positionList: [],
      deptTree: [],
      deptTreeLoading: false,
      tree: [],
      searchValue: '',
      actionShow: false,
      error: false,
      safeAreaHeight,
      tenant: {},
      actionUser: {},
      pageContainerShow: false,
      userActionShow: false,
      positionName: '',
      admin: false,
      getPositionAuthsLoading: false,
      saveAuthLoading: false,
      positionAuths: [],
      authData: {},
      allActionList: [
        {
          name: '添加子库位',
          key: 'add'
        },
        {
          name: '修改库位名称',
          key: 'edit',
        },
        {
          name: '删除库位',
          key: 'delete',
          color: 'red',
        },
        {
          name: '设置权限',
          // color: '#007aff',
          key: 'auth',
        },
        {
          name: '绑定物料',
          color: '#007aff',
          key: 'bind',
        },
      ],
      allActionShow: false,
      allActionData: {}
    }
  },
  mounted() {
    this.getList()
    this.getDeptTree()
  },
  computed: {
    actionList() {
      return [
        {
          name: '修改当前库位名称',
          key: 'edit',
        },
        {
          name: '删除当前库位',
          key: 'delete',
          color: 'red',
        },
        {
          name: '设置权限',
          // color: '#007aff',
          key: 'auth',
        },
        {
          name: '绑定物料',
          color: '#007aff',
          key: 'bind',
          disabled: this.positionList.length > 0
        },
      ]
    }
  },
  methods: {
    saveAuth() {
      this.saveAuthLoading = true
      Position.positionDepts({
        data: {
          storehousePositionsId: this.authData.key,
          deptId: this.positionAuths.map(item => item.key).toString(),
        }
      }).then(() => {
        this.authShow = false
      }).catch(() => {
        this.$refs.modal.dialog({
          title: '设置失败！'
        })
      }).finally(() => {
        this.saveAuthLoading = false
      })
    },
    allActionSelect({key}) {
      switch (key) {
        case 'add':
          this.addPosition(this.allActionData.key + '')
          break;
        case 'edit':
          this.edit({name: this.allActionData.title, key: this.allActionData.key}, true)
          break;
        case 'delete':
          this.del({name: this.allActionData.title, key: this.allActionData.key}, true)
          break
        case 'bind':
          this.bind({name: this.allActionData.title, key: this.allActionData.key})
          break;
        case 'auth':
          this.auth({name: this.allActionData.title, key: this.allActionData.key})
          break;
      }
    },
    edit(thisPosition, current) {
      const _this = this
      _this.positionName = thisPosition.name
      _this.$refs.addPositionModal.dialog({
        title: '修改当前库位名称',
        only: false,
        confirmText: '修改',
        onConfirm() {
          return new Promise((resolve) => {
            if (!_this.positionName) {
              Message.toast('请输入库位名称！')
              resolve(false)
              return
            }
            Storehouse.positionsEdit({
              data: {
                storehousePositionsId: thisPosition.key,
                name: _this.positionName
              }
            }).then(() => {
              const newPosition = {
                key: thisPosition.key,
                title: _this.positionName
              }
              if (current) {
                _this.positionList = _this.positionList.map(item => {
                  if (item.key === newPosition.key) {
                    return {...item, title: newPosition.title}
                  }
                  return item
                })
              } else {
                _this.positionPage = _this.positionPage.map(item => {
                  if (item.key === newPosition.key) {
                    return {...item, name: newPosition.title}
                  }
                  return item
                })
              }
              _this.tree = _this.editPositionChildren(newPosition, _this.tree)
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
    del(thisPosition, current) {
      const _this = this
      _this.$refs.modal.dialog({
        title: '删除后不可恢复，是否确认删除？',
        content: '删除库位【' + thisPosition.name + '】',
        only: false,
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Storehouse.positionsDelete({
              data: {storehousePositionsId: thisPosition.key}
            }).then(() => {
              _this.tree = _this.delPositionChildren(thisPosition.key, _this.tree)
              if (current) {
                _this.positionList = _this.positionList.filter(item => item.key !== thisPosition.key)
              } else {
                _this.positionPageClick(_this.positionPage[_this.positionPage.length - 2])
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
    bind(thisPosition) {
      uni.navigateTo({
        url: `/Erp/Positions/PositionBind/index?storehousePositionsId=${thisPosition.key}&position=${thisPosition.name}&store=${this.store}`
      })
    },
    auth(thisPosition) {
      this.getPositionAuths(thisPosition.key)
      this.authData = thisPosition
    },
    actionSelect({key}) {
      const thisPosition = this.positionPage[this.positionPage.length - 1]
      switch (key) {
        case 'edit':
          this.edit(thisPosition)
          break;
        case 'delete':
          this.del(thisPosition)
          break
        case 'bind':
          this.bind(thisPosition)
          break;
        case 'auth':
          this.bind(thisPosition)
          break;
      }
    },
    getPositionAuths(positionId) {
      this.getPositionAuthsLoading = true
      Storehouse.positionsBindGetDeptIds({
        params: {positionId}
      }).then((res) => {
        this.positionAuths = (res || []).map(key => ({key}))
        this.authShow = true
      }).catch(() => {
      }).finally(() => {
        this.getPositionAuthsLoading = false
      })
    },
    afterleave() {
      if (this.positionPage.length > 1) {
        this.pageContainerShow = false
        this.positionPageClick(this.positionPage[this.positionPage.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.positionPage.length > 1
        }, 0)
      }
    },
    getDeptTree() {
      this.deptTreeLoading = true
      Dept.deptTree().then((res) => {
        this.deptTree = res.data || []
      }).catch(() => {
      }).finally(() => {
        this.deptTreeLoading = false
      })
    },
    async getList() {
      this.loading = true
      const res = await Storehouse.positionsTreeView({
        params: {
          ids: this.storehouseId
        }
      }).catch(() => {
        this.error = true
      })
      this.loading = false

      this.tree = res.data || []
      this.positionList = res.data || []
      this.positionPage = [{key: '0', name: this.store}]
    },
    async onCheckPosition(position) {
      const thisPosition = this.findPosition(position.key, this.tree) || {}
      const children = thisPosition.children || []
      if (children.length === 0) {
        this.allActionShow = true
        this.allActionData = position
        return
      }
      this.positionList = children
      this.positionPage = [...this.positionPage, {key: thisPosition.key, name: thisPosition.title}]
      this.pageContainerShow = true
    },
    async positionPageClick(route) {
      if (route.key === '0') {
        this.positionList = this.tree
      } else {
        const thisPosition = this.findPosition(route.key, this.tree) || {}
        this.positionList = thisPosition.children || []
      }

      const newPage = []
      let stop = false
      this.positionPage.forEach(item => {
        if (!stop) {
          newPage.push(item)
        }
        if (item.key === route.key) {
          stop = true
        }
      })
      this.positionPage = newPage
      if (newPage.length === 1) {
        this.pageContainerShow = false
      }
    },
    addPosition(pid) {
      const _this = this
      _this.positionName = ''
      _this.$refs.addPositionModal.dialog({
        title: '添加子库位',
        only: false,
        confirmText: '添加',
        onConfirm() {
          return new Promise((resolve) => {
            if (!_this.positionName) {
              Message.toast('请输入库位名称！')
              resolve(false)
              return
            }
            Storehouse.positionsAdd({
              data: {
                name: _this.positionName,
                sort: _this.positionList.length,
                storehouseId: _this.storehouseId,
                pid: pid || _this.positionPage[_this.positionPage.length - 1].key
              }
            }).then((res) => {
              const newPosition = {
                key: res.data,
                children: [],
                title: _this.positionName
              }
              if (pid) {

              } else {
                _this.positionList = [..._this.positionList, newPosition]
              }

              const key = pid || _this.positionPage[_this.positionPage.length - 1].key
              if (key === '0') {
                _this.tree = [..._this.tree, newPosition]
              } else {
                _this.tree = _this.addPositionChildren(key, newPosition, _this.tree)
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
    findPosition(key, positionList = []) {
      let position = null
      positionList.forEach(item => {
        if ((key + '') === (item.key + '')) {
          position = item
        } else {
          const children = this.findPosition(key, item.children)
          if (children) {
            position = children
          }
        }
      })
      return position
    },
    addPositionChildren(key, position, positionList = []) {
      return positionList.map(item => {
        if ((key + '') === (item.key + '')) {
          return {...item, children: [...item.children, position]}
        } else {
          return {...item, children: this.addPositionChildren(key, position, item.children || [])}
        }
      })
    },
    editPositionChildren(position, positionList = []) {
      return positionList.map(item => {
        if ((position.key + '') === (item.key + '')) {
          return {...item, ...position}
        } else {
          return {...item, children: this.editPositionChildren(position, item.children || [])}
        }
      })
    },
    delPositionChildren(key, positionList = []) {
      const newPositionList = []
      positionList.map(item => {
        if ((key + '') !== (item.key + '')) {
          newPositionList.push({...item, children: this.delPositionChildren(key, item.children || [])})
        }
      })
      return newPositionList
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

.deptTree {
  height: 50vh;
  overflow: auto;
}


</style>
