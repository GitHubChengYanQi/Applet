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
        ref="storeHouseManage"
        v-else
        :admin="admin"
        :tree="tree"
        :store-house-list="storeHouseList"
        :store-house-page="storeHousePage"
        :itemHeight="itemHeight"
        :itemWidth="itemWidth"
        :movableViewY="movableViewY"
        :movableViewX="movableViewX"
        @listChange="listChange"
        @onCheckStoreHouse="onCheckStoreHouse"
        @storeHousePageClick="storeHousePageClick"
        @treeChange="(newTree)=>tree = newTree"
        @onDelete="(_this)=>del(_this,true)"
        @onEdit="(_this)=>edit(_this,true)"
        @bindClass="openBindSkuClass"
        :checkList="checkList"
        @onCheckList="onCheckList"
        :sys="sys"
    />

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <template v-if="sys">
        <view class="sys">
          <view class="total">
            已选
            <view class="num">{{ checkList.length }}</view>
            个
          </view>
          <view class="sysActions">
            <MyButton
                :loading="delLoading"
                type="error"
                :disabled="checkList.length === 0"
                @click="batchDelete"
            >
              批量删除
            </MyButton>
            <MyButton type="primary" @click="sys = false">退出管理</MyButton>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="action" v-if="admin">
          <LinkButton @click="addStoreHouse">添加子仓库</LinkButton>
        </view>
        <view class="action" v-if="!admin">
          <LinkButton :disabled="storeHousePage.length === 1" @click="actionSelect({key:'position'})">查看当前仓库库位</LinkButton>
        </view>
        <view class="action" v-if="admin">
          <LinkButton @click="actionShow = true;checkList=[]">更多管理</LinkButton>
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

    <Popup
        title="绑定分类"
        z-index="99"
        :show="classShow"
        left-text="取消"
        right-text="保存"
        @close="classShow = false"
        @onLeft="classShow = false"
        @onRight="saveBindSkuClass"
    >
      <Loading skeleton v-if="categoryLoading" />
      <view v-else style="padding: 12px">
        <Tree icon="icon-gaojizujian" :data="cateGoryData" v-model="classList" multiple />
      </view>
    </Popup>

    <Loading :loading="saveBindSkuClassLoading" />

    <Modal ref="modal" />
  </view>
</template>

<script>
import Search from "../../components/Search";
import Loading from "../../components/Loading";
import UserName from "../../components/UserName";
import Empty from "../../components/Empty";
import Avatar from "../../components/Avatar";
import {findThisInTree, isArray, safeAreaHeight} from "../../util/Tools";
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
import StoreHouseManage from "./components/StoreHouseManage";
import {delStoreHouseChildren, delStoreIdsChildren} from "./index";
import {Sku} from "MES-Apis/lib/Sku/promise";

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
      saveBindSkuClassLoading: false,
      classShow: false,
      itemHeight: 68,
      cateGoryData: [],
      categoryLoading: false,
      classList: [],
      admin: false,
      allActionList: [
        {
          name: '添加子仓库',
          key: 'add'
        },
        {
          name: '查看库位',
          key: 'position'
        },
      ],
      allActionShow: false,
      allActionData: {},
      itemWidth: 0,
      movableViewY: 0,
      movableViewX: 0,
      storeId: null,
      sys: false,
      checkList: [],
      delLoading: false
    }
  },
  mounted() {
    this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth
    const tenant = this.$store.state.userInfo.tenant || {}
    this.admin = tenant.admin
    this.allActionList = this.admin ? [
      {
        name: '添加子仓库',
        key: 'add'
      },
      {
        name: '查看库位',
        key: 'position'
      },
    ] : [
      {
        name: '查看库位',
        key: 'position'
      },
    ]
    const _this = this
    uni.$on('storeHouseAddSuccess', () => {
      _this.getList(true, _this.storeHousePage[_this.storeHousePage.length - 1].key)
    })

    uni.$on('storeHouseEditSuccess', (result) => {
      _this.getList(true, _this.storeHousePage[_this.storeHousePage.length - 1].key)

      _this.storeHousePage = _this.storeHousePage.map(item => {
        if (item.key === result.id) {
          return {...item, name: result.name}
        }
        return item
      })
    })
    this.getList()

    this.getCateGory()
  },
  computed: {
    actionList() {
      return [
        {
          name: '查看当前仓库库位',
          key: 'position',
          disabled: this.storeHousePage.length <= 1
        },
        {
          name: '修改当前仓库',
          key: 'edit',
          disabled: this.storeHousePage.length <= 1
        },
        {
          name: '删除当前仓库',
          key: 'delete',
          color: 'red',
          disabled: this.storeHousePage.length <= 1
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
          this.addStoreHouse(this.allActionData.key + '')
          break;
        case 'position':
          uni.navigateTo({
            url: `/Erp/Positions/index?storehouseId=${this.allActionData.key}&store=${this.allActionData.title}`
          })
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
        case 'position':
          uni.navigateTo({
            url: `/Erp/Positions/index?storehouseId=${thisStoreHouse.key}&store=${thisStoreHouse.name}`
          })
          break;
        case 'sys':
          this.sys = true
          break;
      }
    },
    afterleave() {
      if (this.sys || this.actionShow || this.allActionShow || this.$refs.modal.showStatus() || this.$refs.storeHouseManage.showStatus()) {
        this.sys = false
        this.pageContainerShow = false
        this.actionShow = false
        this.allActionShow = false
        this.$refs.modal.close()
        this.$refs.storeHouseManage.close()
        setTimeout(() => {
          this.pageContainerShow = this.storeHousePage.length > 1
        }, 0)
        return
      }
      if (this.storeHousePage.length > 1) {
        this.pageContainerShow = false
        this.storeHousePageClick(this.storeHousePage[this.storeHousePage.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.storeHousePage.length > 1
        }, 0)
      }
    },
    async getList(refresh, topKey) {
      this.loading = true
      const res = await Storehouse.storeHouseTreeV2_0().catch(() => {
        this.error = true
      })
      this.loading = false

      this.tree = this.format(res.data || [])
      if (refresh) {
        if (topKey === '0') {
          this.listChange(this.tree)
        } else {
          const thisStoreHouse = this.findThisInTree(topKey, this.tree)
          this.listChange(thisStoreHouse.children)
        }

      } else {
        this.listChange(this.format(res.data || []))
        this.storeHousePage = [{key: '0', name: '顶级仓库'}]
      }
    },
    format(data) {
      const list = [];
      data.forEach(item => {
        const obj = {
          title: item.name,
          key: item.storehouseId,
          objects: isArray(item.spuClassResults).filter(item => item).map(item => item.name)
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
      const thisStoreHouse = findThisInTree(storeHouse.key, this.tree) || {}
      const children = thisStoreHouse.children || []
      if (children.length === 0) {
        // if (!this.admin) {
        //   return
        // }
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
        const thisStoreHouse = findThisInTree(route.key, this.tree) || {}
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
        this.movableViewY = this.storeHousePage.length > 1 ? this.itemHeight + 1 : 1
        this.movableViewX = this.itemWidth - 0.1
        setTimeout(() => {
          this.movableViewY = this.storeHousePage.length > 1 ? this.itemHeight : 0
          this.movableViewX = this.itemWidth
        }, 0)
      })
    },
    async getCateGory() {
      this.categoryLoading = true
      const response = await Sku.spuClassTreeView({data: {}}).catch(() => {
        this.categoryLoading = false
      });
      const {
        data
      } = response;
      this.cateGoryData = data || []
      this.categoryLoading = false
    },
    openBindSkuClass(store) {
      this.classShow = true
      this.classList = store.classList || []
      this.storeId = store.key || []
    },
    saveBindSkuClass() {
      this.saveBindSkuClassLoading = true
      Storehouse.storeHouseEditV2_0({
        data: {
          storehouseId: this.storeId,
          spuClassIds: this.classList.map(item => item.key),
        }
      }).then((res) => {
        this.classShow = false
        this.storeHouseList = this.storeHouseList.map(item => {
          if (item.key === this.storeId) {
            return {...item, objects: this.classList.map(item => item.title)}
          }
          return item
        })
        this.tree = this.editStoreHouseChildren({
          key: this.storeId,
          objects: this.classList.map(item => item.title)
        }, this.tree)
        this.$refs.modal.dialog({
          title: '保存成功！'
        })
      }).catch(() => {
        this.$refs.modal.dialog({
          title: '保存失败！'
        })
      }).finally(() => {
        this.saveBindSkuClassLoading = false
      })
    },
    onCheckList(checkItem) {
      if (this.checkList.find(item => item.key === checkItem.key)) {
        this.checkList = this.checkList.filter(item => item.key !== checkItem.key)
      } else {
        this.checkList = [...this.checkList, checkItem]
      }
    },
    batchDelete() {
      const ids = this.checkList.map(item => item.key)
      const _this = this
      this.$refs.modal.dialog({
        title: '删除后不可恢复，是否确认删除？',
        only: false,
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Storehouse.storeHouseDeleteBatch({
              data: {
                storehouseIds: ids
              }
            }).then(() => {
              _this.listChange(_this.storeHouseList.filter(item => !ids.find(id => id === item.key)))
              _this.tree = delStoreIdsChildren(ids, _this.tree)
              _this.checkList = []
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

.deptTree {
  height: 50vh;
  overflow: auto;
}


</style>
