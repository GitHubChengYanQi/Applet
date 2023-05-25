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

    <PositionManage
        ref="positionManage"
        v-else
        :admin="admin"
        :tree="tree"
        :list="list"
        :page="page"
        :itemHeight="itemHeight"
        :itemWidth="itemWidth"
        :movableViewY="movableViewY"
        :movableViewX="movableViewX"
        @listChange="listChange"
        @onCheck="onCheck"
        @pageClick="pageClick"
        @treeChange="(newTree)=>tree = newTree"
        @onDelete="(_this)=>del(_this,true)"
        @onEdit="(_this)=>edit(_this,true)"
        @bindSku="bind"
    />

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <view class="action">
        <LinkButton @click="addPosition">添加子库位</LinkButton>
      </view>
      <view class="action">
        <LinkButton :disabled="page.length <= 1" @click="actionShow = true">更多管理</LinkButton>
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
        <Tree icon="icon-bumen1" :data="deptTree" v-model="positionAuths" />
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
import {isArray, safeAreaHeight} from "../../util/Tools";
import MyButton from "../../components/MyButton";
import Check from "../../components/Check";
import Icon from "../../components/Icon";
import LinkButton from "../../components/LinkButton";
import AddUser from "../../components/AddUser";
import Modal from "../../components/Modal";
import {Init} from "MES-Apis/lib/Init";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Popup from "../../components/Popup";
import Tree from "../../components/Tree";
import {Dept} from "MES-Apis/lib/Dept/promise";
import {Position} from "MES-Apis/lib/Position/promise";
import PositionManage from "./components/PositionManage";
import {delChildren} from "./index";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'store'],
  name: 'SelectUser',
  components: {
    PositionManage,
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
      page: [],
      loading: true,
      list: [],
      deptTree: [],
      deptTreeLoading: false,
      tree: [],
      searchValue: '',
      actionShow: false,
      error: false,
      safeAreaHeight,
      pageContainerShow: false,
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
      allActionData: {},
      itemWidth: 0,
      movableViewY: 0,
      movableViewX: 0,
      itemHeight: 68,
    }
  },
  mounted() {
    const tenant = this.$store.state.userInfo.tenant || {}
    this.admin = tenant.admin
    this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth
    this.getList()
    this.getDeptTree()

    const _this = this

    uni.$on('positionsAddSuccess', () => {
      _this.getList(true, _this.page[_this.page.length - 1].key)
    })

    uni.$on('positionsEditSuccess', (result) => {
      _this.getList(true, _this.page[_this.page.length - 1].key)

      _this.page = _this.page.map(item => {
        if (item.key === result.id) {
          return {...item, name: result.name}
        }
        return item
      })
    })
  },
  computed: {
    actionList() {
      return [
        {
          name: '修改当前库位',
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
          disabled: this.list.length > 0
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
      const thisItem = {name: this.allActionData.title, key: this.allActionData.key}
      switch (key) {
        case 'add':
          this.addPosition(this.allActionData.key + '')
          break;
        case 'edit':
          this.edit(thisItem, true)
          break;
        case 'delete':
          this.del(thisItem, true)
          break
        case 'bind':
          this.bind(thisItem)
          break;
        case 'auth':
          this.auth(thisItem)
          break;
      }
    },
    edit(thisPosition, current) {
      uni.navigateTo({
        url: `/Erp/Positions/PositionsAdd/index?storehousePositionsId=${thisPosition.key}&storehouseId=${this.storehouseId}&pid=${this.page[this.page.length - (current ? 1 : 2)].key}&store=${this.store}`
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
              _this.tree = delChildren(thisPosition.key, _this.tree)
              if (current) {
                _this.listChange(_this.list.filter(item => item.key !== thisPosition.key))
              } else {
                _this.pageClick(_this.page[_this.page.length - 2])
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
      const thisPosition = this.page[this.page.length - 1]
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
          this.auth(thisPosition)
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
      if (this.authShow || this.actionShow || this.allActionShow || this.$refs.modal.showStatus() || this.$refs.positionManage.showStatus()) {
        this.pageContainerShow = false
        this.authShow = false
        this.actionShow = false
        this.allActionShow = false
        this.$refs.modal.close()
        this.$refs.positionManage.close()
        setTimeout(() => {
          this.pageContainerShow = this.page.length > 1
        }, 0)
        return
      }
      if (this.page.length > 1) {
        this.pageContainerShow = false
        this.pageClick(this.page[this.page.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.page.length > 1
        }, 0)
      }
    },
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
    async getList(refresh, topKey) {
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

      if (refresh) {
        if (topKey === '0') {
          this.listChange(this.tree)
        } else {
          const thisStoreHouse = this.findPosition(topKey, this.tree)
          this.listChange(thisStoreHouse.children)
        }
      } else {
        this.listChange(res.data || [])
        this.page = [{key: '0', name: this.store}]
      }
    },
    async onCheck(position) {
      const thisPosition = this.findPosition(position.key, this.tree) || {}
      const children = thisPosition.children || []
      if (children.length === 0) {
        this.allActionShow = true
        this.allActionData = position
        return
      }
      this.listChange(children)
      this.page = [...this.page, {key: thisPosition.key, name: thisPosition.title}]
      this.pageContainerShow = true
    },
    async pageClick(route) {
      if (route.key === '0') {
        this.listChange(this.tree)
      } else {
        const thisPosition = this.findPosition(route.key, this.tree) || {}
        this.listChange(thisPosition.children || [])
      }

      const newPage = []
      let stop = false
      this.page.forEach(item => {
        if (!stop) {
          newPage.push(item)
        }
        if (item.key === route.key) {
          stop = true
        }
      })
      this.page = newPage
      if (newPage.length === 1) {
        this.pageContainerShow = false
      }
    },
    addPosition(pid) {
      uni.navigateTo({
        url: `/Erp/Positions/PositionsAdd/index?storehouseId=${this.storehouseId}&pid=${pid || this.page[this.page.length - 1].key}&store=${this.store}`
      })
    },
    findPosition(key, list = []) {
      let position = null
      list.forEach(item => {
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
    editPositionChildren(position, list = []) {
      return list.map(item => {
        if ((position.key + '') === (item.key + '')) {
          return {...item, ...position}
        } else {
          return {...item, children: this.editPositionChildren(position, item.children || [])}
        }
      })
    },
    listChange(list) {
      this.list = list
      this.$nextTick(function () {
        this.movableViewY = this.page.length > 1 ? this.itemHeight + 1 : 1
        this.movableViewX = this.itemWidth - 0.1
        setTimeout(() => {
          this.movableViewY = this.page.length > 1 ? this.itemHeight : 0
          this.movableViewX = this.itemWidth
        }, 0)
      })
    },
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
    overflow: hidden auto;
    background-color: #fff;
  }

}

.item {
  padding-left: 12px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 12px;

  .itemTitle {
    flex-grow: 1;

    .itemDescribe {
      padding-right: 12px;
      font-size: 12px;
      color: #808080;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
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
