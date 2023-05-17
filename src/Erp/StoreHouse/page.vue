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

    <StoreHouseManage
        v-else
        :admin="admin"
        :tree="tree"
        :store-house-list="storeHouseList"
        :store-house-page="storeHousePage"
        :itemWidth="itemWidth"
        :movableViewY="movableViewY"
        :movableViewX="movableViewX"
        @listChange="listChange"
        @onCheckStoreHouse="onCheckStoreHouse"
        @storeHousePageClick="storeHousePageClick"
        @treeChange="(newTree)=>tree = newTree"
    />

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <view class="action">
        <LinkButton @click="addStoreHouse">添加子仓库</LinkButton>
        <Modal ref="addStoreHouseModal">
          <u--input
              placeholder="请输入仓库名称"
              clearable
              v-model="storeHouseName"
          />
        </Modal>
      </view>
      <view class="action">
        <LinkButton :disabled="this.storeHousePage.length <= 1" @click="actionShow = true">更多管理</LinkButton>
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
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Popup from "../../components/Popup";
import Tree from "../../components/Tree";
import {Dept} from "MES-Apis/lib/Dept/promise";
import StoreHouseManage from "./components/StoreHouseManage";
import {addStoreHouseChildren, delStoreHouseChildren} from "./index";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'store'],
  name: 'SelectUser',
  components: {
    StoreHouseManage,
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
      storeHousePage: [],
      loading: true,
      storeHouseList: [],
      deptTree: [],
      deptTreeLoading: false,
      tree: [],
      searchValue: '',
      actionShow: false,
      error: false,
      safeAreaHeight,
      pageContainerShow: false,
      userActionShow: false,
      storeHouseName: '',
      admin: false,
      allActionList: [
        {
          name: '添加子仓库',
          key: 'add'
        },
        {
          name: '修改仓库',
          key: 'edit',
        },
        {
          name: '删除仓库',
          key: 'delete',
          color: 'red',
        },
      ],
      allActionShow: false,
      allActionData: {},
      itemWidth: 0,
      movableViewY: 0,
      movableViewX: 0,
    }
  },
  mounted() {
    this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth
    const tenant = this.$store.state.userInfo.tenant || {}
    this.admin = tenant.admin
    const _this = this
    uni.$on('storeHouseAddSuccess', (result) => {
      const newStore = {key: result.id, title: result.name}
      if (result.pid === _this.storeHousePage[_this.storeHousePage.length - 1].key) {
        _this.listChange([..._this.storeHouseList, {key: result.id, title: result.name}])
      }

      if (result.pid === '0') {
        _this.tree = [..._this.tree, newStore]
      } else {
        _this.tree = addStoreHouseChildren(result.pid, newStore, _this.tree)
      }
    })

    uni.$on('storeHouseEditSuccess', (result) => {
      const newStore = {key: result.id, title: result.name}
      if (result.pid === _this.storeHousePage[_this.storeHousePage.length - 1].key) {
        _this.listChange(_this.storeHouseList.map(item => {
          if (item.key === newStore.key) {
            return {...item, title: newStore.title}
          }
          return item
        }))
      } else {
        _this.storeHousePage = _this.storeHousePage.map(item => {
          if (item.key === newStore.key) {
            return {...item, name: newStore.title}
          }
          return item
        })
      }

      _this.tree = _this.editStoreHouseChildren(newStore, _this.tree)
    })
    this.getList()
  },
  computed: {
    actionList() {
      return [
        {
          name: '修改当前仓库',
          key: 'edit',
        },
        {
          name: '删除当前仓库',
          key: 'delete',
          color: 'red',
        },
      ]
    }
  },
  methods: {
    allActionSelect({key}) {
      switch (key) {
        case 'add':
          this.addStoreHouse(this.allActionData.key + '')
          break;
        case 'edit':
          this.edit({name: this.allActionData.title, key: this.allActionData.key}, true)
          break;
        case 'delete':
          this.del({name: this.allActionData.title, key: this.allActionData.key}, true)
          break
      }
    },
    edit(thisStoreHouse, current) {
      uni.navigateTo({
        url: `/Erp/StoreHouse/StoreHouseAdd/index?id=${thisStoreHouse.key}&pid=${this.storeHousePage[this.storeHousePage.length - (current ? 1 : 2)].key}`
      })
    },
    del(thisStoreHouse, current) {
      const _this = this
      _this.$refs.modal.dialog({
        title: '删除后不可恢复，是否确认删除？',
        content: '删除仓库【' + thisStoreHouse.name + '】',
        only: false,
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Storehouse.storeHouseDelete({
              data: {storehouseId: thisStoreHouse.key}
            }).then(() => {
              _this.tree = delStoreHouseChildren(thisStoreHouse.key, _this.tree)
              if (current) {
                _this.listChange(_this.storeHouseList.filter(item => item.key !== thisStoreHouse.key))
              } else {
                _this.storeHousePageClick(_this.storeHousePage[_this.storeHousePage.length - 2])
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
      const thisStoreHouse = this.storeHousePage[this.storeHousePage.length - 1]
      switch (key) {
        case 'edit':
          this.edit(thisStoreHouse)
          break;
        case 'delete':
          this.del(thisStoreHouse)
          break
        case 'bind':
          this.bind(thisStoreHouse)
          break;
        case 'auth':
          this.bind(thisStoreHouse)
          break;
      }
    },
    afterleave() {
      if (this.storeHousePage.length > 1) {
        this.pageContainerShow = false
        this.storeHousePageClick(this.storeHousePage[this.storeHousePage.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.storeHousePage.length > 1
        }, 0)
      }
    },
    async getList() {
      this.loading = true
      const res = await Storehouse.storeHouseTreeV2_0({
        params: {
          ids: this.storehouseId
        }
      }).catch(() => {
        this.error = true
      })
      this.loading = false

      this.tree = this.format(res.data || [])
      this.listChange(this.format(res.data || []))
      this.storeHousePage = [{key: '0', name: '顶级仓库'}]
    },
    format(data) {
      const list = [];
      data.forEach(item => {
        const obj = {
          title: item.name,
          key: item.storehouseId
        }
        if (isArray(item.childrenList).length > 0) {
          obj.children = this.format(item.childrenList || []);
        } else {
          obj.children = []
        }
        list.push(obj);
      })

      return list;
    },
    async onCheckStoreHouse(storeHouse) {
      const thisStoreHouse = this.findStoreHouse(storeHouse.key, this.tree) || {}
      const children = thisStoreHouse.children || []
      if (children.length === 0) {
        this.allActionShow = true
        this.allActionData = storeHouse
        return
      }
      this.listChange(children)
      this.storeHousePage = [...this.storeHousePage, {key: thisStoreHouse.key, name: thisStoreHouse.title}]
      this.pageContainerShow = true
    },
    async storeHousePageClick(route) {
      if (route.key === '0') {
        this.listChange(this.tree)
      } else {
        const thisStoreHouse = this.findStoreHouse(route.key, this.tree) || {}
        this.listChange(thisStoreHouse.children || [])
      }

      const newPage = []
      let stop = false
      this.storeHousePage.forEach(item => {
        if (!stop) {
          newPage.push(item)
        }
        if (item.key === route.key) {
          stop = true
        }
      })
      this.storeHousePage = newPage
      if (newPage.length === 1) {
        this.pageContainerShow = false
      }
    },
    addStoreHouse(pid) {
      uni.navigateTo({
        url: `/Erp/StoreHouse/StoreHouseAdd/index?pid=${pid || this.storeHousePage[this.storeHousePage.length - 1].key}`
      })
    },
    findStoreHouse(key, storeHouseList = []) {
      let storeHouse = null
      storeHouseList.forEach(item => {
        if ((key + '') === (item.key + '')) {
          storeHouse = item
        } else {
          const children = this.findStoreHouse(key, item.children)
          if (children) {
            storeHouse = children
          }
        }
      })
      return storeHouse
    },
    editStoreHouseChildren(storeHouse, storeHouseList = []) {
      return storeHouseList.map(item => {
        if ((storeHouse.key + '') === (item.key + '')) {
          return {...item, ...storeHouse}
        } else {
          return {...item, children: this.editStoreHouseChildren(storeHouse, item.children || [])}
        }
      })
    },
    listChange(storeHouseList) {
      this.storeHouseList = storeHouseList
      this.$nextTick(function () {
        this.movableViewY = this.storeHousePage.length > 1 ? 49 : 1
        this.movableViewX = this.itemWidth - 0.1
        setTimeout(() => {
          this.movableViewY = this.storeHousePage.length > 1 ? 48 : 0
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
    padding: 0 12px;
  }

}

.item {
  padding: 0 6px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 47px;

  .itemTitle {
    flex-grow: 1;
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
